import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Building2, Calendar, DollarSign, TrendingUp, ArrowUpRight, Activity } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalVendors: 0,
        totalEvents: 0,
        activeVendors: 0,
        pendingVendors: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                // Try using RPC function (bypasses RLS)
                const { data: rpcData, error: rpcError } = await supabase.rpc("admin_get_stats");
                
                if (!rpcError && rpcData) {
                    setStats({
                        totalUsers: rpcData.total_users || 0,
                        totalVendors: rpcData.total_vendors || 0,
                        totalEvents: rpcData.total_events || 0,
                        activeVendors: rpcData.active_vendors || 0,
                        pendingVendors: rpcData.pending_vendors || 0,
                    });
                } else {
                    // Fallback: direct queries (may be limited by RLS)
                    const [usersRes, vendorsRes, eventsRes] = await Promise.all([
                        supabase.from("profiles").select("id"),
                        supabase.from("vendors").select("id, status"),
                        supabase.from("events").select("id"),
                    ]);
                    const vendors = vendorsRes.data || [];
                    setStats({
                        totalUsers: (usersRes.data || []).length,
                        totalVendors: vendors.length,
                        totalEvents: (eventsRes.data || []).length,
                        activeVendors: vendors.filter((v) => v.status === "active").length,
                        pendingVendors: vendors.filter((v) => v.status === "pending").length,
                    });
                }
            } catch {
                // Tables might not exist yet
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    const statCards = [
        { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-500 bg-blue-500/10", link: "/admin/users" },
        { label: "Total Vendors", value: stats.totalVendors, icon: Building2, color: "text-purple-500 bg-purple-500/10", link: "/admin/vendors" },
        { label: "Active Vendors", value: stats.activeVendors, icon: TrendingUp, color: "text-green-500 bg-green-500/10", link: "/admin/vendors" },
        { label: "Pending Approvals", value: stats.pendingVendors, icon: Activity, color: "text-yellow-500 bg-yellow-500/10", link: "/admin/vendors" },
        { label: "Total Events", value: stats.totalEvents, icon: Calendar, color: "text-pink-500 bg-pink-500/10", link: "/admin/events" },
        { label: "Platform Fee", value: "2%", icon: DollarSign, color: "text-emerald-500 bg-emerald-500/10", link: "/admin/revenue" },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Overview of your OwtGo platform</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statCards.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link to={stat.link}>
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                                                <stat.icon className="h-6 w-6" />
                                            </div>
                                            <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <p className="text-3xl font-bold">{loading ? "..." : stat.value}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link to="/admin/vendors" className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                            <Building2 className="h-5 w-5 text-primary" />
                            <div>
                                <p className="font-medium text-sm">Onboard Vendor</p>
                                <p className="text-xs text-muted-foreground">Add a new gym or partner</p>
                            </div>
                        </Link>
                        <Link to="/admin/users" className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                            <Users className="h-5 w-5 text-primary" />
                            <div>
                                <p className="font-medium text-sm">Manage Users</p>
                                <p className="text-xs text-muted-foreground">View & edit user accounts</p>
                            </div>
                        </Link>
                        <Link to="/admin/events" className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                            <Calendar className="h-5 w-5 text-primary" />
                            <div>
                                <p className="font-medium text-sm">Manage Events</p>
                                <p className="text-xs text-muted-foreground">Review & moderate events</p>
                            </div>
                        </Link>
                        <Link to="/admin/revenue" className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                            <DollarSign className="h-5 w-5 text-primary" />
                            <div>
                                <p className="font-medium text-sm">View Revenue</p>
                                <p className="text-xs text-muted-foreground">Platform fee tracking</p>
                            </div>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
