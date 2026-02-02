import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Users,
  Calendar,
  Settings,
  Plus,
  TrendingUp,
  Clock,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Bell,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import gymImage from "@/assets/activity-gym.jpg";
import yogaImage from "@/assets/activity-yoga.jpg";

const stats = [
  { label: "Total Members", value: "1,234", change: "+12%", icon: Users, color: "text-primary" },
  { label: "Active Programs", value: "24", change: "+3", icon: Calendar, color: "text-accent" },
  { label: "Monthly Views", value: "8.5K", change: "+24%", icon: Eye, color: "text-green-500" },
  { label: "Rating", value: "4.8", change: "+0.2", icon: TrendingUp, color: "text-yellow-500" },
];

const programs = [
  {
    id: "1",
    title: "Morning HIIT Class",
    image: gymImage,
    schedule: "Mon, Wed, Fri - 6:00 AM",
    enrolled: 18,
    capacity: 25,
    status: "active",
  },
  {
    id: "2",
    title: "Evening Yoga Flow",
    image: yogaImage,
    schedule: "Tue, Thu - 6:30 PM",
    enrolled: 22,
    capacity: 20,
    status: "full",
  },
  {
    id: "3",
    title: "Strength Training 101",
    image: gymImage,
    schedule: "Mon, Wed - 5:00 PM",
    enrolled: 12,
    capacity: 15,
    status: "active",
  },
];

const recentRegistrations = [
  { name: "Sarah M.", program: "Morning HIIT Class", time: "2 hours ago" },
  { name: "John D.", program: "Evening Yoga Flow", time: "5 hours ago" },
  { name: "Emily R.", program: "Strength Training 101", time: "1 day ago" },
  { name: "Mike T.", program: "Morning HIIT Class", time: "1 day ago" },
];

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleDeleteProgram = (id: string) => {
    toast.success("Program deleted successfully");
  };

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
              <p className="text-muted-foreground">Welcome back, FitLife Gym</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </Button>
              <Link to="/vendor-settings">
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </Link>
              <Link to="/create">
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Program
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
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
                      <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
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
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Registrations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentRegistrations.map((reg, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="font-semibold text-primary">
                                  {reg.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{reg.name}</p>
                                <p className="text-sm text-muted-foreground">{reg.program}</p>
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">{reg.time}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>This Week</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">New Members</span>
                      <span className="font-semibold">+28</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Classes Held</span>
                      <span className="font-semibold">42</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Attendance</span>
                      <span className="font-semibold">512</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Avg. Rating</span>
                      <span className="font-semibold">4.9 ⭐</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="programs">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Your Programs</CardTitle>
                  <Link to="/create">
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Program
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {programs.map((program) => (
                      <div
                        key={program.id}
                        className="flex items-center gap-4 p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors"
                      >
                        <img
                          src={program.image}
                          alt={program.title}
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{program.title}</h3>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                program.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {program.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {program.schedule}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {program.enrolled}/{program.capacity}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProgram(program.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members">
              <Card>
                <CardHeader>
                  <CardTitle>Member Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-10">
                    Member management features coming soon. You'll be able to view, manage, and communicate with all your members here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics & Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Detailed analytics and insights coming soon. Track your program performance, member engagement, and revenue.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default VendorDashboard;
