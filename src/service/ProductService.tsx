// service/ProductService.ts

const products = [
  {
    id: "1000",
    code: "f230fh0g3",
    name: "Bamboo Watch",
    description: "Product Description",
    image: "bamboo-watch.jpg",
    price: 65,
    category: "Accessories",
    quantity: 24,
    inventoryStatus: "INSTOCK",
    rating: 5,
  },
  // ... Add more products as needed
];

export const ProductService = {
  getProducts: () => Promise.resolve(products),
};
