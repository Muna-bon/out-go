import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
    BarChart3,
    Users,
    Calendar,
    Settings,
    Plus,
    TrendingUp,
    Clock,
    Edit,
    Trash2,
    Eye,
    Bell,
    Building2,
    MapPin,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getMyVendor, updateVendor, deleteVendor } from "@/lib/api";

const VendorDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [vendor, setVendor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editForm, setEditForm] = useState({
        business_name: "",
        description: "",
        operating_hours: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        website: "",
    });

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getMyVendor();
                setVendor(data);
                if (data) {
                    setEditForm({
                        business_name: data.business_name || "",
                        description: data.description || "",
                        operating_hours: data.operating_hours || "",
                        phone: data.phone || "",
                        email: data.email || "",
                        address: data.address || "",
                        city: data.city || "",
                        website: data.website || "",
                    });
                }
            } catch (error: any) {
                toast.error("Failed to load vendor data");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleUpdate = async () => {
        if (!vendor) return;
        setIsSaving(true);
        try {
            const updated = await updateVendor(vendor.id, editForm);
            setVendor(updated);
            setShowEditDialog(false);
            toast.success("Business information updated!");
        } catch (error: any) {
            toast.error(error.message || "Failed to update");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!vendor) return;
        setIsDeleting(true);
        try {
            await deleteVendor(vendor.id);
            toast.success("Business listing removed.");
            navigate("/vendors");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete");
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="container-app py-20 text-center text-muted-foreground">
                    Loading your dashboard...
                </div>
            </Layout>
        );
    }

    if (!vendor) {
        return (
            <Layout>
                <div className="min-h-[80vh] bg-muted/30 py-12 flex items-center justify-center">
                    <div className="text-center bg-card p-12 rounded-2xl shadow-sm border border-border max-w-md w-full mx-4">
                        <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-4">No Business Registered</h2>
                        <p className="text-muted-foreground mb-8">
                            You haven't registered a gym or business yet. Get started by becoming a partner.
                        </p>
                        <Link to="/vendor-signup">
                            <Button className="w-full h-12">Become a Partner</Button>
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    const statusColor = vendor.status === "active" ? "text-green-600 bg-green-50"
        : vendor.status === "pending" ? "text-yellow-600 bg-yellow-50"
            : "text-red-600 bg-red-50";

    return (
        <Layout>
            <section className="py-8 bg-muted/30 min-h-screen">
                <div className="container-app">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
                    >
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Partner Dashboard</h1>
                            <p className="text-muted-foreground">Welcome back, {vendor.business_name}</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowEditDialog(true)}>
                                <Settings className="h-4 w-4" />
                                Settings
                            </Button>
                            <Link to="/create">
                                <Button size="sm" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Program
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Status Banner */}
                    {vendor.status === "pending" && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-center gap-3"
                        >
                            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-yellow-800 dark:text-yellow-200">Application Under Review</p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">Your business application is being reviewed. This typically takes 2-3 business days.</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: "Status", value: vendor.status?.charAt(0).toUpperCase() + vendor.status?.slice(1) || "Pending", icon: CheckCircle, color: "text-green-500" },
                            { label: "Services", value: vendor.services?.length || 0, icon: Calendar, color: "text-accent" },
                            { label: "Business Type", value: vendor.business_type?.split(" / ")[0] || "—", icon: Building2, color: "text-primary" },
                            { label: "Location", value: vendor.city || "—", icon: MapPin, color: "text-yellow-500" },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <stat.icon className={`h-8 w-8 ${stat.color}`} />
                                        </div>
                                        <p className="text-2xl font-bold truncate">{stat.value}</p>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-6">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="services">Services</TabsTrigger>
                            <TabsTrigger value="info">Business Info</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview">
                            <div className="grid lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>About Your Business</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {vendor.description || "No description provided."}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Quick Info</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Status</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                                                {vendor.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Type</span>
                                            <span className="font-medium text-sm">{vendor.business_type}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Hours</span>
                                            <span className="font-medium text-sm">{vendor.operating_hours || "—"}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Phone</span>
                                            <span className="font-medium text-sm">{vendor.phone}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="services">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Services</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {vendor.services && vendor.services.length > 0 ? (
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {vendor.services.map((service: string) => (
                                                <div key={service} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                                                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                    <span className="font-medium">{service}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-10">
                                            No services listed. Edit your business info to add services.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="info">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Business Information</CardTitle>
                                    <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowEditDialog(true)}>
                                        <Edit className="h-4 w-4" />
                                        Edit
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {[
                                            { label: "Business Name", value: vendor.business_name },
                                            { label: "Business Type", value: vendor.business_type },
                                            { label: "Email", value: vendor.email },
                                            { label: "Phone", value: vendor.phone },
                                            { label: "Address", value: `${vendor.address}, ${vendor.city}` },
                                            { label: "Operating Hours", value: vendor.operating_hours },
                                            { label: "Website", value: vendor.website || "Not provided" },
                                        ].map((item) => (
                                            <div key={item.label} className="p-4 bg-muted/30 rounded-xl">
                                                <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                                                <p className="font-medium">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-border">
                                        <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
                                        <p className="text-sm text-muted-foreground mb-4">Remove your business listing from OwtGo. This action cannot be undone.</p>
                                        <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete Business Listing
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Business Information</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Business Name</Label>
                            <Input value={editForm.business_name} onChange={(e) => setEditForm({ ...editForm, business_name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Address</Label>
                            <Input value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>City</Label>
                            <Input value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Operating Hours</Label>
                            <Input value={editForm.operating_hours} onChange={(e) => setEditForm({ ...editForm, operating_hours: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Website</Label>
                            <Input value={editForm.website} onChange={(e) => setEditForm({ ...editForm, website: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                        <Button onClick={handleUpdate} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Business Listing?</DialogTitle>
                        <DialogDescription>
                            This will permanently remove your business from OwtGo. All associated data will be deleted. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Yes, Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Layout>
    );
};

export default VendorDashboard;
