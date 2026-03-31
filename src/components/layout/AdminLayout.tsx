import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Building2,
    Users,
    Calendar,
    Settings,
    LogOut,
    ChevronLeft,
    Bell,
    Shield,
    DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/vendors", label: "Vendors & Gyms", icon: Building2 },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/events", label: "Events", icon: Calendar },
    { path: "/admin/revenue", label: "Revenue", icon: DollarSign },
    { path: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-muted/30 flex">
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border">
                <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center">
                            <Shield className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">OwtGo Admin</h2>
                            <p className="text-xs text-muted-foreground">Control Panel</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-border space-y-2">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        Back to App
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors w-full"
                    >
                        <LogOut className="h-5 w-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
                    <div className="lg:hidden flex items-center gap-3">
                        <Link to="/admin" className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <span className="font-bold">Admin</span>
                        </Link>
                    </div>
                    {/* Mobile nav */}
                    <div className="lg:hidden flex items-center gap-2 overflow-x-auto">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted"
                                        }`}
                                >
                                    <item.icon className="h-3.5 w-3.5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                    <div className="hidden lg:flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                            Logged in as <span className="font-medium text-foreground">{user?.name || "Admin"}</span>
                        </span>
                        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
                            <Bell className="h-5 w-5" />
                        </Button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
