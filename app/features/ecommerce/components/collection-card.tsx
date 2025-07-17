import { Link } from "react-router";

import type { ShopifyCollection } from "~/lib/shopify";
import { Card, CardContent } from "~/components/ui/card";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Badge } from "~/components/ui/badge";

interface CollectionCardProps {
  collection: ShopifyCollection;
  className?: string;
}

export function CollectionCard({ collection, className }: CollectionCardProps) {
  const productCount = collection.products.nodes.length;

  return (
    <Link to={`/collections/${collection.handle}`}>
      <Card className={`group hover:shadow-lg transition-shadow cursor-pointer ${className}`}>
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <AspectRatio ratio={16 / 9}>
              {collection.image ? (
                <img
                  src={collection.image.url}
                  alt={collection.image.altText || collection.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 font-medium">{collection.title}</span>
                </div>
              )}
            </AspectRatio>

            {/* Product count badge */}
            <Badge variant="secondary" className="absolute top-2 right-2">
              {productCount} product{productCount !== 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {collection.title}
            </h3>
            
            {collection.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {collection.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface CollectionGridProps {
  collections: ShopifyCollection[];
  className?: string;
}

export function CollectionGrid({ collections, className }: CollectionGridProps) {
  if (collections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No collections found.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {collections.map((collection) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
        />
      ))}
    </div>
  );
}