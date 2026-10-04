import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  MapPin,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/outgo-logo.png";
import signupHero from "@/assets/signup-hero.jpg";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    password: "",
  });

  const navigate = useNavigate();

  // Cooldown timer countdown for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/login?verified=true`;

      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.name.trim(),
            location: formData.location.trim(),
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        toast.error(error.message);
        setIsLoading(false);
        return;
      }

      // If Supabase has email confirmation enabled, data.session will be null and user is unconfirmed
      if (data?.user && !data.session) {
        setIsVerificationSent(true);
        setResendCooldown(60);
        toast.success("Verification email dispatched! Please check your inbox.");
      } else {
        // If email confirmation is disabled in Supabase, user is immediately logged in
        toast.success("Account created successfully!");
        navigate("/profile?prompt_update=true");
      }
    } catch (err: any) {
      const msg = err?.message || "An unexpected error occurred. Please try again.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setErrorMessage(null);

    try {
      const redirectUrl = `${window.location.origin}/login?verified=true`;
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: formData.email.trim(),
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        toast.error(error.message);
        setErrorMessage(error.message);
      } else {
        toast.success("New verification link sent to your email!");
        setResendCooldown(60);
      }
    } catch (err: any) {
      toast.error(err?.message || "Could not resend email. Please try again later.");
    } finally {
      setIsResending(false);
    }
  };

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/profile?prompt_update=true`,
        },
      });
      if (error) {
        toast.error(error.message);
        setIsGoogleLoading(false);
      }
    } catch (err: any) {
      toast.error(err?.message || "Google sign in failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src={signupHero}
          alt="Group of people jogging together"
          className="absolute inset-0 w-full h-full object-cover"
        />
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

      {/* Right Side - Form or Verification Notification */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-block mb-8">
            <img src={logo} alt="OutGo" className="h-12 w-auto" />
          </Link>

          <AnimatePresence mode="wait">
            {isVerificationSent ? (
              /* Verification Notification View */
              <motion.div
                key="verification-notice"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-sm relative">
                  <Mail className="h-8 w-8" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
                  </span>
                </div>

                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight">Verify your email</h1>
                  <p className="text-muted-foreground text-sm">
                    We've dispatched a verification link to:
                  </p>
                  <p className="font-semibold text-foreground text-base bg-muted/50 py-1.5 px-3 rounded-lg inline-block border border-border">
                    {formData.email}
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-left space-y-3">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-foreground">Next Step: Verification</p>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        Click the link in your email to confirm your account. You will then be directed to sign in and personalize your profile.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-foreground">Profile Personalization</p>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        After signing in, you'll be prompted to complete your bio, activity interests, and workout schedule.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Button
                    onClick={() => navigate("/login")}
                    size="lg"
                    className="w-full gap-2"
                  >
                    Go to Login
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleResendVerification}
                    disabled={resendCooldown > 0 || isResending}
                    className="w-full gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${isResending ? "animate-spin" : ""}`} />
                    {resendCooldown > 0
                      ? `Resend available in ${resendCooldown}s`
                      : isResending
                      ? "Sending..."
                      : "Resend Verification Email"}
                  </Button>

                  <button
                    type="button"
                    onClick={() => setIsVerificationSent(false)}
                    className="w-full text-center text-xs text-muted-foreground hover:text-foreground pt-1 transition-colors"
                  >
                    Entered the wrong email? Edit sign up details
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Regular Signup Form */
              <motion.div
                key="signup-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h1 className="text-3xl font-bold mb-2">Create an account</h1>
                <p className="text-muted-foreground mb-6">
                  Join OutGo and start exploring activities near you
                </p>

                {errorMessage && (
                  <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10 h-12"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 h-12"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="location"
                        type="text"
                        placeholder="City, State"
                        className="pl-10 h-12"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password (min. 6 characters)"
                        className="pl-10 pr-10 h-12"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                  </div>

                  <div className="flex items-start space-x-2 pt-1">
                    <Checkbox id="terms" className="mt-0.5" required />
                    <Label htmlFor="terms" className="text-sm font-normal leading-snug">
                      I agree to the{" "}
                      <Link to="/terms-of-service" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy-policy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button type="submit" size="lg" className="w-full gap-2 mt-2" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="my-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full h-12 flex items-center justify-center gap-3 text-sm font-medium border-border hover:bg-muted/60 transition-all shadow-sm"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  <span>{isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}</span>
                </Button>

                <p className="text-center text-muted-foreground mt-8">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
