"use server";

import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

// Function to upload product images
async function uploadImages(files: FileList) {
  const uploadsDir = path.join(process.cwd(), "public/products");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const uploadPromises = Array.from(files).map(async (file) => {
    const fileName = `${file.name}`;
    const filePath = path.join(uploadsDir, fileName);

    const buffer = await file.arrayBuffer();
    const readable = new Readable();
    readable.push(Buffer.from(buffer));
    readable.push(null);

    const writeStream = fs.createWriteStream(filePath);
    readable.pipe(writeStream);

    return new Promise<string>((resolve, reject) => {
      writeStream.on("finish", () => resolve(`/products/${fileName}`));
      writeStream.on("error", (err) => reject(err));
    });
  });

  return Promise.all(uploadPromises);
}

// Function to handle product creation with variants
export async function addProduct(formData: FormData) {
  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const price = Number(formData.get("price") || 0);
  const quantity = Number(formData.get("quantity") || 0);
  const imageFiles = formData.getAll("imageUrl") as FileList;
  const comingSoon = formData.get("comingSoon") === "true";
  const bundle = formData.get("bundle") === "true";
  const color = formData.get("color")?.toString();
  const type = formData.get("type")?.toString();
  const rating = Number(formData.get("rating") || 0);

  // Parse variants from form data (assuming it's a JSON string)
  const variants = JSON.parse(formData.get("variants")?.toString() || "[]");

  const totalQuantity = variants.reduce(
    (total, variant) => total + (variant.quantity || 0),
    0
  );

  //   if (!name || !description || !imageFiles.length || !price) {
  //     throw new Error("Missing required fields");
  //   }

  const imageUrl = await uploadImages(imageFiles);

  // Store product and its details in the database
  const product = await prisma.product.create({
    data: {
      name,
      description,
      imageUrl,
      price,
      quantity: totalQuantity,
      comingSoon,
      bundle,
      color,
      type,
      rating,
    },
  });

  // Store product variants
  if (variants.length > 0) {
    await prisma.productVariant.createMany({
      data: variants.map((variant) => ({
        productId: product.id,
        price: variant.price,
        quantity: variant.quantity,
        size: variant.size,
        color: product.color,
        imageUrl: product.imageUrl,
      })),
    });
  }

  redirect("/");
}
