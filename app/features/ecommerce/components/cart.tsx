import { useState } from "react";
import { ShoppingBag, X, Plus, Minus, ExternalLink } from "lucide-react";

import { useShopify, useCartCount, useCartTotal } from "~/contexts/shopify-context";
import { formatPrice } from "~/lib/shopify";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { AspectRatio } from "~/components/ui/aspect-ratio";

export function CartButton() {
  const cartCount = useCartCount();
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingBag className="h-4 w-4" />
          {cartCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {cartCount > 99 ? "99+" : cartCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <CartContent />
      </SheetContent>
    </Sheet>
  );
}

function CartContent() {
  const { cart, isCartLoading } = useShopify();
  const cartTotal = useCartTotal();

  if (isCartLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.lines.nodes.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add some products to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <SheetHeader>
        <SheetTitle>
          Shopping Cart ({cart.totalQuantity} item{cart.totalQuantity !== 1 ? 's' : ''})
        </SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-4">
          {cart.lines.nodes.map((line) => (
            <CartLineItem key={line.id} line={line} />
          ))}
        </div>
      </div>

      <div className="border-t pt-4 space-y-4">
        {/* Cart totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>
              {formatPrice(
                cart.cost.subtotalAmount.amount,
                cart.cost.subtotalAmount.currencyCode
              )}
            </span>
          </div>
          
          {cart.cost.totalTaxAmount && (
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>
                {formatPrice(
                  cart.cost.totalTaxAmount.amount,
                  cart.cost.totalTaxAmount.currencyCode
                )}
              </span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>
              {cartTotal?.formatted}
            </span>
          </div>
        </div>

        {/* Checkout button */}
        <Button asChild className="w-full" size="lg">
          <a href={cart.checkoutUrl} target="_blank" rel="noopener noreferrer">
            Checkout
            <ExternalLink className="h-4 w-4 ml-2" />
          </a>
        </Button>
      </div>
    </div>
  );
}

interface CartLineItemProps {
  line: {
    id: string;
    quantity: number;
    cost: {
      totalAmount: {
        amount: string;
        currencyCode: string;
      };
    };
    merchandise: {
      id: string;
      title: string;
      selectedOptions: Array<{
        name: string;
        value: string;
      }>;
      product: {
        id: string;
        title: string;
        handle: string;
        featuredImage?: {
          id: string;
          url: string;
          altText?: string;
          width: number;
          height: number;
        };
      };
    };
  };
}

function CartLineItem({ line }: CartLineItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  // Note: In a real implementation, you would need to implement
  // updateCartLine and removeCartLine functions in the Shopify client
  
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      // TODO: Implement cart line update functionality
      console.log("Update quantity to:", newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      // TODO: Implement cart line removal functionality
      console.log("Remove item:", line.id);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const variantTitle = line.merchandise.selectedOptions
    .filter(option => option.value !== "Default Title")
    .map(option => option.value)
    .join(" / ");

  return (
    <div className="flex gap-4 p-4 border rounded-lg">
      <div className="flex-shrink-0 w-16">
        <AspectRatio ratio={1}>
          {line.merchandise.product.featuredImage ? (
            <img
              src={line.merchandise.product.featuredImage.url}
              alt={line.merchandise.product.featuredImage.altText || line.merchandise.product.title}
              className="object-cover w-full h-full rounded"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-400 text-xs">No image</span>
            </div>
          )}
        </AspectRatio>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{line.merchandise.product.title}</h4>
            {variantTitle && (
              <p className="text-sm text-muted-foreground">{variantTitle}</p>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={isUpdating}
            className="h-6 w-6 ml-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border rounded">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(line.quantity - 1)}
              disabled={isUpdating || line.quantity <= 1}
              className="h-8 w-8"
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <span className="px-3 py-1 text-sm font-medium min-w-[3rem] text-center">
              {line.quantity}
            </span>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(line.quantity + 1)}
              disabled={isUpdating}
              className="h-8 w-8"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <span className="font-semibold">
            {formatPrice(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)}
          </span>
        </div>
      </div>
    </div>
  );
}