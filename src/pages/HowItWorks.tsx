import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MapPin,
  Users,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Shield,
  Star,
  MessageCircle,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: MapPin,
    title: "Discover Activities Near You",
    description:
      "Browse through a wide variety of wellness activities happening in your area. Filter by category, date, time, and skill level to find the perfect match for your interests.",
  },
  {
    number: "02",
    icon: Users,
    title: "Connect with Like-Minded People",
    description:
      "Join activities organized by others or create your own events to invite participants. Build meaningful connections with people who share your passion for wellness.",
  },
  {
    number: "03",
    icon: Calendar,
    title: "Register & Confirm",
    description:
      "Sign up for activities with just a few clicks. Receive confirmations, reminders, and updates directly to your dashboard and email.",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Show Up & Enjoy",
    description:
      "Meet at the designated location, participate in the activity, and enjoy the experience. Rate and review activities to help the community.",
  },
];

const features = [
  {
    icon: Shield,
    title: "Verified Organizers",
    description: "All activity organizers and partner gyms are verified for your safety and peace of mind.",
  },
  {
    icon: Star,
    title: "Quality Experiences",
    description: "Activities are rated by participants, ensuring you always find high-quality experiences.",
  },
  {
    icon: MessageCircle,
    title: "Easy Communication",
    description: "Message organizers and participants directly to coordinate and stay connected.",
  },
];

const HowItWorks = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 bg-muted/30">
        <div className="container-app text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How OwtGo Works
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Getting started with OwtGo is simple. Follow these four easy steps
              to discover activities, connect with others, and embrace a healthier
              lifestyle.
            </p>
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="container-app">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-10`}
              >
                <div className="flex-1">
                  <span className="text-6xl font-bold text-muted/50">{step.number}</span>
                  <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4">
                    {step.title}
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="w-40 h-40 rounded-3xl gradient-bg-primary flex items-center justify-center shadow-glow">
                    <step.icon className="h-20 w-20 text-primary-foreground" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose OwtGo?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're committed to providing a safe, reliable, and enjoyable
              experience for our community.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-8 rounded-2xl text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-bg-hero rounded-3xl p-10 md:p-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of people who are already connecting, moving, and
              living healthier lives with OwtGo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button
                  size="xl"
                  className="bg-background text-primary hover:bg-background/90 gap-2"
                >
                  Create Free Account
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/discover">
                <Button variant="heroOutline" size="xl">
                  Browse Activities
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default HowItWorks;
