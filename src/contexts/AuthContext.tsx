import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface User {
    id: string;
    name: string;
    email: string;
    location?: string;
    avatar_url?: string;
    bio?: string;
    age?: number;
    activity_type?: string;
    preferred_time?: string;
    pace?: string;
    interests?: string[];
    rating?: number;
    completed_pairings?: number;
    email_notifications?: boolean;
    push_notifications?: boolean;
    role?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    isAdmin: boolean;
    user: User | null;
    login: (email: string, password?: string) => Promise<boolean>;
    logout: () => Promise<void>;
    register: (userData: any) => Promise<{ success: boolean; requiresVerification?: boolean }>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async (supabaseUser: SupabaseUser) => {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", supabaseUser.id)
            .single();

        if (!error && data) {
            // Sync Google avatar if the user signed in with Google and profile has no avatar
            const googleAvatar = supabaseUser.user_metadata?.avatar_url;
            let avatarUrl = data.avatar_url;

            if (googleAvatar && !data.avatar_url) {
                const { error: updateError } = await supabase
                    .from("profiles")
                    .update({ avatar_url: googleAvatar })
                    .eq("id", supabaseUser.id);

                if (!updateError) {
                    avatarUrl = googleAvatar;
                }
            }

            setUser({
                id: data.id,
                name: data.name,
                email: data.email,
                location: data.location,
                avatar_url: avatarUrl,
                bio: data.bio,
                age: data.age,
                activity_type: data.activity_type,
                preferred_time: data.preferred_time,
                pace: data.pace,
                interests: data.interests,
                rating: data.rating,
                completed_pairings: data.completed_pairings,
                email_notifications: data.email_notifications,
                push_notifications: data.push_notifications,
                role: data.role,
            });
            setIsAuthenticated(true);
        } else {
            // Fallback if profile doesn't exist yet (e.g. trigger hasn't fired yet)
            const googleAvatar = supabaseUser.user_metadata?.avatar_url;
            setUser({
                id: supabaseUser.id,
                name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || "User",
                email: supabaseUser.email || "",
                avatar_url: googleAvatar || undefined,
            });
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        // Fetch current session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchProfile(session.user);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchProfile(session.user);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchProfile]);

    const refreshProfile = useCallback(async () => {
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        if (supabaseUser) {
            await fetchProfile(supabaseUser);
        }
    }, [fetchProfile]);

    const login = async (email: string, password?: string) => {
        if (!password) {
            toast.error("Password is required for login");
            return false;
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast.error(error.message);
            return false;
        }

        toast.success("Successfully logged in");
        return true;
    };

    const register = async (userData: any) => {
        if (!userData.password) {
            toast.error("Password is required for signup");
            return { success: false };
        }

        // Pre-check specifically for existing email because Supabase hides it on Confirm Email Mode
        const { data: existingProfile } = await supabase
            .from("profiles")
            .select("email")
            .eq("email", userData.email)
            .maybeSingle();

        if (existingProfile) {
            toast.error("An account with this email already exists. Please log in or use Forgot Password.");
            return { success: false };
        }

        const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
                data: {
                    name: userData.name,
                    location: userData.location,
                }
            }
        });

        if (error) {
            // Check for specific error where user already exists
            if (error.message.includes("already registered") || error.status === 400 && error.message.includes("already exists")) {
                toast.error("This email is already registered. Please log in or use 'Forgot Password'.");
            } else {
                toast.error(error.message);
            }
            return { success: false };
        }

        if (data.user && !data.session) {
            // Confirm Email is required
            return { success: true, requiresVerification: true };
        }

        toast.success("Registration successful! You are now logged in.");
        return { success: true, requiresVerification: false };
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error(error.message);
        } else {
            setUser(null);
            setIsAuthenticated(false);
            toast.info("Logged out successfully");
        }
    };

    if (loading) {
        return null; // or a loading spinner
    }

    const isAdmin = user?.role === "admin";

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, user, login, logout, register, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
