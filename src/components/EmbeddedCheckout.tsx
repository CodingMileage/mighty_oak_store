"use client";

import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useCallback, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";

export default function EmbeddedCheckoutButton() {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
  const [showCheckout, setShowCheckout] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const { data: session } = useSession(); // Get session client-side

  // Fetch client secret for the checkout session
  const fetchClientSecret = useCallback(() => {
    if (!session || !session.user.id) {
      console.error("Cart ID not found in session");
      return;
    }

    return fetch("/api/embedded-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartId: session.user.id }), // Use cartId from session
    })
      .then((res) => res.json())
      .then((data) => data.client_secret);
  }, [session]);

  const options = { fetchClientSecret };

  const handleCheckoutClick = () => {
    setShowCheckout(true);
    modalRef.current?.showModal();
  };

  const handleCloseModal = () => {
    setShowCheckout(false);
    modalRef.current?.close();
  };

  return (
    <div id="checkout" className="my-4 ">
      <button className="btn" onClick={handleCheckoutClick}>
        Checkout
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box w-100 max-w-screen-2xl bg-emerald-500 z-0">
          <h3 className="font-bold text-lg">Checkout</h3>
          <div className="py-4">
            {showCheckout && (
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={options}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            )}
          </div>
          <div className="modal-action">
            <form method="dialog">
              <Button
                className="bg-white text-black hover:bg-emerald-300"
                onClick={handleCloseModal}
              >
                Close
              </Button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
