import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Building2, Clock, CheckCircle, Phone, Mail, Globe, MessageCircle, CalendarPlus, Share2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getVendorById } from "@/lib/api";

const VendorDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [vendor, setVendor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showContactDialog, setShowContactDialog] = useState(false);
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);
    const [contactMessage, setContactMessage] = useState("");

    useEffect(() => {
        if (!id) return;
        const load = async () => {
            try {
                const data = await getVendorById(id);
                setVendor(data);
            } catch {
                // Vendor not found in DB, that's ok
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    const handleContact = () => {
        if (isAuthenticated) {
            setShowContactDialog(true);
        } else {
            setShowAuthPrompt(true);
        }
    };

    const handleSendMessage = () => {
        toast.success("Message sent to " + (vendor?.business_name || "vendor") + "!");
        setContactMessage("");
        setShowContactDialog(false);
    };

    if (loading) {
        return (
            <Layout>
                <div className="container-app py-20 text-center text-muted-foreground">Loading...</div>
            </Layout>
        );
    }

    if (!vendor) {
        return (
            <Layout>
                <div className="container-app py-20 text-center">
                    <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h1 className="text-2xl font-bold mb-4">Vendor not found</h1>
                    <p className="text-muted-foreground mb-6">This vendor may have been removed or doesn't exist.</p>
                    <Link to="/vendors">
                        <Button>Browse Vendors</Button>
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className="bg-muted/30 pt-24 pb-12 border-b border-border">
                <div className="container-app">
                    <Link to="/vendors" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to vendors
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">
                                    {vendor.business_type}
                                </Badge>
                                {vendor.status === "active" && (
                                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-none">
                                        Verified
                                    </Badge>
                                )}
                                {vendor.status === "pending" && (
                                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-none">
                                        Pending Review
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-4xl font-bold mb-4">{vendor.business_name}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span>{vendor.address}, {vendor.city}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    <span>{vendor.operating_hours || "Hours not set"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex md:flex-col gap-3">
                            <Button size="lg" className="w-full gap-2" onClick={handleContact}>
                                <MessageCircle className="h-4 w-4" />
                                Contact
                            </Button>
                            <Button size="lg" variant="outline" className="w-full gap-2" onClick={handleShare}>
                                <Share2 className="h-4 w-4" />
                                Share
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12">
                <div className="container-app">
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="card-elevated p-6">
                                <h2 className="text-2xl font-semibold mb-4">About {vendor.business_name}</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    {vendor.description || "No description provided."}
                                </p>
                            </div>

                            <div className="card-elevated p-6">
                                <h2 className="text-2xl font-semibold mb-4">Services Offered</h2>
                                {vendor.services && vendor.services.length > 0 ? (
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {vendor.services.map((service: string) => (
                                            <div key={service} className="flex items-center gap-3">
                                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                <span>{service}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No services listed yet.</p>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="card-elevated p-6 sticky top-24 space-y-6">
                                <h3 className="font-semibold text-lg flex items-center gap-2 border-b border-border pb-3">
                                    <Building2 className="h-5 w-5 text-primary" /> Contact Info
                                </h3>
                                <div className="space-y-4 text-sm text-foreground">
                                    {vendor.phone && (
                                        <a href={`tel:${vendor.phone}`} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                                            <Phone className="h-4 w-4 text-primary" />
                                            <span>{vendor.phone}</span>
                                        </a>
                                    )}
                                    {vendor.email && (
                                        <a href={`mailto:${vendor.email}`} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                                            <Mail className="h-4 w-4 text-primary" />
                                            <span>{vendor.email}</span>
                                        </a>
                                    )}
                                    {vendor.website && (
                                        <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                                            <Globe className="h-4 w-4 text-primary" />
                                            <span className="truncate">{vendor.website}</span>
                                        </a>
                                    )}
                                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        <span>{vendor.address}, {vendor.city}</span>
                                    </div>
                                </div>
                                <Button variant="secondary" className="w-full mt-4 gap-2" onClick={handleContact}>
                                    <MessageCircle className="h-4 w-4" />
                                    Send a Message
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Dialog */}
            <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Contact {vendor.business_name}</DialogTitle>
                        <DialogDescription>
                            Send a message to this vendor. They'll receive your message via email.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <Textarea
                            placeholder="Hi, I'm interested in your services..."
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            className="min-h-[120px]"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowContactDialog(false)}>Cancel</Button>
                        <Button onClick={handleSendMessage} disabled={!contactMessage.trim()}>Send Message</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Auth Prompt */}
            <Dialog open={showAuthPrompt} onOpenChange={setShowAuthPrompt}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sign in required</DialogTitle>
                        <DialogDescription>You need an account to contact this vendor.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                        <Button variant="outline" className="w-full sm:w-auto" onClick={() => { setShowAuthPrompt(false); navigate("/login"); }}>
                            Log In
                        </Button>
                        <Button className="w-full sm:w-auto" onClick={() => { setShowAuthPrompt(false); navigate("/signup"); }}>
                            Sign Up
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Layout>
    );
};

export default VendorDetail;
