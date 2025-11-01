import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  title: string;
  category: string;
  sale_price?: number;
  available_for_sale?: boolean;
  available_for_rent?: boolean;
  rent_price_per_month?: number;
  image_urls?: string[];
  quality: number;
}

export const ProductCard = ({ 
  id, 
  title, 
  category, 
  sale_price, 
  available_for_sale,
  available_for_rent,
  rent_price_per_month,
  image_urls, 
  quality 
}: ProductCardProps) => {
  const displayImage = image_urls && image_urls.length > 0 ? image_urls[0] : null;
  
  return (
    <Card className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
      <Link to={`/product/${id}`}>
        <div className="aspect-square overflow-hidden bg-muted relative">
          {displayImage ? (
            <img
              src={displayImage}
              alt={title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          {image_urls && image_urls.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur px-2 py-1 rounded-full text-xs">
              +{image_urls.length - 1} more
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/product/${id}`}>
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="flex gap-1 shrink-0">
              {available_for_sale && (
                <Badge variant="default" className="text-xs">Sale</Badge>
              )}
              {available_for_rent && (
                <Badge variant="secondary" className="text-xs">Rent</Badge>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{category}</p>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              {available_for_sale && sale_price && (
                <span className="text-lg font-bold text-primary">₹{sale_price}</span>
              )}
              {available_for_rent && rent_price_per_month && (
                <span className="text-sm text-muted-foreground">₹{rent_price_per_month}/mo</span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">Quality: {quality}/10</span>
          </div>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Button size="sm" className="flex-1" asChild>
          <Link to={`/product/${id}`}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            View
          </Link>
        </Button>
        <Button size="sm" variant="secondary" asChild>
          <Link to={`/product/${id}`}>
            <MessageSquare className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};