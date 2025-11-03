import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { 
  ShoppingBag, 
  Shirt, 
  Smartphone, 
  Sofa, 
  Home, 
  Gem,
  ArrowRight,
  RefreshCw,
  Users,
  Shield,
  Leaf,
  Star,
  CheckCircle2
} from "lucide-react";

const categories = [
  { name: "Clothing & Accessories", icon: Shirt, to: "/marketplace?category=Clothing & Accessories" },
  { name: "Gadgets", icon: Smartphone, to: "/marketplace?category=Gadgets" },
  { name: "Furniture", icon: Sofa, to: "/marketplace?category=Furniture" },
  { name: "Home & Kitchen", icon: Home, to: "/marketplace?category=Home & Kitchen" },
  { name: "Antique & Décor", icon: Gem, to: "/marketplace?category=Antique & Décor" },
];

const trustBadges = [
  { icon: Shield, text: "Verified Sellers" },
  { icon: CheckCircle2, text: "Secure Payments" },
  { icon: Leaf, text: "5-10% Commission" },
  { icon: Star, text: "Eco-Certified" },
];

const howItWorks = [
  { step: "List", icon: ShoppingBag, description: "Upload your pre-loved items" },
  { step: "Verify", icon: Shield, description: "We ensure quality & authenticity" },
  { step: "Sell", icon: Users, description: "Connect with conscious buyers" },
  { step: "Reuse", icon: RefreshCw, description: "Give things a new life" },
];

export default function Index() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [email, setEmail] = useState("");

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
      
      {/* Hero Section - Retro Sunburst */}
      <section className="relative overflow-hidden bg-gradient-sunburst py-20 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-primary rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border-4 border-secondary rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border-4 border-accent rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mb-6 inline-block">
            <RefreshCw className="h-16 w-16 text-primary animate-rotate-slow" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-groovy text-foreground mb-6 leading-tight">
            Giving Things<br />A New Life
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            Join India's most trusted eco-conscious resale community
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-lg px-8 py-6 retro-shadow">
              <Link to="/dashboard">
                Start Selling <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link to="/marketplace">Browse Items</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Wavy Divider */}
      <div className="wavy-divider"></div>

      {/* Trust Badges Section */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, index) => (
              <div 
                key={index}
                className="flex flex-col items-center justify-center p-6 bg-background rounded-full aspect-square retro-card"
              >
                <badge.icon className="h-8 w-8 text-primary mb-2" />
                <p className="text-sm font-semibold text-center">{badge.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-groovy text-center mb-12 text-foreground">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.name} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - The Loop */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-groovy text-center mb-4 text-foreground">
            The Everloop
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            How the circular economy works
          </p>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {howItWorks.map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-hero flex items-center justify-center retro-shadow">
                      <item.icon className="h-10 w-10 text-primary-foreground" />
                    </div>
                    {index < howItWorks.length - 1 && (
                      <ArrowRight className="hidden md:block absolute top-1/2 -right-8 -translate-y-1/2 h-6 w-6 text-primary" />
                    )}
                  </div>
                  <h3 className="text-2xl font-groovy text-foreground mb-2">{item.step}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 hidden md:block">
              <RefreshCw className="h-32 w-32 text-primary/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Counter Section */}
      <section className="py-16 bg-gradient-accent">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="retro-card bg-card p-8">
              <div className="text-5xl font-groovy text-primary mb-2">10K+</div>
              <p className="text-lg text-muted-foreground">Products Given New Life</p>
            </div>
            <div className="retro-card bg-card p-8">
              <div className="text-5xl font-groovy text-secondary mb-2">500kg</div>
              <p className="text-lg text-muted-foreground">CO₂ Saved</p>
            </div>
            <div className="retro-card bg-card p-8">
              <div className="text-5xl font-groovy text-accent mb-2">5K+</div>
              <p className="text-lg text-muted-foreground">Happy Sellers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-groovy text-center mb-12 text-foreground">
              Featured Listings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-warm">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Leaf className="h-12 w-12 text-primary-foreground mx-auto mb-4 animate-bounce-gentle" />
            <h2 className="text-4xl font-groovy text-primary-foreground mb-4">
              Subscribe to our eco-vibes
            </h2>
            <p className="text-primary-foreground/90 mb-6 text-lg">
              Get sustainability tips, exclusive deals, and community updates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background text-foreground border-2 border-primary-foreground/20"
              />
              <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">
                Loop Me In!
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-olive text-cream py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-groovy text-xl mb-4">Parivartā</h3>
              <p className="text-sm text-cream/80">
                By Everloop Pvt. Ltd.<br />
                Giving things a new life
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link to="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/marketplace?category=Clothing & Accessories" className="hover:text-primary transition-colors">Clothing</Link></li>
                <li><Link to="/marketplace?category=Gadgets" className="hover:text-primary transition-colors">Gadgets</Link></li>
                <li><Link to="/marketplace?category=Furniture" className="hover:text-primary transition-colors">Furniture</Link></li>
                <li><Link to="/marketplace?category=Home & Kitchen" className="hover:text-primary transition-colors">Home & Kitchen</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Social Media</h4>
              <p className="text-sm text-cream/80 mb-4">Follow us for updates</p>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-cream/20 flex items-center justify-center hover:bg-cream/30 transition-colors cursor-pointer">
                  <span className="text-xs">IG</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-cream/20 flex items-center justify-center hover:bg-cream/30 transition-colors cursor-pointer">
                  <span className="text-xs">LI</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-cream/20 pt-6 text-center">
            <p className="text-sm text-cream/80">
              © 2024 Parivartā by Everloop Pvt. Ltd. | Made with ♻️ in India
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
