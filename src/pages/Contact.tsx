import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { categoryLink } from "@/lib/utils";
import { Phone, Mail, Instagram, Linkedin, Megaphone, Send, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent! 🌿",
      description: "We'll get back to you soon with our eco-vibes!",
    });
    setFormData({ name: "", email: "", category: "", message: "" });
  };

  const faqs = [
    {
      question: "How does commission work?",
      answer: "Our platform follows a dual commission structure to ensure transparency and fair transactions for both buyers and sellers.                  br        A listing commission of 5–10% is charged to the seller only when their item is successfully sold. This amount is automatically deducted from the final sale payment before it is transferred to the seller.           br        On the other hand, buyers are charged a platform fee of 10–20% on top of the item’s price, which helps maintain and enhance our marketplace experience. If the buyer opts for delivery, delivery charges will be added separately based on location and service type.             br        The commission helps us maintain the platform, verify sellers, and provide secure payment processing."
    },
    {
      question: "Is my payment secure?",
      answer: "Absolutely! We use industry-standard encryption and secure payment gateways. Your financial information is never stored on our servers, and all transactions are protected."
    },
    {
      question: "What can I sell?",
      answer: "You can sell pre-loved items in categories like Clothing & Accessories, Gadgets, Furniture, Home & Kitchen, and Antiques & Décor. Items should be in good condition and accurately described."
    },
    {
      question: "How does delivery work?",
      answer: "Buyers can choose between self-pickup or delivery at checkout.      br       If a buyer selects delivery, a delivery fee will be applied based on the location and type of delivery service chosen.     br         Alternatively, buyers can opt for self-pickup, where they personally collect the item from the seller — and as a reward, they’ll earn Eco Points, which can later be redeemed on our website for discounts or offers.Buyers and sellers can coordinate delivery directly through our chat feature."
    },
    {
      question: "What makes Parivartā eco-friendly?",
      answer: "By facilitating the resale of pre-loved items, we extend product lifecycles, reduce waste in landfills, and decrease the carbon footprint associated with manufacturing new products. Every transaction is a step towards a circular economy!"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <Phone className="h-16 w-16 text-white mx-auto mb-6 animate-bounce-gentle" />
          <h1 className="text-5xl md:text-6xl font-groovy text-foreground mb-4">
            Let's Connect & Collaborate
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Questions? Ideas? Just want to chat about sustainability?
          </p>
          <div className="mt-8">
            {/* Image from public root (place contact.jpg in public/) */}
            <img src="/contact.jpg" alt="Contact Parivartā" className="mx-auto w-full max-w-md rounded-2xl object-cover shadow-lg" />
          </div>
        </div>
      </section>

      {/* Wavy Divider */}
      <div className="wavy-divider"></div>

      {/* Contact Form Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="retro-card bg-card p-8 border-4 border-primary/20">
              <h2 className="text-3xl font-groovy text-foreground mb-6 text-center">
                Send Your Vibes
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Your groovy name"
                    required
                    className="border-2 border-border focus:border-primary rounded-2xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your@email.com"
                    required
                    className="border-2 border-border focus:border-primary rounded-2xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Category
                  </label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="border-2 border-border focus:border-primary rounded-2xl">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="support">Seller Support</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="press">Press</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Message
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Share your thoughts..."
                    required
                    className="border-2 border-border focus:border-primary rounded-2xl min-h-32"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Send Your Vibes <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-gradient-accent">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="retro-card bg-gradient-green p-6 text-center">
              <div className="w-16 h-16 bg-sage rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-cream" />
              </div>
              <h3 className="font-groovy text-xl text-foreground mb-2">Email Us</h3>
              <p className="text-sm text-white">hello@parivarta.com</p>
            </div>

            <div className="retro-card bg-terracotta/30 p-6 text-center">
              <div className="w-16 h-16 bg-terracotta rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="flex gap-1">
                  <Instagram className="h-6 w-6 text-cream" />
                  <Linkedin className="h-6 w-6 text-cream" />
                </div>
              </div>
              <h3 className="font-groovy text-xl text-foreground mb-2">Social Media</h3>
              <p className="text-sm text-white">@parivarta.india</p>
            </div>

            <div className="retro-card bg-mustard/30 p-6 text-center">
              <div className="w-16 h-16 bg-mustard rounded-full flex items-center justify-center mx-auto mb-4">
                <Megaphone className="h-8 w-8 text-foreground" />
              </div>
              <h3 className="font-groovy text-xl text-foreground mb-2">Campus Program</h3>
              <p className="text-sm text-white">Become an Ambassador</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-groovy text-foreground">Quick Answers</h2>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="retro-card bg-card border-2 border-border px-6"
                >
                  <AccordionTrigger className="text-left font-groovy text-lg hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground whitespace-pre-line">
                    {faq.answer.replace(/br\s*/g, "\n")}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-groovy text-center mb-8 text-foreground">
            Where We Loop
          </h2>
          <div className="max-w-4xl mx-auto retro-card bg-card p-8 text-center">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-4">
              Currently serving across Tier-1 & Tier-2 cities in India
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {["Mumbai", "Delhi", "Bangalore", "Pune", "Ahmedabad", "Hyderabad", "Chennai", "Kolkata"].map((city) => (
                <span key={city} className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-sand">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-6">💿</div>
            <h2 className="text-4xl font-groovy mb-4">
              Join Our Eco-Tribe
            </h2>
            <p className="mb-6 text-lg">
              Get sustainability tips, exclusive deals, and community updates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-background text-foreground border-2 border-primary-foreground/20 rounded-2xl"
              />
              <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">
                Loop Me In!
              </Button>
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
