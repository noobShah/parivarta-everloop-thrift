import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Smartphone, Armchair, Shirt, Home, Palette, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  { name: "Gadgets", icon: Smartphone, to: "/marketplace?category=Gadgets" },
  { name: "Furniture", icon: Armchair, to: "/marketplace?category=Furniture" },
  { name: "Clothing & Accessories", icon: Shirt, to: "/marketplace?category=Clothing & Accessories" },
  { name: "Home & Kitchen", icon: Home, to: "/marketplace?category=Home & Kitchen" },
  { name: "Antique & Décor", icon: Palette, to: "/marketplace?category=Antique & Décor" },
];

export default function Index() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);
      
      if (data) setFeaturedProducts(data);
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-20" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Giving things a <span className="bg-gradient-hero bg-clip-text text-transparent">new life</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Buy, sell, and rent pre-loved items. Join the sustainable shopping revolution.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" asChild>
                <Link to="/marketplace">
                  Explore Marketplace
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/dashboard">List Your Item</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Shop by Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-bold">Featured Listings</h2>
              <Button variant="ghost" asChild>
                <Link to="/marketplace">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-lg mb-2">Parivartā - Sustainable Re-commerce Platform</p>
          <p className="text-sm">© 2025 Parivartā. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
