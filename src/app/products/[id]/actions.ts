"use server";

import { createCart, getCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function incrementProductQuantity(
  productId: string,
  variantId: string
) {
  const cart = (await getCart()) ?? (await createCart());

  // Check if the article (product + variant) is already in the cart
  const articleInCart = cart.items.find(
    (item) => item.productId === productId && item.variantId === variantId
  );

  if (articleInCart) {
    // Increment the quantity of the existing item
    await prisma.cartItem.update({
      where: { id: articleInCart.id },
      data: { quantity: { increment: 1 } },
    });
  } else {
    // Create a new cart item for the product variant
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId, // Store the variantId along with the productId
        quantity: 1,
      },
    });
  }

  // Revalidate the path for cache updates
  revalidatePath("/products/[id]");
}
