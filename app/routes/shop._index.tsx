import type { Route } from "./+types/shop._index";

import { useShopify } from "~/contexts/shopify-context";
import { ProductGrid } from "~/features/ecommerce/components/product-card";
import { CollectionGrid } from "~/features/ecommerce/components/collection-card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Search, Filter } from "lucide-react";

export async function loader({ context }: Route.LoaderArgs) {
  try {
    // In a real implementation, you would get Shopify config from environment
    const shopifyConfig = {
      domain: process.env.SHOPIFY_DOMAIN || "your-shop.myshopify.com",
      storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "your-access-token",
    };

    // For now, return mock data or configuration
    return {
      shopifyConfig,
      // You could also pre-load some products or collections here
    };
  } catch (error) {
    console.error("Failed to load shop data:", error);
    return { shopifyConfig: null };
  }
}

export function meta() {
  return [
    { title: "Shop - NARA Shopify Store" },
    { name: "description", content: "Browse our collection of products powered by Shopify" },
  ];
}

export default function ShopIndex({ loaderData }: Route.ComponentProps) {
  const { shopifyConfig } = loaderData;

  if (!shopifyConfig) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Store Configuration Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              To use the Shopify integration, please configure your store settings:
            </p>
            <div className="space-y-2 text-sm">
              <p>1. Set <code>SHOPIFY_DOMAIN</code> environment variable</p>
              <p>2. Set <code>SHOPIFY_STOREFRONT_ACCESS_TOKEN</code> environment variable</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Shop</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collection of products, powered by Shopify
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="sr-only">Search products</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search products..."
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="best-selling">Best Selling</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Content */}
        <ShopDemo />
      </div>
    </div>
  );
}

function ShopDemo() {
  return (
    <Tabs defaultValue="products" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="collections">Collections</TabsTrigger>
      </TabsList>
      
      <TabsContent value="products" className="space-y-6">
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Products will appear here</h3>
          <p className="text-muted-foreground mb-4">
            Configure your Shopify store to see products
          </p>
          <Button variant="outline">
            View Documentation
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="collections" className="space-y-6">
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Collections will appear here</h3>
          <p className="text-muted-foreground mb-4">
            Configure your Shopify store to see collections
          </p>
          <Button variant="outline">
            View Documentation
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}