"use client";

import { addProduct } from "./add-product";
import { useState } from "react";
import FormSubmitButton from "@/components/FormSubmitButton";

export default function AddProductPage() {
  const [variants, setVariants] = useState([
    { size: "", color: "", price: 0, quantity: 0 },
  ]);

  const addVariant = () => {
    setVariants([...variants, { size: "", color: "", price: 0, quantity: 0 }]);
  };

  const updateVariant = (index, key, value) => {
    const newVariants = [...variants];
    newVariants[index][key] = value;
    setVariants(newVariants);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    // Add variants data as a JSON string to the form data
    formData.append("variants", JSON.stringify(variants));

    await addProduct(formData);
  };

  return (
    <div>
      <h1 className="text-lg mb-3 font-bold">Add Product</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
        {/* Color */}
        <input
          name="color"
          placeholder="Color"
          type="text"
          className="bg-white mb-3 w-full input input-bordered"
        />
        <input
          name="type"
          placeholder="Type"
          type="text"
          className="bg-white mb-3 w-full input input-bordered"
        />
        {/* <input
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
        /> */}

        <div className="mb-3">
          <label className="block font-semibold mb-2">Variants</label>
          {variants.map((variant, index) => (
            <div key={index} className="border p-3 mb-3">
              <input
                name={`variantSize-${index}`}
                placeholder="Size"
                type="text"
                value={variant.size}
                onChange={(e) => updateVariant(index, "size", e.target.value)}
                className="bg-white mb-3 w-full input input-bordered"
              />
              <input
                name={`variantPrice-${index}`}
                placeholder="Price"
                type="number"
                // value={variant.price}
                onChange={(e) =>
                  updateVariant(index, "price", parseFloat(e.target.value))
                }
                className="bg-white mb-3 w-full input input-bordered"
              />
              <input
                name={`variantQuantity-${index}`}
                placeholder="Quantity"
                type="number"
                // value={variant.quantity}
                onChange={(e) =>
                  updateVariant(index, "quantity", parseInt(e.target.value))
                }
                className="bg-white mb-3 w-full input input-bordered"
              />
            </div>
          ))}
          <button type="button" onClick={addVariant} className="btn mb-3">
            Add Another Variant
          </button>
        </div>

        <input
          required
          name="imageUrl"
          placeholder="Image URL"
          type="file"
          multiple
          className="bg-white mb-3 w-full"
        />

        <div className="mb-3">
          <label className="block font-semibold mb-2">Coming Soon?</label>
          <input
            type="checkbox"
            name="comingSoon"
            value="true"
            className="mr-2"
          />
          <label>Yes</label>
        </div>

        <div className="mb-3">
          <label className="block font-semibold mb-2">Bundle?</label>
          <input type="checkbox" name="bundle" value="true" className="mr-2" />
          <label>Yes</label>
        </div>

        <FormSubmitButton className="btn-block">Add Product</FormSubmitButton>
      </form>
    </div>
  );
}
