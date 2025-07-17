import { useState } from "react";
import type { Route } from "./+types/shop.products.$handle";

import { useShopify } from "~/contexts/shopify-context";
import { formatPrice, getFirstAvailableVariant, hasMultipleVariants } from "~/lib/shopify";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Separator } from "~/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ShoppingCart, Heart, Share2, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  const { handle } = params;
  
  // In a real implementation, you would fetch the product from Shopify
  // For now, return the handle so we can demonstrate the UI
  return {
    productHandle: handle,
    // product: await shopifyClient.getProduct(handle)
  };
}

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `${params.handle} - NARA Shopify Store` },
    { name: "description", content: `Product details for ${params.handle}` },
  ];
}

export default function ProductDetail({ loaderData }: Route.ComponentProps) {
  const { productHandle } = loaderData;
  const { addToCart, isCartLoading } = useShopify();
  
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // This would be replaced with actual product data from the loader
  const mockProduct = null;

  const handleAddToCart = async () => {
    if (!selectedVariantId) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart(selectedVariantId, quantity);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Product: ${productHandle}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!mockProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/shop">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Link>
          </Button>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Product: {productHandle}</h1>
            <p className="text-muted-foreground mb-6">
              This is a demo product page. Configure your Shopify store to see actual product data.
            </p>
            
            <div className="space-y-4">
              <ProductPageDemo productHandle={productHandle} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // The rest would be the actual product display logic
  return null;
}

function ProductPageDemo({ productHandle }: { productHandle: string }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <AspectRatio ratio={1}>
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Product Image</span>
            </div>
          </AspectRatio>
          
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <AspectRatio key={i} ratio={1}>
                <div className="w-full h-full bg-gray-100 rounded border cursor-pointer hover:border-primary">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs text-gray-400">{i}</span>
                  </div>
                </div>
              </AspectRatio>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold capitalize">
              {productHandle.replace(/-/g, ' ')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Demo Product</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">$99.99</span>
            <Badge variant="destructive">Demo</Badge>
          </div>

          <Separator />

          {/* Variant Selection Demo */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Size</Label>
              <RadioGroup defaultValue="m" className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="s" id="s" />
                  <Label htmlFor="s">Small</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="m" id="m" />
                  <Label htmlFor="m">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="l" id="l" />
                  <Label htmlFor="l">Large</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-semibold">Color</Label>
              <RadioGroup defaultValue="black" className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="black" id="black" />
                  <Label htmlFor="black">Black</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="white" id="white" />
                  <Label htmlFor="white">White</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button className="flex-1" size="lg" disabled>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart (Demo)
              </Button>
              
              <Button variant="outline" size="lg">
                <Heart className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="lg">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              * This is a demo product. Configure your Shopify store to enable purchasing.
            </p>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                This is a demo product description. In a real Shopify integration, 
                this would display the actual product description from your store.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Material:</span>
                  <span>Demo Material</span>
                </div>
                <div className="flex justify-between">
                  <span>SKU:</span>
                  <span>DEMO-{productHandle}</span>
                </div>
                <div className="flex justify-between">
                  <span>Weight:</span>
                  <span>1.0 kg</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                Product reviews would appear here in a real integration.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}