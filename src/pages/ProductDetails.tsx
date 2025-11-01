import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShoppingCart, MessageSquare, Calendar, Star, Package, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rentDialogOpen, setRentDialogOpen] = useState(false);
  const [rentMonths, setRentMonths] = useState("");

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

    if (!product.available_for_sale) {
      toast.error("This item is not available for sale");
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

  const handleRentInquiry = async () => {
    if (!user) {
      toast.error("Please sign in to rent items");
      navigate("/auth");
      return;
    }

    if (user.id === product?.user_id) {
      toast.error("You cannot rent your own item");
      return;
    }

    if (!rentMonths || parseInt(rentMonths) < 1) {
      toast.error("Please enter a valid number of months");
      return;
    }

    const months = parseInt(rentMonths);
    if (product.rent_duration_months && months > product.rent_duration_months) {
      toast.error(`Maximum rental duration is ${product.rent_duration_months} months`);
      return;
    }

    const totalPrice = (product.rent_price_per_month * months).toFixed(2);
    const rentMessage = `Hi! I'm interested in renting "${product.title}" for ${months} month${months > 1 ? 's' : ''} at ₹${product.rent_price_per_month}/month (Total: ₹${totalPrice}). Is it still available?`;

    try {
      const { data: existingRoom } = await supabase
        .from("chat_rooms")
        .select("id")
        .eq("buyer_id", user.id)
        .eq("seller_id", product.user_id)
        .eq("product_id", id)
        .maybeSingle();

      let roomId = existingRoom?.id;

      if (!roomId) {
        const { data: newRoom, error: roomError } = await supabase
          .from("chat_rooms")
          .insert({
            buyer_id: user.id,
            seller_id: product.user_id,
            product_id: id,
          })
          .select()
          .single();

        if (roomError) throw roomError;
        roomId = newRoom.id;
      }

      const { error: messageError } = await supabase.from("chats").insert({
        room_id: roomId,
        sender_id: user.id,
        message: rentMessage,
      });

      if (messageError) throw messageError;

      toast.success("Rental inquiry sent!");
      setRentDialogOpen(false);
      navigate(`/chat?room=${roomId}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to send rental inquiry");
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
      .maybeSingle();

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

  const nextImage = () => {
    if (product?.image_urls) {
      setCurrentImageIndex((prev) => (prev + 1) % product.image_urls.length);
    }
  };

  const previousImage = () => {
    if (product?.image_urls) {
      setCurrentImageIndex((prev) => (prev - 1 + product.image_urls.length) % product.image_urls.length);
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
  const hasMultipleImages = product.image_urls && product.image_urls.length > 1;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted relative group">
              {product.image_urls && product.image_urls.length > 0 ? (
                <>
                  <img
                    src={product.image_urls[currentImageIndex]}
                    alt={`${product.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={previousImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {product.image_urls.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No Image Available
                </div>
              )}
            </div>
            
            {/* Thumbnail strip */}
            {hasMultipleImages && (
              <div className="grid grid-cols-4 gap-2">
                {product.image_urls.map((url: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-4xl font-bold">{product.title}</h1>
                <div className="flex gap-2">
                  {product.available_for_sale && <Badge variant="default">For Sale</Badge>}
                  {product.available_for_rent && <Badge variant="secondary">For Rent</Badge>}
                </div>
              </div>
              
              {product.available_for_sale && product.sale_price && (
                <>
                  <p className="text-3xl font-bold text-primary mb-2">₹{product.sale_price}</p>
                  <p className="text-muted-foreground text-sm line-through">Original: ₹{product.cp}</p>
                </>
              )}
              
              {product.available_for_rent && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-lg font-semibold mb-1">Rental Options</p>
                  <p className="text-xl font-bold text-primary">₹{product.rent_price_per_month}/month</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Max duration: {product.rent_duration_months} months
                  </p>
                </div>
              )}
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
            <div className="space-y-3">
              {product.available_for_sale && (
                <Button onClick={handleAddToCart} className="w-full" size="lg">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              )}
              
              {product.available_for_rent && (
                <Dialog open={rentDialogOpen} onOpenChange={setRentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="w-full" size="lg">
                      Rent This Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Rent {product.title}</DialogTitle>
                      <DialogDescription>
                        Enter how many months you'd like to rent this item for
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="months">Number of Months</Label>
                        <Input
                          id="months"
                          type="number"
                          min="1"
                          max={product.rent_duration_months}
                          value={rentMonths}
                          onChange={(e) => setRentMonths(e.target.value)}
                          placeholder={`Max: ${product.rent_duration_months} months`}
                        />
                      </div>
                      {rentMonths && parseInt(rentMonths) > 0 && (
                        <div className="bg-muted p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground">Total Rent Cost</p>
                          <p className="text-2xl font-bold text-primary">
                            ₹{(product.rent_price_per_month * parseInt(rentMonths)).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {rentMonths} month{parseInt(rentMonths) > 1 ? 's' : ''} × ₹{product.rent_price_per_month}/month
                          </p>
                        </div>
                      )}
                    </div>
                    <Button onClick={handleRentInquiry} className="w-full">
                      Send Rental Inquiry
                    </Button>
                  </DialogContent>
                </Dialog>
              )}
              
              <Button onClick={handleChatWithSeller} variant="outline" className="w-full" size="lg">
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