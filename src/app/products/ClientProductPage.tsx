"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import {
  Container,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import {
  NewestSparkle,
  SoonSparkle,
  SparklesTextDemo,
  TrendingSparkle,
} from "@/components/Nyxb/Sparkle";

// Props to pass the products fetched from the server
interface ClientProductPageProps {
  products: any[];
  newProducts: any[];
  trendingProducts: any[];
  soonProducts: any[];
}

// Helper function to extract unique colors from product variants
const extractColorsFromVariants = (products: any[]) => {
  const colorsSet = new Set<string>();
  products.forEach((product) => {
    product.variants.forEach((variant: any) => {
      if (variant.color) {
        colorsSet.add(variant.color);
      }
    });
  });
  return Array.from(colorsSet);
};

// Helper function to extract unique item types from the product type field
const extractItemTypesFromProducts = (products: any[]) => {
  const itemTypesSet = new Set<string>();
  products.forEach((product) => {
    if (product.type) {
      itemTypesSet.add(product.type);
    }
  });
  return Array.from(itemTypesSet);
};

// Client-side component
export default function ClientProductPage({
  products,
  newProducts,
  trendingProducts,
  soonProducts,
}: ClientProductPageProps) {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedItemType, setSelectedItemType] = useState<string>("");

  const availableColors = extractColorsFromVariants(products);
  const availableItemTypes = extractItemTypesFromProducts(products);

  const handleColorChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedColor(event.target.value as string);
  };

  const handleItemTypeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedItemType(event.target.value as string);
  };

  // Filter products by selected color and item type
  const filteredProducts = products.filter((product) =>
    product.variants.some(
      (variant: any) =>
        (selectedColor === "" || variant.color === selectedColor) &&
        (selectedItemType === "" || product.type === selectedItemType)
    )
  );

  // Helper to render product grids
  const renderProductGrid = (products: any[], keyPrefix: string) => (
    <div className="my-4 grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard product={product} key={keyPrefix + product.id} />
        ))
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );

  return (
    <>
      <Container maxWidth="md">
        <SparklesTextDemo />

        {/* Filters */}
        <Grid container spacing={2} className="my-4">
          <Grid item xs={6}>
            {/* Color Filter */}
            <FormControl fullWidth>
              {/* <InputLabel id="color-filter-label">Filter by Color</InputLabel> */}
              <Select
                labelId="color-filter-label"
                id="color-filter"
                value={selectedColor}
                onChange={handleColorChange}
                displayEmpty
              >
                <MenuItem value="">
                  <em>All Colors</em>
                </MenuItem>
                {availableColors.map((color) => (
                  <MenuItem key={color} value={color}>
                    {color}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            {/* Item Type Filter */}
            <FormControl fullWidth>
              {/* <InputLabel id="item-type-filter-label">
                Filter by Item Type
              </InputLabel> */}
              <Select
                labelId="item-type-filter-label"
                id="item-type-filter"
                value={selectedItemType}
                onChange={handleItemTypeChange}
                displayEmpty
              >
                <MenuItem value="">
                  <em>All Item Types</em>
                </MenuItem>
                {availableItemTypes.map((itemType) => (
                  <MenuItem key={itemType} value={itemType}>
                    {itemType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Render filtered products */}
        {renderProductGrid(filteredProducts, "product-")}
      </Container>

      <div className="bg-emerald-200 rounded">
        <Container maxWidth="md" className="p-4">
          <TrendingSparkle />
          {renderProductGrid(trendingProducts, "trendingProduct-")}
        </Container>
      </div>

      <Container maxWidth="md" className="p-4">
        <NewestSparkle />
        {renderProductGrid(newProducts, "newProduct-")}
      </Container>

      <div className="bg-emerald-200 rounded">
        <Container maxWidth="md" className="p-4">
          <SoonSparkle />
          {renderProductGrid(soonProducts, "soonProduct-")}
        </Container>
      </div>
    </>
  );
}
