import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShoppingCart, MessageSquare, Calendar, Star, Package } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data: productData } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (productData) {
        setProduct(productData);
        
        const { data: sellerData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", productData.user_id)
          .single();
        
        if (sellerData) setSeller(sellerData);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      navigate("/auth");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("cart_items")
      .eq("id", user.id)
      .single();

    if (profile) {
      const cartItems = profile.cart_items || [];
      if (cartItems.includes(id)) {
        toast.info("Item already in cart");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ cart_items: [...cartItems, id] })
        .eq("id", user.id);

      if (error) {
        toast.error("Failed to add to cart");
      } else {
        toast.success("Added to cart!");
      }
    }
  };

  const handleChatWithSeller = async () => {
    if (!user) {
      toast.error("Please sign in to chat");
      navigate("/auth");
      return;
    }

    if (user.id === product?.user_id) {
      toast.error("You cannot chat with yourself");
      return;
    }

    const { data: existingRoom } = await supabase
      .from("chat_rooms")
      .select("id")
      .eq("buyer_id", user.id)
      .eq("seller_id", product.user_id)
      .eq("product_id", id)
      .single();

    if (existingRoom) {
      navigate(`/chat?room=${existingRoom.id}`);
      return;
    }

    const { data: newRoom, error } = await supabase
      .from("chat_rooms")
      .insert({
        buyer_id: user.id,
        seller_id: product.user_id,
        product_id: id,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to start chat");
    } else {
      navigate(`/chat?room=${newRoom.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Product not found</p>
        </div>
      </div>
    );
  }

  const yearsJoined = seller ? new Date().getFullYear() - new Date(seller.joined_at).getFullYear() : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No Image Available
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-4xl font-bold">{product.title}</h1>
                <Badge variant={product.type === "Sale" ? "default" : "secondary"} className="text-lg px-4 py-1">
                  {product.type}
                </Badge>
              </div>
              <p className="text-3xl font-bold text-primary mb-4">₹{product.sp}</p>
              <p className="text-muted-foreground text-sm line-through">Original: ₹{product.cp}</p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">Category:</span>
                  <span className="text-muted-foreground">{product.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">Quality:</span>
                  <span className="text-muted-foreground">{product.quality}/10</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">Year Bought:</span>
                  <span className="text-muted-foreground">{product.year_bought}</span>
                </div>
                <div>
                  <span className="font-semibold">Condition:</span>
                  <p className="text-muted-foreground mt-1">{product.condition}</p>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-2xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Seller Info */}
            {seller && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">Seller Information</h3>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {seller.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{seller.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-4 w-4" />
                        <span>{seller.rating.toFixed(1)} rating</span>
                        <span>•</span>
                        <span>{yearsJoined} {yearsJoined === 1 ? 'year' : 'years'} on platform</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button onClick={handleAddToCart} className="flex-1" size="lg">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button onClick={handleChatWithSeller} variant="secondary" className="flex-1" size="lg">
                <MessageSquare className="mr-2 h-5 w-5" />
                Chat with Seller
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
