import { createContext, useContext, useEffect, useState } from "react";

import type {
  ShopifyCart,
  ShopifyConfig,
  ShopifyProduct,
} from "~/lib/shopify";
import { ShopifyStorefrontClient } from "~/lib/shopify";

interface ShopifyContextValue {
  client: ShopifyStorefrontClient | null;
  cart: ShopifyCart | null;
  cartId: string | null;
  isCartLoading: boolean;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  createCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const ShopifyContext = createContext<ShopifyContextValue | null>(null);

interface ShopifyProviderProps {
  children: React.ReactNode;
  config?: ShopifyConfig;
}

export function ShopifyProvider({ children, config }: ShopifyProviderProps) {
  const [client, setClient] = useState<ShopifyStorefrontClient | null>(null);
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isCartLoading, setIsCartLoading] = useState(false);

  // Initialize client when config is provided
  useEffect(() => {
    if (config) {
      setClient(new ShopifyStorefrontClient(config));
    }
  }, [config]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCartId = localStorage.getItem("shopify-cart-id");
    if (savedCartId) {
      setCartId(savedCartId);
    }
  }, []);

  // Load cart data when cartId changes
  useEffect(() => {
    if (client && cartId) {
      refreshCart();
    }
  }, [client, cartId]);

  const createCart = async () => {
    if (!client) {
      throw new Error("Shopify client not initialized");
    }

    setIsCartLoading(true);
    try {
      const { cartId: newCartId } = await client.createCart();
      setCartId(newCartId);
      localStorage.setItem("shopify-cart-id", newCartId);
    } catch (error) {
      console.error("Failed to create cart:", error);
      throw error;
    } finally {
      setIsCartLoading(false);
    }
  };

  const addToCart = async (variantId: string, quantity: number) => {
    if (!client) {
      throw new Error("Shopify client not initialized");
    }

    let currentCartId = cartId;

    // Create cart if it doesn't exist
    if (!currentCartId) {
      await createCart();
      currentCartId = cartId;
    }

    if (!currentCartId) {
      throw new Error("Failed to create cart");
    }

    setIsCartLoading(true);
    try {
      const updatedCart = await client.addToCart(currentCartId, variantId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    } finally {
      setIsCartLoading(false);
    }
  };

  const refreshCart = async () => {
    if (!client || !cartId) return;

    setIsCartLoading(true);
    try {
      const cartData = await client.getCart(cartId);
      setCart(cartData);
    } catch (error) {
      console.error("Failed to refresh cart:", error);
      // If cart is not found, clear the stored cart ID
      localStorage.removeItem("shopify-cart-id");
      setCartId(null);
      setCart(null);
    } finally {
      setIsCartLoading(false);
    }
  };

  const value: ShopifyContextValue = {
    client,
    cart,
    cartId,
    isCartLoading,
    addToCart,
    createCart,
    refreshCart,
  };

  return (
    <ShopifyContext.Provider value={value}>
      {children}
    </ShopifyContext.Provider>
  );
}

export function useShopify() {
  const context = useContext(ShopifyContext);
  if (!context) {
    throw new Error("useShopify must be used within a ShopifyProvider");
  }
  return context;
}

/**
 * Hook to get cart item count
 */
export function useCartCount() {
  const { cart } = useShopify();
  return cart?.totalQuantity || 0;
}

/**
 * Hook to get formatted cart total
 */
export function useCartTotal() {
  const { cart } = useShopify();
  if (!cart) return null;
  
  const { amount, currencyCode } = cart.cost.totalAmount;
  return {
    amount: parseFloat(amount),
    currencyCode,
    formatted: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount)),
  };
}