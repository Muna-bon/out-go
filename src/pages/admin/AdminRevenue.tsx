import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Calendar, Users, Percent, ArrowLeftRight } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const PLATFORM_FEE_PERCENT = 2;
const FEATURED_FEE_NGN = 1000; // per week
const NGN_TO_USD = 0.00065; // approximate

const AdminRevenue = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [vendors, setVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");

    useEffect(() => {
        const load = async () => {
            try {
                // Try RPC for events (bypasses RLS)
                const { data: rpcEvents, error: rpcErr } = await supabase.rpc("admin_get_all_events");
                const { data: rpcVendors, error: vendorErr } = await supabase.rpc("admin_get_all_vendors");
                
                if (!rpcErr && rpcEvents) {
                    setEvents(rpcEvents || []);
                } else {
                    const { data } = await supabase.from("events").select("*, created_by(name)").order("created_at", { ascending: false });
                    setEvents(data || []);
                }
                
                if (!vendorErr && rpcVendors) {
                    setVendors((rpcVendors || []).filter((v: any) => v.status === "active"));
                } else {
                    const { data } = await supabase.from("vendors").select("*").eq("status", "active");
                    setVendors(data || []);
                }
            } catch {
                // ignore
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const formatCurrency = (amountNGN: number) => {
        if (currency === "USD") {
            return `$${(amountNGN * NGN_TO_USD).toFixed(2)}`;
        }
        return `₦${amountNGN.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
    };

    const currencySymbol = currency === "NGN" ? "₦" : "$";
    const convertAmount = (amountNGN: number) => currency === "USD" ? amountNGN * NGN_TO_USD : amountNGN;

    const paidEvents = events.filter((e) => e.price && e.price > 0);
    const totalGrossRevenue = paidEvents.reduce((sum, e) => sum + ((e.price || 0) * (e.registered || 0)), 0);
    const totalPlatformFee = totalGrossRevenue * PLATFORM_FEE_PERCENT / 100;
    const featuredEvents = events.filter((e) => e.is_featured);
    const totalFeaturedRevenue = featuredEvents.length * FEATURED_FEE_NGN;
    const totalRegistrations = paidEvents.reduce((sum, e) => sum + (e.registered || 0), 0);
    const totalRevenue = totalPlatformFee + totalFeaturedRevenue;

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Revenue</h1>
                        <p className="text-muted-foreground mt-1">Platform fee tracking and revenue overview</p>
                    </div>
                    <Button
                        variant="outline"
                        className="gap-2 self-start"
                        onClick={() => setCurrency(currency === "NGN" ? "USD" : "NGN")}
                    >
                        <ArrowLeftRight className="h-4 w-4" />
                        {currency === "NGN" ? "Switch to USD ($)" : "Switch to NGN (₦)"}
                    </Button>
                </div>

                {/* Revenue Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, color: "text-emerald-500 bg-emerald-500/10", sub: "Platform fees + featured" },
                        { label: `Platform Fees (${PLATFORM_FEE_PERCENT}%)`, value: formatCurrency(totalPlatformFee), icon: TrendingUp, color: "text-blue-500 bg-blue-500/10", sub: `${PLATFORM_FEE_PERCENT}% of paid registrations` },
                        { label: "Featured Events Revenue", value: formatCurrency(totalFeaturedRevenue), icon: Calendar, color: "text-yellow-500 bg-yellow-500/10", sub: `${featuredEvents.length} featured × ${formatCurrency(FEATURED_FEE_NGN)}/wk` },
                        { label: "Paid Registrations", value: totalRegistrations.toString(), icon: Users, color: "text-purple-500 bg-purple-500/10", sub: `Across ${paidEvents.length} paid events` },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card>
                                <CardContent className="p-6">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                    <p className="text-3xl font-bold">{loading ? "..." : stat.value}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Platform Fee Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Percent className="h-5 w-5 text-primary" />
                            Fee Structure
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
                                    <div>
                                        <p className="font-semibold">Platform Transaction Fee</p>
                                        <p className="text-sm text-muted-foreground">Per paid registration</p>
                                    </div>
                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-lg px-4 py-1">2%</Badge>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
                                    <div>
                                        <p className="font-semibold">Featured Event Fee</p>
                                        <p className="text-sm text-muted-foreground">Per week of featuring</p>
                                    </div>
                                    <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200 text-lg px-4 py-1">{formatCurrency(FEATURED_FEE_NGN)}/wk</Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Paid Events Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Paid Events Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {paidEvents.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-30" />
                                <p className="text-lg font-medium mb-1">No paid events yet</p>
                                <p className="text-sm">Revenue will appear here when events with pricing are created.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="grid grid-cols-5 gap-4 text-xs font-medium text-muted-foreground px-4 pb-2 border-b border-border">
                                    <span className="col-span-2">Event</span>
                                    <span>Price</span>
                                    <span>Registrations</span>
                                    <span>Platform Fee (2%)</span>
                                </div>
                                {paidEvents.map((event) => {
                                    const fee = event.price * (event.registered || 0) * PLATFORM_FEE_PERCENT / 100;
                                    return (
                                        <div key={event.id} className="grid grid-cols-5 gap-4 items-center px-4 py-3 bg-muted/30 rounded-lg text-sm">
                                            <div className="col-span-2">
                                                <p className="font-medium truncate">{event.title}</p>
                                                <p className="text-xs text-muted-foreground">{event.created_by?.name || "Unknown"}</p>
                                            </div>
                                            <p className="font-medium">{formatCurrency(event.price)}</p>
                                            <p>{event.registered || 0}</p>
                                            <p className="font-semibold text-emerald-600">{formatCurrency(fee)}</p>
                                        </div>
                                    );
                                })}
                                <div className="grid grid-cols-5 gap-4 items-center px-4 py-3 bg-primary/5 rounded-lg text-sm font-semibold border border-primary/20">
                                    <div className="col-span-2">Total</div>
                                    <div></div>
                                    <div>{totalRegistrations}</div>
                                    <div className="text-emerald-600">{formatCurrency(totalPlatformFee)}</div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminRevenue;
