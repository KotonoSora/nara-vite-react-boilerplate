import { Link } from "react-router";
import { ShoppingBag, Store } from "lucide-react";

import { Button } from "~/components/ui/button";
import { CartButton } from "~/features/ecommerce/components/cart";
import { ModeSwitcher } from "~/components/mode-switcher";

export function Navigation() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Store className="h-6 w-6" />
            <span className="font-bold text-xl">NARA</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Shop
            </Link>
            <Link 
              to="/showcase" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Showcase
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <CartButton />
            <ModeSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}