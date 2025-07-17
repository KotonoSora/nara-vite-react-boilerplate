# Shopify Theme Integration Guide

This guide explains how to use the NARA React boilerplate to create modern Shopify themes that combine the power of React with Shopify's eCommerce platform.

## 🎯 Overview

The NARA Shopify integration allows you to:
- Build Shopify themes using modern React components
- Use TypeScript for type-safe theme development
- Leverage Shopify's Storefront API for dynamic product data
- Deploy React-powered storefronts while maintaining Shopify compatibility
- Use modern tooling (Vite, TailwindCSS, shadcn/ui) in Shopify themes

## 🚀 Quick Start

### 1. Environment Setup

First, configure your environment variables for Shopify integration:

```bash
# Create .env file in your project root
SHOPIFY_DOMAIN=your-shop.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
```

### 2. Get Shopify Credentials

To obtain your Shopify credentials:

1. **Shopify Domain**: Your shop's myshopify.com URL
2. **Storefront Access Token**:
   - Go to your Shopify Admin → Apps → Private apps
   - Create a new private app or use an existing one
   - Enable Storefront API access
   - Copy the Storefront access token

### 3. Build Your Shopify Theme

```bash
# Build the React app and generate Shopify theme files
npm run build:shopify

# This creates a shopify-theme/ directory with:
# - Liquid templates
# - Theme configuration
# - Built React assets
```

### 4. Deploy to Shopify

1. **Using Shopify CLI** (recommended):
   ```bash
   # Install Shopify CLI
   npm install -g @shopify/cli @shopify/theme
   
   # Navigate to theme directory
   cd shopify-theme
   
   # Deploy to your store
   shopify theme push
   ```

2. **Manual upload**:
   - Zip the `shopify-theme` folder
   - Upload via Shopify Admin → Online Store → Themes

## 🛠️ Development Workflow

### Local Development

```bash
# Start development server
npm run dev

# Your React app runs at http://localhost:5173
# Make changes to components and see them instantly
```

### Building for Shopify

```bash
# Build optimized React app + Shopify theme
npm run build:shopify

# This generates:
# shopify-theme/
# ├── assets/          # Built React JS/CSS + static assets
# ├── config/          # Theme settings
# ├── layout/          # Main theme.liquid layout
# ├── templates/       # Liquid templates for pages
# └── sections/        # Shopify sections (future enhancement)
```

## 🏗️ Architecture

### React + Shopify Integration

The integration works by:

1. **React App**: Your components and logic run in the browser
2. **Shopify API**: Data comes from Shopify's Storefront GraphQL API
3. **Liquid Templates**: Provide fallback content and SEO structure
4. **Build Process**: Combines React build output with Shopify theme structure

### File Structure

```
app/
├── contexts/
│   └── shopify-context.tsx     # Shopify API client & cart state
├── features/ecommerce/
│   └── components/
│       ├── product-card.tsx    # Product display components
│       ├── cart.tsx           # Shopping cart functionality
│       └── collection-card.tsx # Collection display
├── lib/
│   └── shopify.ts             # Shopify API client & types
└── routes/
    └── shop/                  # Shop-related routes
        ├── _index.tsx         # Main shop page
        └── products.$handle.tsx # Product detail pages

shopify-theme/                 # Generated Shopify theme
├── config/
│   ├── settings_schema.json   # Theme customization options
│   └── settings_data.json     # Default theme settings
├── layout/
│   └── theme.liquid          # Main layout template
└── templates/
    ├── index.liquid          # Homepage
    ├── product.liquid        # Product pages
    └── collection.liquid     # Collection pages
```

## 🎨 Customization

### Theme Settings

Configure your theme through `shopify-theme/config/settings_schema.json`:

```json
{
  "logo_width": {
    "type": "range",
    "min": 50,
    "max": 300,
    "step": 10,
    "unit": "px",
    "label": "Logo width",
    "default": 120
  },
  "colors_accent_1": {
    "type": "color",
    "label": "Accent color 1",
    "default": "#000000"
  }
}
```

### React Components

Add new eCommerce components in `app/features/ecommerce/components/`:

```tsx
// app/features/ecommerce/components/wishlist.tsx
import { useShopify } from "~/contexts/shopify-context";

export function WishlistButton({ productId }: { productId: string }) {
  // Your wishlist logic here
  return <button>Add to Wishlist</button>;
}
```

### Adding Routes

Create new shop routes in `app/routes/shop/`:

```tsx
// app/routes/shop.collections.$handle.tsx
export default function CollectionPage() {
  // Collection-specific functionality
}
```

## 📊 API Integration

### Using the Shopify Client

```tsx
import { useShopify } from "~/contexts/shopify-context";

function ProductPage() {
  const { client } = useShopify();
  
  useEffect(() => {
    async function loadProduct() {
      if (client) {
        const product = await client.getProduct("product-handle");
        setProduct(product);
      }
    }
    loadProduct();
  }, [client]);
}
```

### Available API Methods

```tsx
// Get products
const { products, pageInfo } = await client.getProducts(20);

// Get single product
const product = await client.getProduct("product-handle");

// Get collections
const collections = await client.getCollections(10);

// Cart operations
const { cartId } = await client.createCart();
const cart = await client.addToCart(cartId, variantId, quantity);
const cartData = await client.getCart(cartId);
```

## 🎯 Best Practices

### Performance

1. **Code Splitting**: Use React Router's route-based code splitting
2. **Image Optimization**: Use Shopify's image transformation API
3. **Lazy Loading**: Load product data as needed
4. **Caching**: Implement client-side caching for API responses

### SEO

1. **Server-Side Rendering**: Liquid templates provide fallback content
2. **Meta Tags**: Use React Router's meta function for dynamic meta tags
3. **Structured Data**: Add JSON-LD structured data in templates

### Accessibility

1. **Semantic HTML**: Use proper heading hierarchy and ARIA labels
2. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
3. **Screen Readers**: Provide descriptive alt text and labels

## 🔧 Advanced Configuration

### Custom Build Process

Modify `scripts/build-shopify-theme.sh` to customize the build:

```bash
# Add custom asset processing
npm run build:css
npm run optimize:images

# Copy additional files
cp -r custom-assets/* shopify-theme/assets/
```

### Environment-Specific Builds

```bash
# Development build
SHOPIFY_ENV=development npm run build:shopify

# Production build  
SHOPIFY_ENV=production npm run build:shopify
```

### Multi-Store Support

```tsx
// Configure different stores based on environment
const shopifyConfig = {
  development: {
    domain: "dev-store.myshopify.com",
    storefrontAccessToken: "dev-token"
  },
  production: {
    domain: "live-store.myshopify.com", 
    storefrontAccessToken: "prod-token"
  }
}[process.env.NODE_ENV];
```

## 🚀 Deployment

### Production Deployment

1. **Build the theme**:
   ```bash
   npm run build:shopify
   ```

2. **Deploy React app** (choose one):
   - Vercel: `vercel deploy`
   - Netlify: `netlify deploy`
   - Cloudflare Pages: `wrangler pages deploy`

3. **Upload Shopify theme**:
   ```bash
   cd shopify-theme
   shopify theme push --live
   ```

### CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Deploy Shopify Theme
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 22
          
      - name: Install dependencies
        run: npm install
        
      - name: Build Shopify theme
        run: npm run build:shopify
        env:
          SHOPIFY_DOMAIN: ${{ secrets.SHOPIFY_DOMAIN }}
          SHOPIFY_STOREFRONT_ACCESS_TOKEN: ${{ secrets.SHOPIFY_STOREFRONT_ACCESS_TOKEN }}
          
      - name: Deploy to Shopify
        run: |
          cd shopify-theme
          shopify theme push --live
        env:
          SHOPIFY_CLI_THEME_TOKEN: ${{ secrets.SHOPIFY_CLI_THEME_TOKEN }}
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your domain is added to Shopify's allowed origins
2. **API Rate Limits**: Implement request throttling and caching
3. **Build Failures**: Check that all environment variables are set
4. **Theme Upload Errors**: Verify theme structure matches Shopify requirements

### Debug Mode

Enable debug logging:

```tsx
// In your Shopify context
const [debug, setDebug] = useState(process.env.NODE_ENV === 'development');

if (debug) {
  console.log('Shopify API Request:', query, variables);
}
```

## 📚 Resources

- [Shopify Storefront API Documentation](https://shopify.dev/api/storefront)
- [Shopify Theme Development](https://shopify.dev/themes)
- [React Router v7 Documentation](https://reactrouter.com)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [NARA Project Repository](https://github.com/KotonoSora/nara-vite-react-boilerplate)

---

## 🤝 Contributing

Found a bug or want to contribute? Please:

1. Check existing issues
2. Create a new issue with detailed description
3. Submit a pull request with your improvements

## 📄 License

This Shopify integration is part of the NARA boilerplate and follows the same AGPL-3.0 license terms.