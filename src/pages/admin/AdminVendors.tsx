import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Building2, Plus, Search, Edit, Trash2, Eye, CheckCircle, XCircle,
    Clock, AlertCircle, ChevronDown, ChevronUp,
} from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const businessTypes = [
    "Fitness Center / Gym",
    "Yoga / Pilates Studio",
    "CrossFit Box",
    "Wellness Center",
    "Sports Training Facility",
    "Dance Studio",
    "Martial Arts",
    "Swimming Pool / Aquatics",
    "Other",
];

const serviceOptions = [
    "Weight Training", "Cardio Equipment", "Group Classes", "Personal Training",
    "Yoga", "Pilates", "CrossFit", "HIIT", "Swimming", "Sauna / Steam",
    "Massage / Spa", "Nutrition Coaching",
];

const emptyForm = {
    business_name: "",
    business_type: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    description: "",
    services: [] as string[],
    operating_hours: "",
    website: "",
    status: "active",
};

type VendorForm = typeof emptyForm;

const AdminVendors = () => {
    const [vendors, setVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<VendorForm>({ ...emptyForm });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const loadVendors = async () => {
        try {
            const { data, error } = await supabase
                .from("vendors")
                .select("*")
                .order("created_at", { ascending: false });
            if (!error) setVendors(data || []);
        } catch {
            // table might not exist yet
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadVendors(); }, []);

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        if (!formData.business_name.trim()) errors.business_name = "Business name is required";
        if (!formData.business_type) errors.business_type = "Business type is required";
        if (!formData.email.trim()) errors.email = "Email is required";
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email address";
        if (!formData.phone.trim()) errors.phone = "Phone is required";
        if (!formData.address.trim()) errors.address = "Address is required";
        if (!formData.city.trim()) errors.city = "City is required";
        if (!formData.description.trim()) errors.description = "Description is required";
        if (formData.services.length === 0) errors.services = "Select at least one service";
        if (!formData.operating_hours.trim()) errors.operating_hours = "Operating hours are required";
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            toast.error("Please fill in all required fields");
        }
        return Object.keys(errors).length === 0;
    };

    const handleAdd = async () => {
        if (!validateForm()) return;
        setIsSaving(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            const { error } = await supabase.from("vendors").insert({
                ...formData,
                owner_id: userData.user?.id,
            });
            if (error) throw error;
            toast.success(`${formData.business_name} has been onboarded!`);
            setShowAddDialog(false);
            setFormData({ ...emptyForm });
            setFormErrors({});
            loadVendors();
        } catch (error: any) {
            toast.error(error.message || "Failed to add vendor");
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdate = async () => {
        if (!validateForm()) return;
        if (!selectedVendor) return;
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from("vendors")
                .update({
                    business_name: formData.business_name,
                    business_type: formData.business_type,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    description: formData.description,
                    services: formData.services,
                    operating_hours: formData.operating_hours,
                    website: formData.website,
                    status: formData.status,
                })
                .eq("id", selectedVendor.id);
            if (error) throw error;
            toast.success("Vendor updated successfully!");
            setShowEditDialog(false);
            setFormErrors({});
            loadVendors();
        } catch (error: any) {
            toast.error(error.message || "Failed to update vendor");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedVendor) return;
        try {
            const { error } = await supabase.from("vendors").delete().eq("id", selectedVendor.id);
            if (error) throw error;
            toast.success("Vendor deleted.");
            setShowDeleteDialog(false);
            setSelectedVendor(null);
            loadVendors();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete vendor");
        }
    };

    const handleStatusChange = async (vendor: any, newStatus: string) => {
        try {
            const { error } = await supabase.from("vendors").update({ status: newStatus }).eq("id", vendor.id);
            if (error) throw error;
            toast.success(`Vendor ${newStatus === "active" ? "approved" : newStatus}`);
            loadVendors();
        } catch (error: any) {
            toast.error(error.message || "Failed to update status");
        }
    };

    const openEditDialog = (vendor: any) => {
        setSelectedVendor(vendor);
        setFormData({
            business_name: vendor.business_name || "",
            business_type: vendor.business_type || "",
            email: vendor.email || "",
            phone: vendor.phone || "",
            address: vendor.address || "",
            city: vendor.city || "",
            description: vendor.description || "",
            services: vendor.services || [],
            operating_hours: vendor.operating_hours || "",
            website: vendor.website || "",
            status: vendor.status || "pending",
        });
        setFormErrors({});
        setShowEditDialog(true);
    };

    const filteredVendors = vendors.filter((v) => {
        const matchesSearch =
            v.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || v.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const toggleService = (service: string) => {
        setFormData({
            ...formData,
            services: formData.services.includes(service)
                ? formData.services.filter((s) => s !== service)
                : [...formData.services, service],
        });
    };

    const statusBadge = (status: string) => {
        const map: Record<string, string> = {
            active: "bg-green-500/10 text-green-600 border-green-200",
            pending: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
            suspended: "bg-red-500/10 text-red-600 border-red-200",
        };
        return map[status] || "bg-muted text-muted-foreground";
    };

    const FieldError = ({ field }: { field: string }) =>
        formErrors[field] ? <p className="text-xs text-destructive mt-1">{formErrors[field]}</p> : null;

    const VendorFormFields = () => (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <Label>Business Name *</Label>
                    <Input value={formData.business_name} onChange={(e) => setFormData({ ...formData, business_name: e.target.value })} className={formErrors.business_name ? "border-destructive" : ""} />
                    <FieldError field="business_name" />
                </div>
                <div>
                    <Label>Business Type *</Label>
                    <select value={formData.business_type} onChange={(e) => setFormData({ ...formData, business_type: e.target.value })} className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ${formErrors.business_type ? "border-destructive" : "border-input"}`}>
                        <option value="">Select type</option>
                        {businessTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <FieldError field="business_type" />
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <Label>Email *</Label>
                    <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={formErrors.email ? "border-destructive" : ""} />
                    <FieldError field="email" />
                </div>
                <div>
                    <Label>Phone *</Label>
                    <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={formErrors.phone ? "border-destructive" : ""} />
                    <FieldError field="phone" />
                </div>
            </div>
            <div>
                <Label>Address *</Label>
                <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={formErrors.address ? "border-destructive" : ""} />
                <FieldError field="address" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <Label>City *</Label>
                    <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className={formErrors.city ? "border-destructive" : ""} />
                    <FieldError field="city" />
                </div>
                <div>
                    <Label>Website</Label>
                    <Input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
                </div>
            </div>
            <div>
                <Label>Operating Hours *</Label>
                <Input value={formData.operating_hours} onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })} placeholder="e.g., Mon-Fri: 5AM-11PM" className={formErrors.operating_hours ? "border-destructive" : ""} />
                <FieldError field="operating_hours" />
            </div>
            <div>
                <Label>Description *</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={`min-h-[80px] ${formErrors.description ? "border-destructive" : ""}`} />
                <FieldError field="description" />
            </div>
            <div>
                <Label>Services * {formErrors.services && <span className="text-destructive text-xs">({formErrors.services})</span>}</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {serviceOptions.map((s) => (
                        <button key={s} type="button" onClick={() => toggleService(s)} className={`p-2 rounded-lg border text-xs font-medium transition-colors ${formData.services.includes(s) ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>
            {showEditDialog && (
                <div>
                    <Label>Status</Label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            )}
        </div>
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Vendors & Gyms</h1>
                        <p className="text-muted-foreground mt-1">Onboard, manage, and monitor vendor partners</p>
                    </div>
                    <Button className="gap-2" onClick={() => { setFormData({ ...emptyForm }); setFormErrors({}); setShowAddDialog(true); }}>
                        <Plus className="h-4 w-4" />
                        Onboard New Vendor
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search vendors..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="flex gap-2">
                        {["all", "active", "pending", "suspended"].map((status) => (
                            <Button
                                key={status}
                                variant={statusFilter === status ? "default" : "outline"}
                                size="sm"
                                onClick={() => setStatusFilter(status)}
                                className="capitalize"
                            >
                                {status}
                                {status !== "all" && (
                                    <Badge variant="secondary" className="ml-1.5 text-xs">
                                        {vendors.filter((v) => status === "all" ? true : v.status === status).length}
                                    </Badge>
                                )}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Vendor List */}
                {loading ? (
                    <div className="text-center py-20 text-muted-foreground">Loading vendors...</div>
                ) : filteredVendors.length === 0 ? (
                    <Card>
                        <CardContent className="py-16 text-center">
                            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-lg font-medium mb-2">No vendors found</p>
                            <p className="text-muted-foreground mb-6">{vendors.length === 0 ? "Start by onboarding your first vendor partner." : "Try adjusting your filters."}</p>
                            {vendors.length === 0 && <Button onClick={() => { setFormData({ ...emptyForm }); setFormErrors({}); setShowAddDialog(true); }}>Onboard First Vendor</Button>}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {filteredVendors.map((vendor, i) => (
                            <motion.div
                                key={vendor.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                            >
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-5">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-lg font-bold text-primary">{vendor.business_name?.charAt(0)}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold truncate">{vendor.business_name}</h3>
                                                        <Badge variant="outline" className={`text-xs ${statusBadge(vendor.status)}`}>
                                                            {vendor.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {vendor.business_type} • {vendor.city} • {vendor.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {vendor.status === "pending" && (
                                                    <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 gap-1" onClick={() => handleStatusChange(vendor, "active")}>
                                                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                                                    </Button>
                                                )}
                                                {vendor.status === "active" && (
                                                    <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-200 hover:bg-yellow-50 gap-1" onClick={() => handleStatusChange(vendor, "suspended")}>
                                                        <XCircle className="h-3.5 w-3.5" /> Suspend
                                                    </Button>
                                                )}
                                                {vendor.status === "suspended" && (
                                                    <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 gap-1" onClick={() => handleStatusChange(vendor, "active")}>
                                                        <CheckCircle className="h-3.5 w-3.5" /> Reactivate
                                                    </Button>
                                                )}
                                                <Button size="sm" variant="ghost" onClick={() => { setSelectedVendor(vendor); setShowDetailDialog(true); }}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => openEditDialog(vendor)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { setSelectedVendor(vendor); setShowDeleteDialog(true); }}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Vendor Dialog */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Onboard New Vendor</DialogTitle>
                        <DialogDescription>Add a gym or fitness partner to the OwtGo platform.</DialogDescription>
                    </DialogHeader>
                    <VendorFormFields />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                        <Button onClick={handleAdd} disabled={isSaving}>{isSaving ? "Saving..." : "Add Vendor"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Vendor Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Vendor</DialogTitle>
                        <DialogDescription>Update vendor information and status.</DialogDescription>
                    </DialogHeader>
                    <VendorFormFields />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                        <Button onClick={handleUpdate} disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Detail Dialog */}
            <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{selectedVendor?.business_name}</DialogTitle>
                    </DialogHeader>
                    {selectedVendor && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><p className="text-muted-foreground">Type</p><p className="font-medium">{selectedVendor.business_type}</p></div>
                                <div><p className="text-muted-foreground">Status</p><Badge variant="outline" className={statusBadge(selectedVendor.status)}>{selectedVendor.status}</Badge></div>
                                <div><p className="text-muted-foreground">Email</p><p className="font-medium">{selectedVendor.email}</p></div>
                                <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{selectedVendor.phone}</p></div>
                                <div className="col-span-2"><p className="text-muted-foreground">Address</p><p className="font-medium">{selectedVendor.address}, {selectedVendor.city}</p></div>
                                <div className="col-span-2"><p className="text-muted-foreground">Hours</p><p className="font-medium">{selectedVendor.operating_hours}</p></div>
                            </div>
                            <div><p className="text-sm text-muted-foreground mb-2">Services</p>
                                <div className="flex flex-wrap gap-2">
                                    {(selectedVendor.services || []).map((s: string) => <Badge key={s} variant="secondary">{s}</Badge>)}
                                </div>
                            </div>
                            <div><p className="text-sm text-muted-foreground mb-1">Description</p><p className="text-sm">{selectedVendor.description}</p></div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDetailDialog(false)}>Close</Button>
                        <Button onClick={() => { setShowDetailDialog(false); openEditDialog(selectedVendor); }}>Edit</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Vendor?</DialogTitle>
                        <DialogDescription>This will permanently remove {selectedVendor?.business_name} from the platform. This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Yes, Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminVendors;
