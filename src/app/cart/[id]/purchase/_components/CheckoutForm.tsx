"use client";

import {
  CardTitle,
  Card,
  CardHeader,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { CardContent } from "@mui/material";
import { Button } from "@/components/ui/button";
import {
  AddressElement,
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { FormEvent, useState } from "react";

type CheckoutFormProps = {
  cart: {
    subtotal: number;
    items: Array<{
      product: {
        name: string;
        imageUrl: string;
        price: number;
      };
      quantity: number;
    }>;
  };
  clientSecret: string;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export function CheckoutForm({ cart, clientSecret }: CheckoutFormProps) {
  console.log("Cart: ", cart); // Debugging to check cart structure

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <div>Items in Cart</div>
      <div className="flex">
        {cart.items.map((cartItem, index) => (
          <div className="p-3" key={index}>
            <Image
              src={cartItem.product.imageUrl}
              alt="Product"
              width={50}
              height={50}
            />
            <h3>{cartItem.product.name}</h3>
            <h3>Quantity: {cartItem.quantity}</h3>
            <h3>
              Price: {formatPrice(cartItem.product.price * cartItem.quantity)}
            </h3>
          </div>
        ))}
      </div>

      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <Form subtotal={cart.subtotal} />
      </Elements>
    </div>
  );
}

function Form({ subtotal }: { subtotal: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string>();
  const [address, setAddress] = useState<string>("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (stripe == null || elements == null) return;

    setIsLoading(true);
    setErrorMessage(null); // Reset error message before submission

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
          payment_method_data: {
            billing_details: {
              email: email,
              address: {
                line1: address, // Assuming the address captured is line1
              },
            },
          },
        },
      })
      .then(({ error }) => {
        if (error) {
          if (
            error.type === "card_error" ||
            error.type === "validation_error"
          ) {
            setErrorMessage(error.message);
          } else {
            setErrorMessage("An unknown error occurred");
          }
        }
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className="mt-4">
            <LinkAuthenticationElement />
          </div>
          <AddressElement
            options={{ mode: "shipping" }}
            onChange={(event) => {
              if (event.complete) {
                // Extract the complete address
                const address = [
                  event.value.address.line1,
                  event.value.address.line2,
                  event.value.address.city,
                  event.value.address.state,
                  event.value.address.postal_code,
                  event.value.address.country,
                ]
                  .filter(Boolean)
                  .join(", ");
                setAddress(address);
              }
            }}
          />
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-blue-700 text-white"
            disabled={stripe == null || elements == null || isLoading}
          >
            {isLoading
              ? "Purchasing..."
              : `Purchase - ${formatPrice(subtotal)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
