import { useState } from "react";
import { ShoppingCart, Heart, Eye } from "lucide-react";

import type { ShopifyProduct } from "~/lib/shopify";
import { formatPrice, getFirstAvailableVariant } from "~/lib/shopify";
import { useShopify } from "~/contexts/shopify-context";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { AspectRatio } from "~/components/ui/aspect-ratio";

interface ProductCardProps {
  product: ShopifyProduct;
  onQuickView?: (product: ShopifyProduct) => void;
  className?: string;
}

export function ProductCard({ product, onQuickView, className }: ProductCardProps) {
  const { addToCart, isCartLoading } = useShopify();
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const firstVariant = getFirstAvailableVariant(product);
  const firstImage = product.images.nodes[0];
  const isOnSale = firstVariant?.compareAtPrice && 
    parseFloat(firstVariant.compareAtPrice.amount) > parseFloat(firstVariant.price.amount);

  const handleAddToCart = async () => {
    if (!firstVariant) return;
    
    setIsLoading(true);
    try {
      await addToCart(firstVariant.id, 1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    // Here you could integrate with a wishlist API
  };

  return (
    <Card className={`group hover:shadow-lg transition-shadow ${className}`}>
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <AspectRatio ratio={1}>
            {firstImage ? (
              <img
                src={firstImage.url}
                alt={firstImage.altText || product.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </AspectRatio>

          {/* Sale badge */}
          {isOnSale && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Sale
            </Badge>
          )}

          {/* Quick actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              onClick={handleWishlistToggle}
              className="h-8 w-8"
            >
              <Heart 
                className={`h-4 w-4 ${isWishlisted ? 'fill-current text-red-500' : ''}`} 
              />
            </Button>
            
            {onQuickView && (
              <Button
                size="icon"
                variant="secondary"
                onClick={() => onQuickView(product)}
                className="h-8 w-8"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Out of stock overlay */}
          {!product.availableForSale && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary">Out of Stock</Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="space-y-2">
            {/* Vendor */}
            {product.vendor && (
              <p className="text-sm text-muted-foreground">{product.vendor}</p>
            )}

            {/* Title */}
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {product.title}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="font-bold">
                {formatPrice(
                  product.priceRange.minVariantPrice.amount,
                  product.priceRange.minVariantPrice.currencyCode
                )}
              </span>
              
              {isOnSale && firstVariant?.compareAtPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(
                    firstVariant.compareAtPrice.amount,
                    firstVariant.compareAtPrice.currencyCode
                  )}
                </span>
              )}
            </div>

            {/* Product type */}
            {product.productType && (
              <Badge variant="outline" className="text-xs">
                {product.productType}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={!product.availableForSale || !firstVariant || isLoading || isCartLoading}
          className="w-full"
        >
          {isLoading || isCartLoading ? (
            "Adding..."
          ) : !product.availableForSale ? (
            "Out of Stock"
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

interface ProductGridProps {
  products: ShopifyProduct[];
  onQuickView?: (product: ShopifyProduct) => void;
  className?: string;
}

export function ProductGrid({ products, onQuickView, className }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}