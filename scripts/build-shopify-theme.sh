#!/bin/bash

# NARA Shopify Theme Build Script
# Builds the React app and generates Shopify theme structure

set -e

echo "🚀 Building NARA Shopify Theme..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m' 
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create theme directories
echo "📁 Creating Shopify theme structure..."
mkdir -p shopify-theme/{assets,config,layout,locales,sections,snippets,templates}

# Build the React app
echo "⚛️  Building React application..."
npm run build

# Copy built assets to Shopify theme
echo "📦 Copying assets to Shopify theme..."
cp -r public/* shopify-theme/assets/
cp -r build/client/* shopify-theme/assets/ 2>/dev/null || true

# Generate theme.liquid layout
echo "🎨 Generating theme.liquid..."
cat > shopify-theme/layout/theme.liquid << 'EOF'
<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="theme-color" content="">
    <link rel="canonical" href="{{ canonical_url }}">
    <link rel="preconnect" href="https://cdn.shopify.com" crossorigin>

    {%- if settings.favicon != blank -%}
      <link rel="icon" type="image/png" href="{{ settings.favicon | image_url: width: 32, height: 32 }}">
    {%- endif -%}

    {%- unless settings.type_header_font.system? and settings.type_body_font.system? -%}
      <link rel="preconnect" href="https://fonts.shopifycdn.com" crossorigin>
    {%- endunless -%}

    <title>
      {{ page_title }}
      {%- if current_tags %} &ndash; tagged "{{ current_tags | join: ', ' }}"{% endif -%}
      {%- if current_page != 1 %} &ndash; Page {{ current_page }}{% endif -%}
      {%- unless page_title contains shop.name %} &ndash; {{ shop.name }}{% endunless -%}
    </title>

    {% if page_description %}
      <meta name="description" content="{{ page_description | escape }}">
    {% endif %}

    {% render 'meta-tags' %}

    <script src="{{ 'global.js' | asset_url }}" defer="defer"></script>

    {%- if request.page_type contains 'customers/' -%}
      <script src="{{ 'shopify_common.js' | shopify_asset_url }}" defer="defer"></script>
    {%- endif -%}

    {{ content_for_header }}

    {%- liquid
      assign body_font_bold = settings.type_body_font | font_modify: 'weight', 'bold'
      assign body_font_italic = settings.type_body_font | font_modify: 'style', 'italic'
      assign body_font_bold_italic = body_font_bold | font_modify: 'style', 'italic'
    %}

    {% style %}
      {{ settings.type_body_font | font_face: font_display: 'swap' }}
      {{ body_font_bold | font_face: font_display: 'swap' }}
      {{ body_font_italic | font_face: font_display: 'swap' }}
      {{ body_font_bold_italic | font_face: font_display: 'swap' }}
      {{ settings.type_header_font | font_face: font_display: 'swap' }}

      :root {
        --font-body-family: {{ settings.type_body_font.family }}, {{ settings.type_body_font.fallback_families }};
        --font-body-style: {{ settings.type_body_font.style }};
        --font-body-weight: {{ settings.type_body_font.weight }};
        --font-body-weight-bold: {{ settings.type_body_font.weight | plus: 300 | at_most: 1000 }};

        --font-heading-family: {{ settings.type_header_font.family }}, {{ settings.type_header_font.fallback_families }};
        --font-heading-style: {{ settings.type_header_font.style }};
        --font-heading-weight: {{ settings.type_header_font.weight }};

        --color-accent-1: {{ settings.colors_accent_1.red }}, {{ settings.colors_accent_1.green }}, {{ settings.colors_accent_1.blue }};
        --color-accent-2: {{ settings.colors_accent_2.red }}, {{ settings.colors_accent_2.green }}, {{ settings.colors_accent_2.blue }};
      }

      *,
      *::before,
      *::after {
        box-sizing: inherit;
      }

      html {
        box-sizing: border-box;
        font-size: calc(var(--font-body-scale) * 62.5%);
        height: 100%;
      }

      body {
        display: grid;
        grid-template-rows: auto auto 1fr auto;
        grid-template-columns: 100%;
        min-height: 100%;
        margin: 0;
        font-size: 1.5rem;
        letter-spacing: 0.06rem;
        line-height: calc(1 + 0.8 / var(--font-body-scale));
        font-family: var(--font-body-family);
        font-style: var(--font-body-style);
        font-weight: var(--font-body-weight);
      }

      @media screen and (min-width: 750px) {
        body {
          font-size: 1.6rem;
        }
      }
    {% endstyle %}

    {{ 'base.css' | asset_url | stylesheet_tag }}
    
    {%- if request.page_type == 'index' -%}
      {{ 'app.css' | asset_url | stylesheet_tag }}
    {%- endif -%}

    <script>document.documentElement.className = document.documentElement.className.replace('no-js', 'js');
    if (Shopify.designMode) {
      document.documentElement.classList.add('shopify-design-mode');
    }
    </script>
  </head>

  <body class="gradient">
    <a class="skip-to-content-link button visually-hidden" href="#MainContent">
      {{ 'accessibility.skip_to_text' | t }}
    </a>

    {%- liquid
      assign logo_width = settings.logo_width
    -%}

    {% section 'header' %}

    <main id="MainContent" class="content-for-layout focus-none" role="main" tabindex="-1">
      {{ content }}
    </main>

    {% section 'footer' %}

    <ul hidden>
      <li id="a11y-refresh-page-message">{{ 'accessibility.refresh_page' | t }}</li>
      <li id="a11y-new-window-message">{{ 'accessibility.link_messages.new_window' | t }}</li>
    </ul>

    <script>
      window.shopUrl = '{{ request.origin }}';
      window.routes = {
        cart_add_url: '{{ routes.cart_add_url }}',
        cart_change_url: '{{ routes.cart_change_url }}',
        cart_update_url: '{{ routes.cart_update_url }}',
        cart_url: '{{ routes.cart_url }}',
        predictive_search_url: '{{ routes.predictive_search_url }}'
      };

      window.cartStrings = {
        error: `{{ 'sections.cart.cart_error' | t }}`,
        quantityError: `{{ 'sections.cart.cart_quantity_error_html' | t: quantity: '[quantity]' }}`
      }

      window.variantStrings = {
        addToCart: `{{ 'products.product.add_to_cart' | t }}`,
        soldOut: `{{ 'products.product.sold_out' | t }}`,
        unavailable: `{{ 'products.product.unavailable' | t }}`,
        unavailable_with_option: `{{ 'products.product.value_unavailable' | t: option_value: '[value]' }}`,
      }

      window.accessibilityStrings = {
        imageAvailable: `{{ 'products.product.media.image_available' | t: index: '[index]' }}`,
        shareSuccess: `{{ 'general.share.success_message' | t }}`,
        pauseSlideshow: `{{ 'sections.slideshow.pause_slideshow' | t }}`,
        playSlideshow: `{{ 'sections.slideshow.play_slideshow' | t }}`,
      }
    </script>

    {%- if request.page_type == 'index' -%}
      <script type="module" src="{{ 'app.js' | asset_url }}"></script>
    {%- endif -%}

    {%- if settings.cart_type == "drawer" -%}
      {% render 'cart-drawer' %}
    {%- endif -%}
  </body>
</html>
EOF

# Generate basic index template
echo "🏠 Generating index template..."
cat > shopify-theme/templates/index.liquid << 'EOF'
{%- liquid
  assign is_react_page = true
-%}

<div id="react-root" 
     data-shop-domain="{{ shop.domain }}" 
     data-storefront-access-token="{{ settings.storefront_access_token }}"
     data-page-type="index">
  {%- comment -%}
    React application will mount here
    Fallback content for SEO and accessibility
  {%- endcomment -%}
  
  <div class="fallback-content">
    <h1>{{ shop.name }}</h1>
    <p>{{ shop.description }}</p>
    
    {%- if collections.frontpage.products.size > 0 -%}
      <div class="product-grid">
        {%- for product in collections.frontpage.products limit: 8 -%}
          <div class="product-card">
            <a href="{{ product.url }}">
              {%- if product.featured_media -%}
                {{ product.featured_media | image_url: width: 300 | image_tag: loading: 'lazy' }}
              {%- endif -%}
              <h3>{{ product.title }}</h3>
              <p>{{ product.price | money }}</p>
            </a>
          </div>
        {%- endfor -%}
      </div>
    {%- endif -%}
  </div>
</div>

<style>
  .fallback-content {
    display: none;
  }
  
  .no-js .fallback-content {
    display: block;
  }
  
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .product-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
  }
  
  .product-card img {
    width: 100%;
    height: auto;
  }
</style>
EOF

# Generate product template
echo "🛍️  Generating product template..."
cat > shopify-theme/templates/product.liquid << 'EOF'
<div id="react-root" 
     data-shop-domain="{{ shop.domain }}" 
     data-storefront-access-token="{{ settings.storefront_access_token }}"
     data-page-type="product"
     data-product-handle="{{ product.handle }}">
  
  <div class="fallback-content">
    <h1>{{ product.title }}</h1>
    
    {%- if product.featured_media -%}
      {{ product.featured_media | image_url: width: 600 | image_tag: loading: 'lazy' }}
    {%- endif -%}
    
    <div class="product-info">
      <p class="price">{{ product.price | money }}</p>
      {%- if product.compare_at_price > product.price -%}
        <p class="compare-price">{{ product.compare_at_price | money }}</p>
      {%- endif -%}
      
      <div class="product-description">
        {{ product.description }}
      </div>
      
      <form action="/cart/add" method="post" enctype="multipart/form-data">
        <select name="id" class="product-form__variants">
          {%- for variant in product.variants -%}
            <option value="{{ variant.id }}" {% if variant == product.selected_or_first_available_variant %}selected="selected"{% endif %}>
              {{ variant.title }} - {{ variant.price | money }}
            </option>
          {%- endfor -%}
        </select>
        
        <div class="product-form__quantity">
          <label for="Quantity">Quantity</label>
          <input type="number" id="Quantity" name="quantity" value="1" min="1">
        </div>
        
        <button type="submit" class="btn product-form__cart-submit">
          Add to cart
        </button>
      </form>
    </div>
  </div>
</div>
EOF

# Generate collection template
echo "📚 Generating collection template..."
cat > shopify-theme/templates/collection.liquid << 'EOF'
<div id="react-root" 
     data-shop-domain="{{ shop.domain }}" 
     data-storefront-access-token="{{ settings.storefront_access_token }}"
     data-page-type="collection"
     data-collection-handle="{{ collection.handle }}">
  
  <div class="fallback-content">
    <h1>{{ collection.title }}</h1>
    
    {%- if collection.description != blank -%}
      <div class="collection-description">
        {{ collection.description }}
      </div>
    {%- endif -%}
    
    <div class="product-grid">
      {%- for product in collection.products -%}
        <div class="product-card">
          <a href="{{ product.url }}">
            {%- if product.featured_media -%}
              {{ product.featured_media | image_url: width: 300 | image_tag: loading: 'lazy' }}
            {%- endif -%}
            <h3>{{ product.title }}</h3>
            <p>{{ product.price | money }}</p>
          </a>
        </div>
      {%- endfor -%}
    </div>
  </div>
</div>
EOF

echo -e "${GREEN}✅ Shopify theme build complete!${NC}"
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Configure your Shopify storefront access token"
echo "2. Upload the shopify-theme folder to your Shopify store"
echo "3. Set up your React app deployment"
echo -e "${GREEN}🎉 Your NARA Shopify theme is ready!${NC}"