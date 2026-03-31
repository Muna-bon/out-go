import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Search, Shield, User, Mail, MapPin, Calendar } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const AdminUsers = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [showRoleDialog, setShowRoleDialog] = useState(false);
    const [newRole, setNewRole] = useState("");

    const [dbError, setDbError] = useState<string | null>(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                // Try RPC first (bypasses RLS)
                const { data: rpcData, error: rpcError } = await supabase.rpc("admin_get_all_profiles");
                
                if (!rpcError && rpcData && rpcData.length > 0) {
                    setUsers(rpcData);
                    setDbError(null);
                    return;
                }
                
                // Fallback: direct query
                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .order("created_at", { ascending: false });
                
                if (error) {
                    console.error("Admin Users query error:", error);
                    setDbError(`Database error: ${error.message} (Code: ${error.code}). You need to run the admin SQL functions in Supabase SQL Editor.`);
                } else if (!data || data.length === 0) {
                    // Try to check if it's an RLS issue by getting count
                    setDbError("No profiles returned. This is likely an RLS (Row Level Security) issue. Please run the admin SQL functions in Supabase SQL Editor to fix this.");
                } else {
                    setUsers(data);
                    setDbError(null);
                }
            } catch (err: any) {
                console.error("Admin Users load error:", err);
                setDbError(`Unexpected error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    const handleRoleChange = async () => {
        if (!selectedUser || !newRole) return;
        try {
            const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", selectedUser.id);
            if (error) throw error;
            setUsers(users.map((u) => u.id === selectedUser.id ? { ...u, role: newRole } : u));
            toast.success(`Role updated to ${newRole}`);
            setShowRoleDialog(false);
        } catch (error: any) {
            toast.error(error.message || "Failed to update role");
        }
    };

    const filtered = users.filter((u) =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Users</h1>
                    <p className="text-muted-foreground mt-1">View and manage all registered users ({users.length} total)</p>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by name, email, or location..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>

                {dbError && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm">
                        <p className="font-semibold text-amber-800 dark:text-amber-200 mb-2">⚠️ Data Access Issue</p>
                        <p className="text-amber-700 dark:text-amber-300 mb-3">{dbError}</p>
                        <details className="cursor-pointer">
                            <summary className="font-medium text-amber-800 dark:text-amber-200">Click to see the SQL you need to run in Supabase</summary>
                            <pre className="mt-2 p-3 bg-gray-900 text-green-400 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap">{`-- Run this in Supabase → SQL Editor → New Query

-- Admin stats function
CREATE OR REPLACE FUNCTION admin_get_stats()
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE result json;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  SELECT json_build_object(
    'total_users', (SELECT count(*) FROM profiles),
    'total_events', (SELECT count(*) FROM events),
    'total_vendors', (SELECT count(*) FROM vendors),
    'active_vendors', (SELECT count(*) FROM vendors WHERE status = 'active'),
    'pending_vendors', (SELECT count(*) FROM vendors WHERE status = 'pending')
  ) INTO result;
  RETURN result;
END; $$;

-- Get all profiles
CREATE OR REPLACE FUNCTION admin_get_all_profiles()
RETURNS SETOF profiles LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  RETURN QUERY SELECT * FROM profiles ORDER BY created_at DESC;
END; $$;

-- Get all events
CREATE OR REPLACE FUNCTION admin_get_all_events()
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  RETURN (SELECT json_agg(row_to_json(t)) FROM (
    SELECT e.*, json_build_object('name', p.name, 'email', p.email) as created_by
    FROM events e LEFT JOIN profiles p ON e.created_by = p.id
    ORDER BY e.created_at DESC) t);
END; $$;

-- Get all vendors
CREATE OR REPLACE FUNCTION admin_get_all_vendors()
RETURNS SETOF vendors LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  RETURN QUERY SELECT * FROM vendors ORDER BY created_at DESC;
END; $$;

-- New event columns
ALTER TABLE events ADD COLUMN IF NOT EXISTS end_date date;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_recurring boolean DEFAULT false;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;`}</pre>
                        </details>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20 text-muted-foreground">Loading users...</div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((user, i) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.02 }}
                            >
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                                    ) : (
                                                        <span className="font-bold text-primary">{(user.name || "U").charAt(0).toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold truncate">{user.name || "Unnamed"}</p>
                                                        {user.role === "admin" && (
                                                            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">Admin</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {user.email} {user.location ? `• ${user.location}` : ""}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <Button size="sm" variant="ghost" onClick={() => { setSelectedUser(user); setShowDetailDialog(true); }}>
                                                    View
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => { setSelectedUser(user); setNewRole(user.role || "user"); setShowRoleDialog(true); }}>
                                                    <Shield className="h-3.5 w-3.5 mr-1" />
                                                    Role
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                        {filtered.length === 0 && (
                            <div className="text-center py-16 text-muted-foreground">
                                <Users className="h-12 w-12 mx-auto mb-4" />
                                <p>No users found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* User Detail Dialog */}
            <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                                    {selectedUser.avatar_url ? (
                                        <img src={selectedUser.avatar_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                        <span className="text-2xl font-bold text-primary">{(selectedUser.name || "U").charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{selectedUser.name || "Unnamed"}</h3>
                                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{selectedUser.location || "No location"}</span></div>
                                <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-muted-foreground" /><span className="capitalize">{selectedUser.role || "user"}</span></div>
                                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><span>Joined {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : "—"}</span></div>
                            </div>
                            {selectedUser.bio && <div><p className="text-sm text-muted-foreground">Bio</p><p className="text-sm">{selectedUser.bio}</p></div>}
                            {selectedUser.interests && selectedUser.interests.length > 0 && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Interests</p>
                                    <div className="flex flex-wrap gap-2">{selectedUser.interests.map((i: string) => <Badge key={i} variant="secondary">{i}</Badge>)}</div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Role Change Dialog */}
            <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Change User Role</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">Change role for <strong>{selectedUser?.name}</strong></p>
                        <div>
                            <Label>Role</Label>
                            <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2">
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRoleDialog(false)}>Cancel</Button>
                        <Button onClick={handleRoleChange}>Save Role</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminUsers;
