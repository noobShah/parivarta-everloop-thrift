import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";
import { Upload, Star } from "lucide-react";

const categories = ["Gadgets", "Furniture", "Clothing & Accessories", "Home & Kitchen", "Antique & Décor"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    quality: "5",
    year_bought: new Date().getFullYear().toString(),
    condition: "",
    cp: "",
    sp: "",
    type: "Sale",
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      if (profileData) setProfile(profileData);

      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      
      if (productsData) setMyProducts(productsData);
    };

    checkUser();
  }, [navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      let imageUrl = null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const { error } = await supabase.from("products").insert({
        user_id: user.id,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        quality: parseInt(formData.quality),
        year_bought: parseInt(formData.year_bought),
        condition: formData.condition,
        cp: parseFloat(formData.cp),
        sp: parseFloat(formData.sp),
        type: formData.type,
        image_url: imageUrl,
      });

      if (error) throw error;

      toast.success("Product listed successfully!");
      setFormData({
        title: "",
        category: "",
        description: "",
        quality: "5",
        year_bought: new Date().getFullYear().toString(),
        condition: "",
        cp: "",
        sp: "",
        type: "Sale",
      });
      setImageFile(null);

      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (productsData) setMyProducts(productsData);
    } catch (error: any) {
      toast.error(error.message || "Failed to list product");
    } finally {
      setLoading(false);
    }
  };

  const yearsJoined = profile ? new Date().getFullYear() - new Date(profile.joined_at).getFullYear() : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Profile Section */}
        {profile && (
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-3xl">
                  {profile.name[0]}
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{profile.name}</h3>
                  <p className="text-muted-foreground">{profile.email}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{profile.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-muted-foreground">
                      Member for {yearsJoined} {yearsJoined === 1 ? 'year' : 'years'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* List New Product */}
        <Card>
          <CardHeader>
            <CardTitle>List a New Product</CardTitle>
            <CardDescription>Share your pre-loved items with the community</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quality">Quality (1-10) *</Label>
                  <Input
                    id="quality"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.quality}
                    onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year_bought">Year Bought *</Label>
                  <Input
                    id="year_bought"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.year_bought}
                    onChange={(e) => setFormData({ ...formData, year_bought: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sale">For Sale</SelectItem>
                      <SelectItem value="Rent">For Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Working Condition *</Label>
                <Textarea
                  id="condition"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  rows={2}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cp">Original Price (₹) *</Label>
                  <Input
                    id="cp"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.cp}
                    onChange={(e) => setFormData({ ...formData, cp: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sp">Selling Price (₹) *</Label>
                  <Input
                    id="sp"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.sp}
                    onChange={(e) => setFormData({ ...formData, sp: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Product Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Listing..." : "List Product"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* My Listings */}
        <div>
          <h2 className="text-3xl font-bold mb-6">My Listings</h2>
          {myProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                You haven't listed any products yet. Start by listing your first item above!
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
