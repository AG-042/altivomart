import { notFound } from "next/navigation";
import { fetchProduct } from "@/lib/api";
import { ProductDetails } from "@/components/product-details";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
