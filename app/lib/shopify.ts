/**
 * Shopify Storefront API client and utilities
 * Provides type-safe access to Shopify's GraphQL Storefront API
 */

export interface ShopifyConfig {
  domain: string;
  storefrontAccessToken: string;
  apiVersion?: string;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  images: {
    nodes: Array<{
      id: string;
      url: string;
      altText?: string;
      width: number;
      height: number;
    }>;
  };
  variants: {
    nodes: Array<{
      id: string;
      title: string;
      price: {
        amount: string;
        currencyCode: string;
      };
      compareAtPrice?: {
        amount: string;
        currencyCode: string;
      };
      selectedOptions: Array<{
        name: string;
        value: string;
      }>;
      availableForSale: boolean;
      quantityAvailable: number;
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  availableForSale: boolean;
  tags: string[];
  productType: string;
  vendor: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  image?: {
    id: string;
    url: string;
    altText?: string;
    width: number;
    height: number;
  };
  products: {
    nodes: ShopifyProduct[];
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalTaxAmount?: {
      amount: string;
      currencyCode: string;
    };
  };
  lines: {
    nodes: Array<{
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
    }>;
  };
  totalQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export class ShopifyStorefrontClient {
  private domain: string;
  private storefrontAccessToken: string;
  private apiVersion: string;
  private endpoint: string;

  constructor(config: ShopifyConfig) {
    this.domain = config.domain;
    this.storefrontAccessToken = config.storefrontAccessToken;
    this.apiVersion = config.apiVersion || '2024-01';
    this.endpoint = `https://${this.domain}/api/${this.apiVersion}/graphql.json`;
  }

  private async request<T>(query: string, variables?: Record<string, any>): Promise<T> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': this.storefrontAccessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API request failed: ${response.statusText}`);
    }

    const data = await response.json() as { data: T; errors?: any[] };

    if (data.errors) {
      throw new Error(`Shopify GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    return data.data;
  }

  async getProducts(first = 20, after?: string): Promise<{
    products: ShopifyProduct[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string;
      endCursor?: string;
    };
  }> {
    const query = `
      query getProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          nodes {
            id
            title
            handle
            description
            descriptionHtml
            images(first: 10) {
              nodes {
                id
                url
                altText
                width
                height
              }
            }
            variants(first: 10) {
              nodes {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
                availableForSale
                quantityAvailable
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            availableForSale
            tags
            productType
            vendor
            createdAt
            updatedAt
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    `;

    const data = await this.request<{
      products: {
        nodes: ShopifyProduct[];
        pageInfo: {
          hasNextPage: boolean;
          hasPreviousPage: boolean;
          startCursor?: string;
          endCursor?: string;
        };
      };
    }>(query, { first, after });

    return {
      products: data.products.nodes,
      pageInfo: data.products.pageInfo,
    };
  }

  async getProduct(handle: string): Promise<ShopifyProduct | null> {
    const query = `
      query getProduct($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          handle
          description
          descriptionHtml
          images(first: 10) {
            nodes {
              id
              url
              altText
              width
              height
            }
          }
          variants(first: 10) {
            nodes {
              id
              title
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
              availableForSale
              quantityAvailable
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          availableForSale
          tags
          productType
          vendor
          createdAt
          updatedAt
        }
      }
    `;

    const data = await this.request<{
      productByHandle: ShopifyProduct | null;
    }>(query, { handle });

    return data.productByHandle;
  }

  async getCollections(first = 20): Promise<ShopifyCollection[]> {
    const query = `
      query getCollections($first: Int!) {
        collections(first: $first) {
          nodes {
            id
            title
            handle
            description
            descriptionHtml
            image {
              id
              url
              altText
              width
              height
            }
            products(first: 20) {
              nodes {
                id
                title
                handle
                images(first: 1) {
                  nodes {
                    id
                    url
                    altText
                    width
                    height
                  }
                }
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                availableForSale
              }
            }
          }
        }
      }
    `;

    const data = await this.request<{
      collections: { nodes: ShopifyCollection[] };
    }>(query, { first });

    return data.collections.nodes;
  }

  async createCart(): Promise<{ cartId: string }> {
    const query = `
      mutation cartCreate {
        cartCreate {
          cart {
            id
            checkoutUrl
            totalQuantity
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await this.request<{
      cartCreate: {
        cart: { id: string; checkoutUrl: string; totalQuantity: number };
        userErrors: Array<{ field: string; message: string }>;
      };
    }>(query);

    if (data.cartCreate.userErrors.length > 0) {
      throw new Error(`Cart creation failed: ${data.cartCreate.userErrors[0].message}`);
    }

    return { cartId: data.cartCreate.cart.id };
  }

  async addToCart(cartId: string, variantId: string, quantity: number): Promise<ShopifyCart> {
    const query = `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            cost {
              totalAmount {
                amount
                currencyCode
              }
              subtotalAmount {
                amount
                currencyCode
              }
              totalTaxAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              nodes {
                id
                quantity
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    selectedOptions {
                      name
                      value
                    }
                    product {
                      id
                      title
                      handle
                      featuredImage {
                        id
                        url
                        altText
                        width
                        height
                      }
                    }
                  }
                }
              }
            }
            totalQuantity
            createdAt
            updatedAt
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await this.request<{
      cartLinesAdd: {
        cart: ShopifyCart;
        userErrors: Array<{ field: string; message: string }>;
      };
    }>(query, {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    });

    if (data.cartLinesAdd.userErrors.length > 0) {
      throw new Error(`Add to cart failed: ${data.cartLinesAdd.userErrors[0].message}`);
    }

    return data.cartLinesAdd.cart;
  }

  async getCart(cartId: string): Promise<ShopifyCart | null> {
    const query = `
      query getCart($cartId: ID!) {
        cart(id: $cartId) {
          id
          checkoutUrl
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            nodes {
              id
              quantity
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  selectedOptions {
                    name
                    value
                  }
                  product {
                    id
                    title
                    handle
                    featuredImage {
                      id
                      url
                      altText
                      width
                      height
                    }
                  }
                }
              }
            }
          }
          totalQuantity
          createdAt
          updatedAt
        }
      }
    `;

    const data = await this.request<{
      cart: ShopifyCart | null;
    }>(query, { cartId });

    return data.cart;
  }
}

/**
 * Utility function to format Shopify price
 */
export function formatPrice(amount: string, currencyCode: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  });
  return formatter.format(parseFloat(amount));
}

/**
 * Utility function to get the first available variant
 */
export function getFirstAvailableVariant(product: ShopifyProduct) {
  return product.variants.nodes.find((variant) => variant.availableForSale);
}

/**
 * Utility function to check if product has multiple variants
 */
export function hasMultipleVariants(product: ShopifyProduct): boolean {
  return product.variants.nodes.length > 1;
}