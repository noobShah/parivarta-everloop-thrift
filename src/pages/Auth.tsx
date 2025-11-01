import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    // Check if user just came from password reset
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    
    if (type === 'recovery') {
      // User clicked password reset link, show password update form
      setIsReset(false);
      setIsLogin(false);
      toast.info("Please enter your new password");
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if this is a password update after reset
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get('type');
      
      if (type === 'recovery' && !isLogin && !isReset) {
        // Update password after reset
        const { error } = await supabase.auth.updateUser({
          password: password,
        });
        if (error) throw error;
        toast.success("Password updated successfully!");
        window.location.href = "/";
        return;
      }

      if (isReset) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        toast.success("Password reset link sent to your email!");
        setIsReset(false);
        setIsLogin(true);
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) throw error;
        toast.success("Account created! Welcome to Parivartā");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-hero bg-clip-text text-transparent">
            {(() => {
              const hashParams = new URLSearchParams(window.location.hash.substring(1));
              if (hashParams.get('type') === 'recovery') return "Set New Password";
              if (isReset) return "Reset Password";
              if (isLogin) return "Welcome Back";
              return "Join Parivartā";
            })()}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {(() => {
              const hashParams = new URLSearchParams(window.location.hash.substring(1));
              if (hashParams.get('type') === 'recovery') return "Enter your new password below";
              if (isReset) return "Enter your email to receive a reset link";
              if (isLogin) return "Sign in to continue";
              return "Create your account to start";
            })()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && !isReset && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin && !isReset}
                />
              </div>
            )}
            {!(() => {
              const hashParams = new URLSearchParams(window.location.hash.substring(1));
              return hashParams.get('type') === 'recovery';
            })() && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}
            {!isReset && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setIsReset(true)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : (() => {
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                if (hashParams.get('type') === 'recovery') return "Update Password";
                if (isReset) return "Send Reset Link";
                if (isLogin) return "Sign In";
                return "Sign Up";
              })()}
            </Button>
          </form>
          <div className="mt-4 text-center">
            {!(() => {
              const hashParams = new URLSearchParams(window.location.hash.substring(1));
              return hashParams.get('type') === 'recovery';
            })() && (
              <button
                type="button"
                onClick={() => {
                  if (isReset) {
                    setIsReset(false);
                    setIsLogin(true);
                  } else {
                    setIsLogin(!isLogin);
                  }
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isReset ? "Back to sign in" : isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
