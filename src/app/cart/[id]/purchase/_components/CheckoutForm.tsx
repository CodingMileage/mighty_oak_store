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
import { useRouter } from "next/navigation";

type CheckoutFormProps = {
  cart: {
    subtotal: number;
    items: Array<{
      variantId: any;
      product: {
        color: string;
        type: string;
        name: string;
        imageUrl: string;
        price: number;
        variants: Array<{
          id: number;
          price: number;
          quantity: number;
        }>;
      };
      quantity: number;
    }>;
  };
  clientSecret: string;
  metadata: { email: string; userId: string };
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export function CheckoutForm({ cart, clientSecret }: CheckoutFormProps) {
  console.log(
    "Cart: ",
    cart.items.map((item) => item.product.variants)
  );

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <div>Items in Cart</div>
      <div className="flex">
        {cart.items.map((cartItem, index) => {
          // Find the correct variant using the variantId
          const selectedVariant = cartItem.product.variants.find(
            (variant: any) => variant.id === cartItem.variantId
          );

          return (
            <div className="p-3" key={index}>
              <Image
                src={cartItem.product.imageUrl[0]} // Adjust if needed for the actual structure
                alt="Product"
                width={50}
                height={50}
              />
              <h3>{cartItem.product.name}</h3>
              <h3>Quantity: {cartItem.quantity}</h3>

              {/* Display variant-specific price and other details */}
              {selectedVariant ? (
                <div>
                  <h3>Price: {formatPrice(selectedVariant.price)}</h3>
                </div>
              ) : (
                <h3>Variant not found</h3>
              )}
            </div>
          );
        })}
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
  const [name, setName] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const [addressDetails, setAddressDetails] = useState<{
    line1?: string;
    city?: string;
    state?: string;
  }>({});

  const router = useRouter();

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
              name: name,
              phone: phone,
              email: email,
              address: {
                line1: addressDetails.line1,
                city: addressDetails.city,
                state: addressDetails.state, // Assuming the address captured is line1
                // Assuming the address captured is line1
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
        } else {
          // Success! Handle the redirection or display success message
          //Rounter here
          // window.location.href = `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`;
          router.push("/stripe/purchase-success");
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
                setAddressDetails({
                  city: event.value.address.city,
                  line1: event.value.address.line1,
                  state: event.value.address.state,
                });
                setName(event.value.name);
                setPhone(event.value.phone);
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
