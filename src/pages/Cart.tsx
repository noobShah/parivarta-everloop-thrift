import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("cart_items")
        .eq("id", session.user.id)
        .single();

      if (profile && profile.cart_items && profile.cart_items.length > 0) {
        const { data: products } = await supabase
          .from("products")
          .select("*")
          .in("id", profile.cart_items);

        if (products) setCartItems(products);
      }
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  const handleRemoveFromCart = async (productId: string) => {
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("cart_items")
      .eq("id", user.id)
      .single();

    if (profile) {
      const updatedCart = profile.cart_items.filter((id: string) => id !== productId);
      
      const { error } = await supabase
        .from("profiles")
        .update({ cart_items: updatedCart })
        .eq("id", user.id);

      if (error) {
        toast.error("Failed to remove item");
      } else {
        setCartItems(cartItems.filter((item) => item.id !== productId));
        toast.success("Item removed from cart");
      }
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.available_for_sale && item.sale_price ? item.sale_price : 0;
    return sum + parseFloat(price.toString());
  }, 0);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Your Cart</h1>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <Link to={`/product/${item.id}`} className="shrink-0">
                        <div className="h-32 w-32 rounded-lg overflow-hidden bg-muted">
                          {item.image_urls && item.image_urls.length > 0 ? (
                            <img
                              src={item.image_urls[0]}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                              No Image
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="flex-1 space-y-2">
                        <Link to={`/product/${item.id}`}>
                          <h3 className="text-xl font-semibold hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                        <div className="flex gap-2">
                          {item.available_for_sale && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">For Sale</span>
                          )}
                          {item.available_for_rent && (
                            <span className="text-xs bg-secondary/50 text-foreground px-2 py-1 rounded">For Rent</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          {item.available_for_sale && item.sale_price ? (
                            <p className="text-2xl font-bold text-primary">₹{item.sale_price}</p>
                          ) : (
                            <p className="text-sm text-muted-foreground">Not available for purchase</p>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold">Order Summary</h2>
                  <div className="space-y-2 border-t border-border pt-4">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Items ({cartItems.length})</span>
                      <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-2 border-t border-border">
                      <span>Total</span>
                      <span className="text-primary">₹{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    * Checkout is not implemented in this demo
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-20 text-center">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Start shopping to add items to your cart
              </p>
              <Button asChild>
                <Link to="/marketplace">Browse Marketplace</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
