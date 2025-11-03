import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  to: string;
}

export const CategoryCard = ({ name, icon: Icon, to }: CategoryCardProps) => {
  return (
    <Link to={to}>
      <Card className="group cursor-pointer overflow-hidden border-4 border-border hover:border-primary retro-card bg-card">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
          <div className="rounded-full bg-gradient-hero p-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Icon className="h-8 w-8 text-primary-foreground" />
          </div>
          <h3 className="font-groovy text-lg text-center group-hover:text-primary transition-colors">
            {name}
          </h3>
        </CardContent>
      </Card>
    </Link>
  );
};
