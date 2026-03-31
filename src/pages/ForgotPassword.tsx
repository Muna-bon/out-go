import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });

            if (error) {
                setErrorMsg(error.message);
            } else {
                setIsSent(true);
                toast.success("Password reset email sent!");
            }
        } catch (error: any) {
            setErrorMsg("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-card p-8 rounded-2xl border border-border hover:shadow-card transition-shadow"
            >
                <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                </Link>

                <h1 className="text-3xl font-bold mb-2">Reset password</h1>
                <p className="text-muted-foreground mb-8">
                    Enter your email address to receive a secure link to reset your password.
                </p>

                {errorMsg && (
                    <div className="mb-6 p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
                        {errorMsg}
                    </div>
                )}

                {isSent ? (
                    <div className="space-y-6 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="font-medium text-lg">Check your email</p>
                            <p className="text-muted-foreground mt-2">
                                We've sent a password reset link to <strong>{email}</strong>
                            </p>
                        </div>
                        <p className="text-sm text-muted-foreground pt-4">
                            Didn't receive the email?{" "}
                            <button onClick={handleSubmit} className="text-primary hover:underline">
                                Click to resend
                            </button>
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="pl-10 h-12"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" size="lg" className="w-full gap-2" disabled={isLoading}>
                            {isLoading ? "Sending link..." : "Send reset link"}
                            {!isLoading && <ArrowRight className="h-5 w-5" />}
                        </Button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
