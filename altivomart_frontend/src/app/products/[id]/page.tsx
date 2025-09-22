import { notFound } from "next/navigation";
import { fetchProduct } from "@/lib/api";
import { ProductDetails } from "@/components/product-details";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await fetchProduct(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
