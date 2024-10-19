import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import { Cart, CartItem, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type CartWithProducts = Prisma.CartGetPayload<{
  include: { items: { include: { product: { include: { variants: true } } } } };
}>;

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: { product: { include: { variants: true } } };
}>;

export type ShoppingCart = CartWithProducts & {
  size: number;
  subtotal: number;
};

export async function getCart(): Promise<ShoppingCart | null> {
  const session = await getServerSession(authOptions);

  let cart: CartWithProducts | null = null;

  if (session) {
    cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                variants: true,
              },
            },
          },
        },
      },
    });
  } else {
    const localCartId = cookies().get("localCartId")?.value;
    cart = localCartId
      ? await prisma.cart.findUnique({
          where: { id: localCartId },
          include: {
            items: {
              include: {
                product: {
                  include: {
                    variants: true,
                  },
                },
              },
            },
          },
        })
      : null;
  }

  if (!cart) {
    return null;
  }

  return {
    ...cart,
    size: cart.items.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: cart.items.reduce((acc, item) => {
      // Find the selected variant price based on the variantId in the cart item
      const variant = item.product.variants.find(
        (variant) => variant.id === item.variantId
      );

      // Use the variant price if available, else fallback to the base product price
      const variantPrice = variant ? variant.price : item.product.price;

      return acc + item.quantity * variantPrice;
    }, 0),
  };
}

export async function createCart(): Promise<ShoppingCart> {
  const session = await getServerSession(authOptions);

  let newCart: Cart;

  if (session) {
    newCart = await prisma.cart.create({
      data: { userId: session.user.id },
    });
  } else {
    newCart = await prisma.cart.create({
      data: {},
    });
  }

  //Needs encryption + secure settings!!!!
  cookies().set("localCartId", newCart.id);

  return {
    ...newCart,
    items: [],
    size: 0,
    subtotal: 0,
  };
}

export async function mergeAnonCartIntoUserCart(userId: string) {
  const localCartId = cookies().get("localCartId")?.value;

  const localCart = localCartId
    ? await prisma.cart.findUnique({
        where: { id: localCartId },
        include: { items: true },
      })
    : null;

  if (!localCart) return;

  const userCart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: true },
  });

  await prisma.$transaction(async (tx) => {
    if (userCart) {
      const mergedCartItems = mergeCartItems(localCart.items, userCart.items);

      // Clear existing items in the user's cart
      await tx.cartItem.deleteMany({
        where: { cartId: userCart.id },
      });

      // Insert the merged items into the user's cart
      await tx.cartItem.createMany({
        data: mergedCartItems.map((item) => ({
          cartId: userCart.id,
          productId: item.productId,
          variantId: item.variantId, // Include the variantId
          quantity: item.quantity,
        })),
      });
    } else {
      // Create a new cart for the user with the items from the anonymous cart
      await tx.cart.create({
        data: {
          userId,
          items: {
            createMany: {
              data: localCart.items.map((item) => ({
                productId: item.productId,
                variantId: item.variantId, // Include the variantId
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    }

    // Delete the anonymous cart
    await tx.cart.delete({
      where: { id: localCart.id },
    });

    // Clear the localCartId cookie
    cookies().set("localCartId", "");
  });
}

function mergeCartItems(...cartItems: CartItem[][]) {
  return cartItems.reduce((acc, items) => {
    items.forEach((item) => {
      // Find existing item by productId and variantId
      const existingItem = acc.find(
        (i) => i.productId === item.productId && i.variantId === item.variantId
      );

      if (existingItem) {
        // If the item with the same productId and variantId exists, update its quantity
        existingItem.quantity += item.quantity;
      } else {
        // Otherwise, add the new item to the cart
        acc.push(item);
      }
    });
    return acc;
  }, [] as CartItem[]);
}

export async function clearCart(): Promise<void> {
  const session = await getServerSession(authOptions);

  let cartId: string | null = null;

  if (session) {
    // Fetch the cart for the logged-in user
    const cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
    });

    if (cart) {
      cartId = cart.id;
    }
  } else {
    // Fetch the cart for the anonymous user (using cookies)
    cartId = cookies().get("localCartId")?.value || null;
  }

  if (!cartId) {
    console.error("Cart not found.");
    return;
  }

  // Clear cart items
  await prisma.cartItem.deleteMany({
    where: { cartId },
  });

  // Optionally, delete the cart itself if needed
  // await prisma.cart.delete({
  //   where: { id: cartId },
  // });

  // If it's an anonymous cart, clear the local cart cookie
  if (!session) {
    cookies().set("localCartId", "");
  }
}

