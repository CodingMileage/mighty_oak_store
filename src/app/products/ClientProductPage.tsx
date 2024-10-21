"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import {
  Container,
  MenuItem,
  Select,
  FormControl,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  NewestSparkle,
  SoonSparkle,
  SparklesTextDemo,
  TrendingSparkle,
} from "@/components/Nyxb/Sparkle";
import { SelectChangeEvent } from "@mui/material";

// Define the Variant and Product types
interface Variant {
  color?: string;
  size?: string;
}

interface Product {
  id: string;
  type: string;
  variants: Variant[];
}

// Props to pass the products fetched from the server
interface ClientProductPageProps {
  products: Product[];
  newProducts: Product[];
  trendingProducts: Product[];
  soonProducts: Product[];
}

// Helper function to extract unique colors from product variants
const extractColorsFromVariants = (products: Product[]) => {
  const colorsSet = new Set<string>();
  products.forEach((product) => {
    product.variants.forEach((variant) => {
      if (variant.color) {
        colorsSet.add(variant.color);
      }
    });
  });
  return Array.from(colorsSet).sort(); // Sort the colors alphabetically
};

// Helper function to extract unique item types from the product type field
const extractItemTypesFromProducts = (products: Product[]) => {
  const itemTypesSet = new Set<string>();
  products.forEach((product) => {
    if (product.type) {
      itemTypesSet.add(product.type);
    }
  });
  return Array.from(itemTypesSet).sort(); // Sort the item types alphabetically
};

// Helper function to extract unique sizes from product variants
const extractSizesFromVariants = (products: Product[]) => {
  const sizesSet = new Set<string>();
  products.forEach((product) => {
    product.variants.forEach((variant) => {
      if (variant.size) {
        sizesSet.add(variant.size);
      }
    });
  });
  return Array.from(sizesSet).sort(); // Sort the sizes alphabetically
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
  const [selectedSize, setSelectedSize] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const availableColors = extractColorsFromVariants(products);
  const availableItemTypes = extractItemTypesFromProducts(products);
  const availableSizes = extractSizesFromVariants(products);

  const handleColorChange = (event: SelectChangeEvent<string>) => {
    setSelectedColor(event.target.value);
  };

  const handleItemTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedItemType(event.target.value);
  };

  const handleSizeChange = (event: SelectChangeEvent<string>) => {
    setSelectedSize(event.target.value);
  };

  // Filter products by selected color, item type, and size, memoized for performance
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.variants.some(
        (variant) =>
          (selectedColor === "" || variant.color === selectedColor) &&
          (selectedItemType === "" || product.type === selectedItemType) &&
          (selectedSize === "" || variant.size === selectedSize)
      )
    );
  }, [products, selectedColor, selectedItemType, selectedSize]);

  // Helper to render product grids
  const renderProductGrid = (products: Product[], keyPrefix: string) => (
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

  console.log(filteredProducts);

  return (
    <>
      <Container maxWidth="md">
        <SparklesTextDemo />

        {/* Filters */}
        <Grid container spacing={2} className="my-4">
          <Grid item xs={4}>
            {/* Item Type Filter */}
            <FormControl fullWidth>
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

          <Grid item xs={4}>
            {/* Size Filter */}
            <FormControl fullWidth>
              <Select
                labelId="size-filter-label"
                id="size-filter"
                value={selectedSize}
                onChange={handleSizeChange}
                displayEmpty
              >
                <MenuItem value="">
                  <em>All Sizes</em>
                </MenuItem>
                {availableSizes.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            {/* Color Filter */}
            <FormControl fullWidth>
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
        </Grid>

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          renderProductGrid(filteredProducts, "product-")
        )}
      </Container>

      <div className="bg-emerald-300 rounded">
        <Container maxWidth="md" className="p-4">
          <TrendingSparkle />
          {renderProductGrid(trendingProducts, "trendingProduct-")}
        </Container>
      </div>

      <Container maxWidth="md" className="p-4">
        <NewestSparkle />
        {renderProductGrid(newProducts, "newProduct-")}
      </Container>

      <div className="bg-emerald-300 rounded">
        <Container maxWidth="md" className="p-4">
          <SoonSparkle />
          {renderProductGrid(soonProducts, "soonProduct-")}
        </Container>
      </div>
    </>
  );
}
