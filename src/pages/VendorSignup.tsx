import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Building2, Upload, Check, ArrowRight, ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const steps = [
  { id: 1, title: "Business Info", description: "Basic details" },
  { id: 2, title: "Services", description: "What you offer" },
  { id: 3, title: "Verification", description: "Documents" },
  { id: 4, title: "Review", description: "Confirm details" },
];

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
  "Weight Training",
  "Cardio Equipment",
  "Group Classes",
  "Personal Training",
  "Yoga",
  "Pilates",
  "CrossFit",
  "HIIT",
  "Swimming",
  "Sauna / Steam",
  "Massage / Spa",
  "Nutrition Coaching",
];

const VendorSignup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    description: "",
    services: [] as string[],
    operatingHours: "",
    website: "",
    agreedToTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleService = (service: string) => {
    setFormData({
      ...formData,
      services: formData.services.includes(service)
        ? formData.services.filter((s) => s !== service)
        : [...formData.services, service],
    });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast.success("Application submitted successfully!", {
      description: "We'll review your application and get back to you within 2-3 business days.",
    });
    navigate("/vendor-dashboard");
  };

  return (
    <Layout>
      <section className="py-12 bg-muted/30 min-h-screen">
        <div className="container-app max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="w-16 h-16 gradient-bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Become a Partner</h1>
            <p className="text-muted-foreground">
              Join OutGo's network of fitness and wellness partners
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-10">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      currentStep >= step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                  </div>
                  <span className="text-xs mt-2 text-muted-foreground hidden sm:block">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 sm:w-20 h-1 mx-2 rounded ${
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form Steps */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card rounded-2xl p-6 md:p-10 shadow-card"
          >
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-6">Business Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="Your gym or studio name"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessType">Business Type *</Label>
                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select type</option>
                      {businessTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="email">Business Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="contact@yourbusiness.com"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="mt-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Business Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Fitness Street"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website (optional)</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://yourbusiness.com"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-6">Services & Programs</h2>
                <div>
                  <Label>Select Services You Offer *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                    {serviceOptions.map((service) => (
                      <button
                        key={service}
                        onClick={() => toggleService(service)}
                        className={`p-3 rounded-xl border text-sm font-medium transition-colors ${
                          formData.services.includes(service)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="operatingHours">Operating Hours *</Label>
                  <Input
                    id="operatingHours"
                    name="operatingHours"
                    value={formData.operatingHours}
                    onChange={handleInputChange}
                    placeholder="e.g., Mon-Fri: 5AM-11PM, Sat-Sun: 7AM-9PM"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Business Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell us about your business, facilities, and what makes you unique..."
                    className="mt-2 min-h-[120px]"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-6">Verification Documents</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Please upload the following documents to verify your business. This helps us maintain quality and trust on our platform.
                </p>
                
                {["Business License", "Insurance Certificate", "Facility Photos"].map((doc) => (
                  <div key={doc} className="border border-dashed border-border rounded-xl p-6 hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{doc}</p>
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-6">Review Your Application</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Business Info</h3>
                    <p className="font-semibold">{formData.businessName || "Not provided"}</p>
                    <p className="text-sm text-muted-foreground">{formData.businessType}</p>
                    <p className="text-sm text-muted-foreground">{formData.address}, {formData.city}</p>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Contact</h3>
                    <p className="text-sm">{formData.email}</p>
                    <p className="text-sm">{formData.phone}</p>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Services</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.services.map((service) => (
                        <span key={service} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-4">
                  <Checkbox
                    id="terms"
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, agreedToTerms: checked as boolean })
                    }
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    I agree to the Partner Terms of Service and confirm that all information provided is accurate. I understand that OutGo will review my application and may contact me for additional information.
                  </Label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              {currentStep < 4 ? (
                <Button onClick={handleNext} className="gap-2">
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.agreedToTerms}
                  className="gap-2"
                >
                  Submit Application
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default VendorSignup;
