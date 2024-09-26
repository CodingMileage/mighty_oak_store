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
