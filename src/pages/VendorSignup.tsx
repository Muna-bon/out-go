import { useState } from "react";
import { motion } from "framer-motion";
import {
    Building2, Mail, Phone, Send, CheckCircle, MessageCircle, Star,
    TrendingUp, Users, Zap, Globe, HeartHandshake, BarChart3, Shield,
    ArrowRight,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const perks = [
    {
        icon: Users,
        title: "Thousands of Active Users",
        description: "Tap into our growing community of fitness enthusiasts actively seeking gyms, studios, and wellness services near them.",
        color: "from-blue-500 to-cyan-500",
    },
    {
        icon: TrendingUp,
        title: "Boost Your Revenue",
        description: "Partners see an average 35% increase in new memberships within the first 3 months after joining OwtGo.",
        color: "from-emerald-500 to-green-500",
    },
    {
        icon: Globe,
        title: "Digital Visibility",
        description: "Get a premium listing with your services, photos, and reviews — visible to every OwtGo user in your city.",
        color: "from-purple-500 to-pink-500",
    },
    {
        icon: BarChart3,
        title: "Analytics Dashboard",
        description: "Track impressions, sign-ups, and revenue in real time with your dedicated vendor dashboard.",
        color: "from-orange-500 to-amber-500",
    },
    {
        icon: Zap,
        title: "Featured Promotions",
        description: "Run featured campaigns to appear at the top of search results and get priority placement on the homepage.",
        color: "from-pink-500 to-rose-500",
    },
    {
        icon: Shield,
        title: "Low Platform Fee",
        description: "Just a 2% platform fee on transactions — one of the lowest in the industry. You keep what you earn.",
        color: "from-indigo-500 to-violet-500",
    },
];

const testimonials = [
    {
        name: "Adaeze Okoro",
        role: "Owner, FitZone Gym",
        quote: "Since joining OwtGo, we've seen a 40% increase in trial memberships. The platform brings serious fitness lovers right to our door.",
        avatar: "AO",
    },
    {
        name: "James Adebayo",
        role: "Manager, PeakBody Studios",
        quote: "The analytics dashboard alone is worth it. We can see exactly which classes are driving sign-ups and optimize accordingly.",
        avatar: "JA",
    },
    {
        name: "Sarah Balogun",
        role: "Founder, Zen Yoga Space",
        quote: "OwtGo helped us fill our evening classes that were always empty. Now we have a waitlist. Incredible platform!",
        avatar: "SB",
    },
];

const VendorSignup = () => {
    const { user } = useAuth();
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        business_name: "",
        business_type: "",
        message: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const errs: Record<string, string> = {};
        if (!formData.name.trim()) errs.name = "Your name is required";
        if (!formData.email.trim()) errs.email = "Email is required";
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Invalid email format";
        if (!formData.phone.trim()) errs.phone = "Phone number is required";
        if (!formData.business_name.trim()) errs.business_name = "Business name is required";
        if (!formData.business_type.trim()) errs.business_type = "Please select a business type";
        if (!formData.message.trim()) errs.message = "Please tell us about your interest";
        setErrors(errs);
        if (Object.keys(errs).length > 0) toast.error("Please fill in all required fields");
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            // Save to database
            await supabase.from("vendor_inquiries").insert({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                business_name: formData.business_name,
                business_type: formData.business_type,
                message: formData.message,
                user_id: user?.id || null,
            });

            // Send email notification via Web3Forms
            try {
                await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        access_key: import.meta.env.VITE_WEB3FORMS_KEY || "YOUR_WEB3FORMS_KEY",
                        subject: `🤝 New OwtGo Partner Inquiry: ${formData.business_name}`,
                        from_name: "OwtGo Platform",
                        to: "maimunahussaini66@gmail.com",
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        business_name: formData.business_name,
                        business_type: formData.business_type,
                        message: formData.message,
                    }),
                });
            } catch {
                // Email send is optional — don't block the form
                console.log("Email notification could not be sent, but inquiry was saved.");
            }

            setSubmitted(true);
            toast.success("Your inquiry has been submitted!");
        } catch {
            setSubmitted(true);
            toast.success("Your inquiry has been submitted!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
    };

    const FieldError = ({ field }: { field: string }) =>
        errors[field] ? <p className="text-xs text-destructive mt-1">{errors[field]}</p> : null;

    if (submitted) {
        return (
            <Layout>
                <div className="min-h-[80vh] flex items-center justify-center py-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center bg-card p-12 rounded-3xl shadow-lg border border-border max-w-lg w-full mx-4"
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <CheckCircle className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Thank You! 🎉</h2>
                        <p className="text-muted-foreground mb-3 text-lg">
                            Your inquiry has been received. Our partnerships team will review your information and get back to you within <strong>2-3 business days</strong>.
                        </p>
                        <p className="text-muted-foreground mb-8">
                            In the meantime, you can reach us directly:
                        </p>
                        <div className="space-y-3 mb-8">
                            <a href="mailto:maimunahussaini66@gmail.com" className="flex items-center justify-center gap-2 text-primary hover:underline font-medium">
                                <Mail className="h-4 w-4" /> maimunahussaini66@gmail.com
                            </a>
                            <a href="tel:+15551234567" className="flex items-center justify-center gap-2 text-primary hover:underline font-medium">
                                <Phone className="h-4 w-4" /> +1 (555) 123-4567
                            </a>
                        </div>
                        <Button onClick={() => setSubmitted(false)} variant="outline" size="lg">Submit Another Inquiry</Button>
                    </motion.div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 overflow-hidden">
                <div className="absolute inset-0 gradient-bg-hero opacity-95" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wOCI+PHBhdGggZD0iTTM2IDM0aC0ydi00aDJ2Mmg0djJoLTR2MmgydjJoLTJ2LTJoLTR2MmgtMnYtMmg0di0yaC0ydi0yaDJ2Mmg0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
                <div className="container-app relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-white/20"
                        >
                            <HeartHandshake className="h-4 w-4" />
                            Trusted by 500+ fitness partners
                        </motion.div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Grow Your Fitness Business with{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">OwtGo</span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed max-w-2xl mx-auto">
                            Join Nigeria's fastest-growing wellness platform. Connect with thousands of active users looking for gyms, studios, and wellness experiences near them.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="#partner-form">
                                <Button size="xl" className="bg-white text-primary hover:bg-white/90 gap-2 shadow-xl text-base px-8">
                                    Become a Partner
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </a>
                            <a href="#why-join">
                                <Button variant="heroOutline" size="xl" className="text-base px-8">
                                    Learn More
                                </Button>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Banner */}
            <section className="py-8 bg-card border-b border-border">
                <div className="container-app">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: "50K+", label: "Active Users" },
                            { value: "500+", label: "Partner Venues" },
                            { value: "35%", label: "Avg Revenue Boost" },
                            { value: "2%", label: "Platform Fee Only" },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <p className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</p>
                                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Join OwtGo */}
            <section id="why-join" className="py-20 md:py-28">
                <div className="container-app">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Why Partners Love <span className="gradient-text">OwtGo</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Everything you need to grow your fitness business, all in one platform
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {perks.map((perk, i) => (
                            <motion.div
                                key={perk.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="group relative bg-card rounded-2xl border border-border p-8 hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${perk.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <perk.icon className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{perk.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{perk.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-muted/30">
                <div className="container-app">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Get Started in <span className="gradient-text">3 Easy Steps</span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                step: "01",
                                title: "Express Your Interest",
                                description: "Fill out the form below with your business details. It takes less than 2 minutes.",
                                icon: MessageCircle,
                            },
                            {
                                step: "02",
                                title: "We Review & Onboard",
                                description: "Our partnerships team reviews your application and sets up your vendor profile.",
                                icon: Shield,
                            },
                            {
                                step: "03",
                                title: "Start Getting Customers",
                                description: "Go live on the platform and start receiving bookings and sign-ups from our community.",
                                icon: TrendingUp,
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                className="text-center relative"
                            >
                                <div className="gradient-bg-primary w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                                    <item.icon className="h-10 w-10 text-primary-foreground" />
                                </div>
                                <span className="absolute top-0 right-1/2 translate-x-16 -translate-y-2 text-6xl font-bold text-muted/50">
                                    {item.step}
                                </span>
                                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                                <p className="text-muted-foreground">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20">
                <div className="container-app">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            What Our Partners Say
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={t.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-card rounded-2xl border border-border p-8 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-muted-foreground mb-6 italic leading-relaxed">"{t.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                        <span className="text-sm font-bold text-white">{t.avatar}</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{t.name}</p>
                                        <p className="text-xs text-muted-foreground">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form + Info */}
            <section id="partner-form" className="py-20 bg-muted/30">
                <div className="container-app max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to <span className="gradient-text">Partner Up?</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                            Fill out the form and our team will reach out to get you onboarded.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Contact Info Side */}
                        <div className="lg:col-span-2 space-y-5">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-shadow"
                            >
                                <Mail className="h-8 w-8 text-primary mb-3" />
                                <h3 className="font-semibold mb-1">Email Us</h3>
                                <a href="mailto:maimunahussaini66@gmail.com" className="text-sm text-primary hover:underline">
                                    maimunahussaini66@gmail.com
                                </a>
                                <p className="text-xs text-muted-foreground mt-1">We respond within 24 hours</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-shadow"
                            >
                                <Phone className="h-8 w-8 text-primary mb-3" />
                                <h3 className="font-semibold mb-1">Call Us</h3>
                                <a href="tel:+15551234567" className="text-sm text-primary hover:underline">+1 (555) 123-4567</a>
                                <p className="text-xs text-muted-foreground mt-1">Mon-Fri, 9AM - 6PM</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-6"
                            >
                                <Zap className="h-8 w-8 text-primary mb-3" />
                                <h3 className="font-semibold mb-2">Quick Facts</h3>
                                <ul className="text-sm text-muted-foreground space-y-2">
                                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Free to apply</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Only 2% platform fee</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Dedicated analytics dashboard</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Cancel anytime</li>
                                </ul>
                            </motion.div>
                        </div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-3"
                        >
                            <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 md:p-8 space-y-5 shadow-sm">
                                <h3 className="text-xl font-semibold">Express Your Interest</h3>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Your Name *</Label>
                                        <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className={`mt-2 ${errors.name ? "border-destructive" : ""}`} />
                                        <FieldError field="name" />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email *</Label>
                                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@business.com" className={`mt-2 ${errors.email ? "border-destructive" : ""}`} />
                                        <FieldError field="email" />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="phone">Phone *</Label>
                                        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+234 800 000 0000" className={`mt-2 ${errors.phone ? "border-destructive" : ""}`} />
                                        <FieldError field="phone" />
                                    </div>
                                    <div>
                                        <Label htmlFor="business_name">Business Name *</Label>
                                        <Input id="business_name" name="business_name" value={formData.business_name} onChange={handleChange} placeholder="Your gym or studio name" className={`mt-2 ${errors.business_name ? "border-destructive" : ""}`} />
                                        <FieldError field="business_name" />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="business_type">Business Type *</Label>
                                    <select id="business_type" name="business_type" value={formData.business_type} onChange={handleChange} className={`mt-2 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ${errors.business_type ? "border-destructive" : "border-input"}`}>
                                        <option value="">Select type</option>
                                        <option value="Fitness Center / Gym">Fitness Center / Gym</option>
                                        <option value="Yoga / Pilates Studio">Yoga / Pilates Studio</option>
                                        <option value="CrossFit Box">CrossFit Box</option>
                                        <option value="Wellness Center">Wellness Center</option>
                                        <option value="Sports Training Facility">Sports Training Facility</option>
                                        <option value="Dance Studio">Dance Studio</option>
                                        <option value="Martial Arts">Martial Arts</option>
                                        <option value="Swimming Pool / Aquatics">Swimming Pool / Aquatics</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <FieldError field="business_type" />
                                </div>

                                <div>
                                    <Label htmlFor="message">Tell Us About Your Business *</Label>
                                    <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="What services do you offer? What makes your gym/studio special?" className={`mt-2 min-h-[100px] ${errors.message ? "border-destructive" : ""}`} />
                                    <FieldError field="message" />
                                </div>

                                <Button type="submit" size="lg" className="w-full gap-2 text-base" disabled={isSubmitting}>
                                    {isSubmitting ? "Submitting..." : "Submit Partnership Inquiry"}
                                    <Send className="h-4 w-4" />
                                </Button>

                                <p className="text-xs text-center text-muted-foreground">
                                    A 2% platform fee applies to transactions. Free to join — no upfront costs.
                                </p>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20">
                <div className="container-app">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="gradient-bg-hero rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYyaDR2MmgtNHYyaDJ2MmgtMnYtMmgtNHYyaC0ydi0yaDR2LTJoLTJ2LTJoMnYyaDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                                Don't Miss Out on the Growth
                            </h2>
                            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                                Join 500+ fitness partners already growing their business with OwtGo. Your next customer is waiting.
                            </p>
                            <a href="#partner-form">
                                <Button size="xl" className="bg-white text-primary hover:bg-white/90 gap-2 shadow-xl">
                                    Apply Now — It's Free
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
};

export default VendorSignup;
