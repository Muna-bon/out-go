import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/outgo-logo.png";

const quickLinks = [
  { name: "Discover Activities", path: "/discover" },
  { name: "Browse Events", path: "/events" },
  { name: "Find Gyms", path: "/vendors" },
  { name: "Create Activity", path: "/create" },
  { name: "How It Works", path: "/how-it-works" },
];

const categoryLinks = [
  { name: "Walking & Jogging", path: "/category/walking-jogging" },
  { name: "Fitness & Workouts", path: "/category/fitness-workouts" },
  { name: "Hiking & Camping", path: "/category/hiking" },
  { name: "Wellness Programs", path: "/category/wellness-programs" },
  { name: "Group Exercises", path: "/category/gym-programs" },
  { name: "Sightseeing", path: "/category/sightseeing" },
];

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="container-app py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img src={logo} alt="OutGo" className="h-12 w-auto mb-4 brightness-0 invert" />
            <p className="text-background/60 text-sm leading-relaxed mb-6">
              Connect with others for wellness activities. Discover, organize, and participate in outdoor adventures near you.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-background font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-background/60 hover:text-primary transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-background font-semibold mb-4">Categories</h4>
            <ul className="space-y-3">
              {categoryLinks.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-background/60 hover:text-primary transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-background font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-background/60">123 Wellness Street, Active City, AC 12345</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-background/60">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-background/60">hello@outgo.app</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-background/50 text-sm">
            © 2026 OutGo. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-background/50 hover:text-background text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-background/50 hover:text-background text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
