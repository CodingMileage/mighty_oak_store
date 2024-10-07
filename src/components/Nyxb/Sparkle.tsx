import SparklesText from "@/components/ui/sparkles-text";

export async function SparklesTextDemo() {
  return <SparklesText text="Our Collection" />;
}

export async function NewestSparkle() {
  return <SparklesText text="New Arrivals" />;
}

export async function SoonSparkle() {
  return <SparklesText text="Coming Soon" />;
}

export async function TrendingSparkle() {
  return (
    <SparklesText
      text="Trending Products"
      // colors={{ first: "#FE8FB5", second: "#03fc77" }}
    />
  );
}

export async function SimilarSparkle() {
  return (
    <SparklesText
      text="Similar Products"
      // colors={{ first: "#FE8FB5", second: "#03fc77" }}
    />
  );
}

export async function BundleSparkle() {
  return (
    <SparklesText
      text="Bundles"
      // colors={{ first: "#FE8FB5", second: "#03fc77" }}
    />
  );
}
