import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { categoryLink } from "@/lib/utils";
import { 
  Heart, 
  Target, 
  Leaf, 
  DollarSign, 
  Shield, 
  Users,
  TrendingUp,
  Megaphone,
  RefreshCw,
  Globe
} from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Reducing waste and promoting circular economy",
      color: "bg-sage"
    },
    {
      icon: DollarSign,
      title: "Affordability",
      description: "Making quality items accessible to everyone",
      color: "bg-mustard"
    },
    {
      icon: Shield,
      title: "Trust",
      description: "Verified sellers and secure transactions",
      color: "bg-terracotta"
    },
    {
      icon: Users,
      title: "Community",
      description: "Building connections through conscious commerce",
      color: "bg-olive"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-about">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-groovy text-foreground mb-6">
                The Everloop Story
              </h1>
              <p className="text-xl text-white mb-4">
                Where Sustainability Meets Style
              </p>
              <p className="text-lg text-white">
                Born from a vision to transform how India shops, Parivartā is more than a marketplace—it's a movement towards conscious consumption and environmental responsibility.
              </p>
            </div>
            <div className="relative">
              <div className="w-full aspect-square rounded-full bg-gradient-sun flex items-center justify-center">
                <Heart className="h-32 w-32 text-primary animate-bounce-gentle" />
                <RefreshCw className="absolute top-0 right-0 h-20 w-20 text-secondary animate-rotate-slow" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wavy Divider */}
      <div className="wavy-divider"></div>

      {/* Mission & Vision */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="retro-card bg-gradient-card p-8 border-4 border-sage">
              <div className="mb-4">
                <div className="inline-block bg-sage text-sage-foreground px-4 py-2 rounded-full font-groovy text-sm">
                  Our Mission
                </div>
              </div>
              <Target className="h-12 w-12 text-sage mb-4" />
              <h2 className="text-3xl font-groovy text-foreground mb-4">
                Democratize Sustainable Shopping
              </h2>
              <p className="text-muted-foreground">
                To create India's most trusted C2C resale platform, making sustainable shopping accessible and affordable for Gen Z and Millennials across Tier-1 and Tier-2 cities.
              </p>
            </div>
            
            <div className="retro-card bg-gradient-card p-8 border-4 border-terracotta">
              <div className="mb-4">
                <div className="inline-block bg-terracotta text-primary-foreground px-4 py-2 rounded-full font-groovy text-sm">
                  Our Vision
                </div>
              </div>
              <Globe className="h-12 w-12 text-terracotta mb-4" />
              <h2 className="text-3xl font-groovy text-foreground mb-4">
                A Circular Economy Future
              </h2>
              <p className="text-muted-foreground">
                To become the heartbeat of India's circular economy, where every product gets a second chance, every transaction reduces waste, and every user becomes an eco-champion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem & Solution */}
      <section className="py-16 bg-gradient-accent">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-groovy text-center mb-12 text-foreground">
            Why Parivartā?
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Problem */}
              <div className="retro-card bg-card p-6 text-center">
                <div className="text-6xl mb-4">🗑️</div>
                <h3 className="text-2xl font-groovy text-destructive mb-3">The Problem</h3>
                <p className="text-muted-foreground">
                  Millions of perfectly usable items end up in landfills. Wasteful consumption is harming our planet.
                </p>
              </div>

              {/* Bridge */}
              <div className="flex justify-center">
                <RefreshCw className="h-16 w-16 text-primary animate-rotate-slow" />
              </div>

              {/* Solution */}
              <div className="retro-card bg-card p-6 text-center">
                <div className="text-6xl mb-4">♻️</div>
                <h3 className="text-2xl font-groovy text-sage mb-3">The Solution</h3>
                <p className="text-muted-foreground">
                  A trusted platform where preloved items find new homes, reducing waste and saving money.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="retro-card bg-mustard/20 p-6 text-center">
                <TrendingUp className="h-10 w-10 text-terracotta mx-auto mb-3" />
                <p className="text-3xl font-groovy text-foreground">₹177B → ₹350B</p>
                <p className="text-muted-foreground">Projected resale market growth by 2025</p>
              </div>
              <div className="retro-card bg-gradient-green text-center">
                <Users className="h-10 w-10 text-olive mx-auto mb-3" />
                <p className="text-3xl font-groovy text-foreground">62% Gen Z</p>
                <p className="text-muted-foreground">Prefer buying preloved items</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-groovy text-center mb-12 text-foreground">
            Our Values
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div 
                key={index}
                className="retro-card bg-card p-6 text-center hover:scale-105 transition-transform"
              >
                <div className={`w-20 h-20 ${value.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <value.icon className="h-10 w-10 text-cream" />
                </div>
                <h3 className="text-xl font-groovy text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-sand">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Megaphone className="h-16 w-16  mx-auto mb-6 animate-bounce-gentle" />
            <h2 className="text-4xl font-groovy  mb-6">
              Built By Youth, For Youth
            </h2>
            <p className="text-xl /90 mb-8">
              Parivartā is powered by a community of conscious consumers, student ambassadors, and eco-warriors who believe in the power of reuse and sustainability.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-primary-foreground/20 backdrop-blur rounded-3xl p-6">
                <p className="text-3xl font-groovy text-primary-foreground mb-2">50+</p>
                <p className="text-primary-foreground/80">Campus Ambassadors</p>
              </div>
              <div className="bg-primary-foreground/20 backdrop-blur rounded-3xl p-6">
                <p className="text-3xl font-groovy text-primary-foreground mb-2">5K+</p>
                <p className="text-primary-foreground/80">Active Users</p>
              </div>
              <div className="bg-primary-foreground/20 backdrop-blur rounded-3xl p-6">
                <p className="text-3xl font-groovy text-primary-foreground mb-2">10K+</p>
                <p className="text-primary-foreground/80">Items Rehomed</p>
              </div>
            </div>
            <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">
              <Link to="/contact">Become an Ambassador</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Visualization */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-groovy text-center mb-12 text-foreground">
            Join the Movement
          </h2>
          
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="flex justify-center items-center mb-8">
                <RefreshCw className="h-32 w-32 text-primary animate-rotate-slow" />
              </div>
              
              <div className="text-center space-y-6">
                <p className="text-xl text-muted-foreground">
                  Every item you buy or sell on Parivartā contributes to:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="retro-card bg-sage/20 p-4">
                    <p className="text-2xl font-groovy text-sage mb-1">-2kg</p>
                    <p className="text-sm text-muted-foreground">CO₂ per item</p>
                  </div>
                  <div className="retro-card bg-mustard/20 p-4">
                    <p className="text-2xl font-groovy text-mustard mb-1">-50L</p>
                    <p className="text-sm text-muted-foreground">Water saved</p>
                  </div>
                  <div className="retro-card bg-terracotta/20 p-4">
                    <p className="text-2xl font-groovy text-terracotta mb-1">100%</p>
                    <p className="text-sm text-muted-foreground">Waste diverted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sage text-cream py-12">
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
                <li><Link to={categoryLink("Clothing & Accessories")} className="hover:text-primary transition-colors">Clothing</Link></li>
                <li><Link to={categoryLink("Gadgets")} className="hover:text-primary transition-colors">Gadgets</Link></li>
                <li><Link to={categoryLink("Furniture")} className="hover:text-primary transition-colors">Furniture</Link></li>
                <li><Link to={categoryLink("Home & Kitchen")} className="hover:text-primary transition-colors">Home & Kitchen</Link></li>
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
