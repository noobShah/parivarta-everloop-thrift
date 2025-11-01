import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";
import { Upload, Star, Edit, Trash2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const categories = ["Gadgets", "Furniture", "Clothing & Accessories", "Home & Kitchen", "Antique & Décor"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    quality: "5",
    year_bought: new Date().getFullYear().toString(),
    condition: "",
    cp: "",
    available_for_sale: true,
    available_for_rent: false,
    sale_price: "",
    rent_price_per_month: "",
    rent_duration_months: "",
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

      loadProducts(session.user.id);
    };

    checkUser();
  }, [navigate]);

  const loadProducts = async (userId: string) => {
    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (productsData) setMyProducts(productsData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 4);
      setImageFiles(filesArray);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.available_for_sale && !formData.available_for_rent) {
      toast.error("Please select at least one option: Sale or Rent");
      return;
    }

    if (imageFiles.length === 0 && !editingProduct) {
      toast.error("Please add at least one image");
      return;
    }

    if (imageFiles.length > 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }

    setLoading(true);

    try {
      let imageUrls: string[] = editingProduct?.image_urls || [];

      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}-${Math.random()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

          return publicUrl;
        });

        imageUrls = await Promise.all(uploadPromises);
      }

      const productData = {
        user_id: user.id,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        quality: parseInt(formData.quality),
        year_bought: parseInt(formData.year_bought),
        condition: formData.condition,
        cp: parseFloat(formData.cp),
        available_for_sale: formData.available_for_sale,
        available_for_rent: formData.available_for_rent,
        sale_price: formData.available_for_sale ? parseFloat(formData.sale_price) : null,
        rent_price_per_month: formData.available_for_rent ? parseFloat(formData.rent_price_per_month) : null,
        rent_duration_months: formData.available_for_rent ? parseInt(formData.rent_duration_months) : null,
        image_urls: imageUrls,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;
        toast.success("Product updated successfully!");
        setEditingProduct(null);
      } else {
        const { error } = await supabase.from("products").insert(productData);
        if (error) throw error;
        toast.success("Product listed successfully!");
      }

      resetForm();
      loadProducts(user.id);
    } catch (error: any) {
      toast.error(error.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      category: product.category,
      description: product.description,
      quality: product.quality.toString(),
      year_bought: product.year_bought.toString(),
      condition: product.condition,
      cp: product.cp.toString(),
      available_for_sale: product.available_for_sale,
      available_for_rent: product.available_for_rent,
      sale_price: product.sale_price?.toString() || "",
      rent_price_per_month: product.rent_price_per_month?.toString() || "",
      rent_duration_months: product.rent_duration_months?.toString() || "",
    });
    setImageFiles([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productToDelete);

      if (error) throw error;

      toast.success("Product deleted successfully!");
      loadProducts(user.id);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      quality: "5",
      year_bought: new Date().getFullYear().toString(),
      condition: "",
      cp: "",
      available_for_sale: true,
      available_for_rent: false,
      sale_price: "",
      rent_price_per_month: "",
      rent_duration_months: "",
    });
    setImageFiles([]);
    setEditingProduct(null);
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{editingProduct ? "Edit Product" : "List a New Product"}</CardTitle>
                <CardDescription>Share your pre-loved items with the community</CardDescription>
              </div>
              {editingProduct && (
                <Button variant="outline" onClick={resetForm}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel Edit
                </Button>
              )}
            </div>
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

              <div className="space-y-3">
                <Label>Availability *</Label>
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sale"
                      checked={formData.available_for_sale}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, available_for_sale: checked as boolean })
                      }
                    />
                    <label htmlFor="sale" className="text-sm font-medium cursor-pointer">
                      Available for Sale
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rent"
                      checked={formData.available_for_rent}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, available_for_rent: checked as boolean })
                      }
                    />
                    <label htmlFor="rent" className="text-sm font-medium cursor-pointer">
                      Available for Rent
                    </label>
                  </div>
                </div>
              </div>

              {formData.available_for_sale && (
                <div className="space-y-2">
                  <Label htmlFor="sale_price">Sale Price (₹) *</Label>
                  <Input
                    id="sale_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.sale_price}
                    onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                    required={formData.available_for_sale}
                  />
                </div>
              )}

              {formData.available_for_rent && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rent_price">Rent Price per Month (₹) *</Label>
                    <Input
                      id="rent_price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.rent_price_per_month}
                      onChange={(e) => setFormData({ ...formData, rent_price_per_month: e.target.value })}
                      required={formData.available_for_rent}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rent_duration">Rent Duration (Months) *</Label>
                    <Input
                      id="rent_duration"
                      type="number"
                      min="1"
                      value={formData.rent_duration_months}
                      onChange={(e) => setFormData({ ...formData, rent_duration_months: e.target.value })}
                      required={formData.available_for_rent}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="images">Product Images (1-4 images) {!editingProduct && "*"}</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="flex-1"
                    required={!editingProduct}
                  />
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                {imageFiles.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {imageFiles.length} image{imageFiles.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Saving..." : editingProduct ? "Update Product" : "List Product"}
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
                <div key={product.id} className="relative">
                  <ProductCard {...product} />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-background/80 backdrop-blur"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={() => {
                        setProductToDelete(product.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this product listing. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}