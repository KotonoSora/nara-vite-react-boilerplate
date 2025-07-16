import type { Route } from "./+types/pricing";
import { PricingPage } from "~/features/pricing/page";

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const response = await fetch('http://localhost:5173/api/products/products');
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data: any = await response.json();
    return { products: data.products };
  } catch (error) {
    console.error('Error loading products:', error);
    return { products: [] };
  }
}

export function meta() {
  return [
    { title: "Pricing - NARA" },
    { 
      name: "description", 
      content: "Choose the perfect plan for your needs. Get started with our flexible pricing options." 
    },
  ];
}

export default function Route({ loaderData }: Route.ComponentProps) {
  return <PricingPage products={loaderData?.products || []} />;
}