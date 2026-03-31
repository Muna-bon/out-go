import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import signupHero from "@/assets/signup-hero.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { LocationInput } from "@/components/ui/LocationInput";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    password: "",
  });
  const [showVerification, setShowVerification] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await register(formData);
    if (result.success) {
      if (result.requiresVerification) {
        setShowVerification(true);
      } else {
        navigate("/profile/settings?new=true");
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile/settings?new=true`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up with Google");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img src={signupHero} alt="Group of people jogging together" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Start your wellness journey
          </h2>
          <p className="text-xl text-white/80 max-w-md">
            Discover activities, connect with like-minded people, and live an active lifestyle.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-block mb-8 flex items-center gap-1.5 text-xl font-bold tracking-tight text-foreground">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              O
            </span>
            <span>owt<span className="text-primary">go</span></span>
          </Link>

          {showVerification ? (
            <div className="text-center py-10 space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold">Check your email</h2>
              <p className="text-muted-foreground">
                We've sent a verification link to <strong>{formData.email}</strong>. Please click the link to activate your account and login.
              </p>
              <Button onClick={() => navigate("/login")} className="w-full mt-6">
                Back to Login
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2">Create an account</h1>
              <p className="text-muted-foreground mb-8">
                Join OwtGo and start exploring activities near you
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="name" type="text" placeholder="John Doe" className="pl-10 h-12" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="you@example.com" className="pl-10 h-12" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <LocationInput
                    value={formData.location}
                    onChange={(val: string) => setFormData({ ...formData, location: val })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a password" className="pl-10 pr-10 h-12" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    className="mt-0.5"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    required
                  />
                  <Label htmlFor="terms" className="text-sm font-normal leading-snug">
                    I agree to the{" "}
                    <Link to="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link>{" "}
                    and{" "}
                    <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
                  </Label>
                </div>

                <Button type="submit" size="lg" className="w-full gap-2" disabled={!acceptedTerms}>
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </form>

              <div className="my-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
                  </div>
                </div>
              </div>

              <div>
                <Button variant="outline" size="lg" className="w-full" onClick={handleGoogleSignup} type="button">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </Button>
              </div>

              <p className="text-center text-muted-foreground mt-8">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
