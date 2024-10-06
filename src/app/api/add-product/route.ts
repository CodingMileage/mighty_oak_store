// src/app/api/add-product/route.ts
import { NextRequest, NextResponse } from "next/server";

// Define the expected structure of the request
interface SizeVariant {
  size: string;
  quantity: number;
}

interface ProductData {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  comingSoon: boolean;
  sizeVariants: SizeVariant[];
}

// Handle the POST request
export const POST = async (req: NextRequest) => {
  try {
    // Ensure that you are parsing the request body as JSON
    const { name, description, price, comingSoon, sizeVariants } =
      await req.json();

    // Validate the received data
    if (!name || !description || !price || !sizeVariants) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Parse sizeVariants if it's a JSON string
    const parsedSizeVariants: SizeVariant[] =
      typeof sizeVariants === "string"
        ? JSON.parse(sizeVariants)
        : sizeVariants || []; // Default to empty array if sizeVariants is not provided

    // Construct the product data
    const productData: ProductData = {
      name,
      description,
      price: parseFloat(price), // Make sure this is a valid number
      imageUrl: req.body.imageUrl || "", // Handle this based on how the file is uploaded
      comingSoon: comingSoon === "true", // Convert to boolean
      sizeVariants: parsedSizeVariants,
    };

    // Save to your database (this is a placeholder)
    // await db.collection('products').add(productData); // Add your database logic here

    // Respond with success
    return NextResponse.json(
      { message: "Product added successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { message: "Error adding product." },
      { status: 500 }
    );
  }
};
