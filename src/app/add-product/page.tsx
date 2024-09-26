import FormSubmitButton from "@/components/FormSubmitButton";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

export const metadata = {
  title: "Add Product",
};

async function uploadImage(file) {
  const uploadsDir = path.join(process.cwd(), "public/products");

  // Ensure the directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Create a unique filename
  const fileName = file.name;
  const filePath = path.join(uploadsDir, fileName);

  // Create a readable stream from the file buffer
  const buffer = await file.arrayBuffer(); // Get the file buffer
  const readable = new Readable();
  readable.push(Buffer.from(buffer));
  readable.push(null); // Signal the end of the stream

  // Write the file to the public/images directory
  const writeStream = fs.createWriteStream(filePath);
  readable.pipe(writeStream);

  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve(`/products/${fileName}`));
    writeStream.on("error", (err) => reject(err));
  });
}

async function addProduct(formData: FormData) {
  "use server";

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const price = Number(formData.get("price") || 0);
  const quantity = Number(formData.get("quantity") || 0);
  const imageFile = formData.get("imageUrl") as File;

  if (!name || !description || !imageFile || !price) {
    throw new Error("Missing requirements");
  }

  // Upload the image and get the local URL
  const imageUrl = await uploadImage(imageFile);

  await prisma.product.create({
    data: { name, description, imageUrl, price, quantity },
  });

  redirect("/");
}

export default function AddProductPage() {
  return (
    <div>
      <h1 className="text-lg mb-3 font-bold">Add Product</h1>
      <form action={addProduct}>
        <input
          required
          name="name"
          placeholder="Name"
          type="text"
          className="mb-3 w-full input input-bordered"
        />
        <textarea
          required
          name="description"
          placeholder="Description"
          className="textarea textarea-bordered mb-3 w-full"
        ></textarea>
        <input
          required
          name="price"
          placeholder="Price"
          type="number"
          className="mb-3 w-full input input-bordered"
        />
        <input
          required
          name="quantity"
          placeholder="Quantity"
          type="number"
          className="mb-3 w-full input input-bordered"
        />
        <input
          required
          name="imageUrl"
          placeholder="Image URL"
          type="file"
          className="mb-3 w-full"
        />
        <FormSubmitButton className="btn-block">Add Product</FormSubmitButton>
      </form>
    </div>
  );
}
