import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  title: string;
  category: string;
  sp: number;
  type: string;
  image_url?: string;
  quality: number;
}

export const ProductCard = ({ id, title, category, sp, type, image_url, quality }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
      <Link to={`/product/${id}`}>
        <div className="aspect-square overflow-hidden bg-muted">
          {image_url ? (
            <img
              src={image_url}
              alt={title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              No Image
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
            <Badge variant={type === "Sale" ? "default" : "secondary"} className="shrink-0">
              {type}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{category}</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">₹{sp}</span>
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
