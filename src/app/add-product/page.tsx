import FormSubmitButton from "@/components/FormSubmitButton";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

export const metadata = {
  title: "Add Product",
};

async function uploadImage(file: File) {
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

  // Write the file to the public/products directory
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
  const comingSoon = formData.get("comingSoon") === "true";
  const size = formData.get("size")?.toString();
  const color = formData.get("color")?.toString();
  const type = formData.get("type")?.toString();
  const rating = Number(formData.get("rating") || 0);

  if (!name || !description || !imageFile || !price) {
    throw new Error("Missing required fields");
  }

  // Upload the image and get the URL
  const imageUrl = await uploadImage(imageFile);

  // Save product in database
  await prisma.product.create({
    data: {
      name,
      description,
      imageUrl,
      price,
      quantity,
      comingSoon,
      size,
      color,
      type,
      rating,
    },
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
          className="mb-3 bg-white w-full input input-bordered"
        />
        <textarea
          required
          name="description"
          placeholder="Description"
          className="bg-white textarea textarea-bordered mb-3 w-full"
        ></textarea>
        <input
          required
          name="price"
          placeholder="Price"
          type="number"
          className="bg-white mb-3 w-full input input-bordered"
        />
        <input
          required
          name="quantity"
          placeholder="Quantity"
          type="number"
          className="bg-white mb-3 w-full input input-bordered"
        />

        {/* Size */}
        <input
          name="size"
          placeholder="Size"
          type="text"
          className="bg-white mb-3 w-full input input-bordered"
        />

        {/* Color */}
        <input
          name="color"
          placeholder="Color"
          type="text"
          className="bg-white mb-3 w-full input input-bordered"
        />

        {/* Type */}
        <input
          name="type"
          placeholder="Type"
          type="text"
          className="bg-white mb-3 w-full input input-bordered"
        />

        {/* Rating */}
        {/* <input
          name="rating"
          placeholder="Rating (out of 5)"
          type="number"
          step="0.1"
          max={5}
          className="bg-white mb-3 w-full input input-bordered"
        /> */}
        <input
          required
          name="imageUrl"
          placeholder="Image URL"
          type="file"
          className="bg-white mb-3 w-full"
        />

        {/* Coming Soon */}
        <div className="mb-3">
          <label className="block font-semibold mb-2">
            Is this product coming soon?
          </label>
          <div>
            <input
              type="radio"
              id="comingSoonTrue"
              name="comingSoon"
              value="true"
              className="mr-2"
              required
            />
            <label htmlFor="comingSoonTrue" className="mr-5">
              Yes
            </label>

            <input
              type="radio"
              id="comingSoonFalse"
              name="comingSoon"
              value="false"
              className="mr-2"
              required
            />
            <label htmlFor="comingSoonFalse">No</label>
          </div>
        </div>

        <FormSubmitButton className="btn-block">Add Product</FormSubmitButton>
      </form>
    </div>
  );
}
