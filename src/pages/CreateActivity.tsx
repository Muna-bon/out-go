import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, Clock, MapPin, Users, ImagePlus, ArrowLeft, ArrowRight, DollarSign, Info, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { createEvent } from "@/lib/api";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const categories = [
  "Walking & Jogging",
  "Fitness & Workouts",
  "Hiking & Camping",
  "Sightseeing & Leisure",
  "Wellness Programs",
  "Gym Programs",
  "Group Exercises",
];

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  activityType: z.enum(["informal", "structured"]),
  location: z.string().min(3, "Please enter a location"),
  date: z.string().min(1, "Please select a start date"),
  endDate: z.string().min(1, "Please select an end date"),
  time: z.string().min(1, "Please select a time"),
  duration: z.string().min(1, "Please select duration"),
  maxParticipants: z.string().optional(),
  price: z.string().optional(),
  isRecurring: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

const PLATFORM_FEE_PERCENT = 2;
const FEATURED_FEE_NGN = 1000;

const stepFields: Record<number, (keyof z.infer<typeof formSchema>)[]> = {
  1: ["title", "description", "category", "activityType"],
  2: ["location", "date", "endDate", "time", "duration"],
};

const CreateActivity = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      activityType: "informal",
      location: "",
      date: "",
      time: "",
      duration: "",
      maxParticipants: "",
      price: "",
      isRecurring: false,
      isFeatured: false,
      endDate: "",
    },
  });

  const handleNextStep = async () => {
    const fields = stepFields[step];
    if (fields) {
      const valid = await form.trigger(fields);
      if (!valid) return;
    }
    setStep(Math.min(3, step + 1));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await createEvent({
        title: values.title,
        description: values.description,
        category: values.category,
        location: values.location,
        date: values.date,
        end_date: values.endDate,
        time: values.time,
        capacity: values.maxParticipants ? parseInt(values.maxParticipants) : 0,
        price: values.price ? parseFloat(values.price) : 0,
        is_recurring: values.isRecurring,
        is_featured: values.isFeatured,
      });
      toast.success("Activity created successfully!");
      navigate("/my-created-events");
    } catch (error: any) {
      toast.error(error.message || "Failed to create activity");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[80vh] bg-muted/30 py-12 flex items-center justify-center">
          <div className="text-center bg-card p-12 rounded-2xl shadow-sm border border-border max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Sign in required</h2>
            <p className="text-muted-foreground mb-8">You need an account to create and manage activities. Please sign up or log in to continue.</p>
            <div className="flex flex-col gap-3">
              <Link to="/login">
                <Button className="w-full h-12">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" className="w-full h-12">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            {/* Header */}
            <div className="mb-8">
              <Link
                to="/discover"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Discover
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Create New Activity
              </h1>
              <p className="text-muted-foreground">
                Share an activity and invite others to join you
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 px-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${s <= step
                      ? "gradient-bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {s}
                  </div>
                  <span
                    className={`ml-3 hidden sm:block ${s <= step ? "text-foreground" : "text-muted-foreground"
                      }`}
                  >
                    {s === 1 ? "Basic Info" : s === 2 ? "Details" : "Review"}
                  </span>
                  {s < 3 && (
                    <div
                      className={`w-16 lg:w-24 h-1 mx-4 rounded-full ${s < step ? "bg-primary" : "bg-muted"
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="card-elevated p-6 md:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Activity Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Morning Jog at the Park"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your activity, what to expect, and any requirements..."
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((cat) => (
                                  <SelectItem key={cat} value={cat}>
                                    {cat}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="activityType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Activity Type</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-2 gap-4"
                              >
                                <Label
                                  htmlFor="informal"
                                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 cursor-pointer transition-colors ${field.value === "informal"
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                    }`}
                                >
                                  <RadioGroupItem
                                    value="informal"
                                    id="informal"
                                    className="sr-only"
                                  />
                                  <Users className="h-6 w-6" />
                                  <span className="font-medium">Informal</span>
                                  <span className="text-xs text-muted-foreground text-center">
                                    Casual activity with friends
                                  </span>
                                </Label>
                                <Label
                                  htmlFor="structured"
                                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 cursor-pointer transition-colors ${field.value === "structured"
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                    }`}
                                >
                                  <RadioGroupItem
                                    value="structured"
                                    id="structured"
                                    className="sr-only"
                                  />
                                  <Calendar className="h-6 w-6" />
                                  <span className="font-medium">Structured</span>
                                  <span className="text-xs text-muted-foreground text-center">
                                    Organized event or program
                                  </span>
                                </Label>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                  className="pl-10"
                                  placeholder="Enter address or location name"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="60">1 hour</SelectItem>
                                <SelectItem value="90">1.5 hours</SelectItem>
                                <SelectItem value="120">2 hours</SelectItem>
                                <SelectItem value="180">3 hours</SelectItem>
                                <SelectItem value="240">4+ hours</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maxParticipants"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Participants (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Leave empty for unlimited"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Set a limit for how many people can join
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isRecurring"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Recurring Activity</FormLabel>
                              <FormDescription>
                                This activity repeats on a regular schedule
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      {/* Pricing */}
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (Optional)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="pl-10"
                                  placeholder="0.00 (free)"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Leave empty or 0 for free activities
                            </FormDescription>
                            {field.value && parseFloat(field.value) > 0 && (
                              <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-lg mt-2">
                                <Info className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                                  A {PLATFORM_FEE_PERCENT}% platform fee (${(parseFloat(field.value) * PLATFORM_FEE_PERCENT / 100).toFixed(2)}) will be charged per registration. Users will pay ${field.value}.
                                </p>
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Image Upload */}
                      <div>
                        <Label>Cover Image (Optional)</Label>
                        <div className="mt-2 border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                          <ImagePlus className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                          <p className="text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG up to 5MB
                          </p>
                        </div>
                      </div>

                      {/* Featured Event */}
                      <FormField
                        control={form.control}
                        name="isFeatured"
                        render={({ field }) => (
                          <FormItem className="rounded-xl border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10 p-4">
                            <div className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none flex-1">
                                <FormLabel className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  Feature This Event
                                </FormLabel>
                                <FormDescription>
                                  Get priority placement on the homepage and search results for ₦1,000 per week. Your event will stand out with a featured badge.
                                </FormDescription>
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="bg-muted/50 rounded-xl p-6">
                        <h3 className="font-semibold text-lg mb-4">
                          Review Your Activity
                        </h3>
                        <dl className="space-y-4">
                          <div>
                            <dt className="text-sm text-muted-foreground">Title</dt>
                            <dd className="font-medium">
                              {form.getValues("title") || "Not specified"}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">
                              Description
                            </dt>
                            <dd>{form.getValues("description") || "Not specified"}</dd>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <dt className="text-sm text-muted-foreground">
                                Category
                              </dt>
                              <dd className="font-medium">
                                {form.getValues("category") || "Not specified"}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm text-muted-foreground">Type</dt>
                              <dd className="font-medium capitalize">
                                {form.getValues("activityType")}
                              </dd>
                            </div>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">
                              Location
                            </dt>
                            <dd className="font-medium">
                              {form.getValues("location") || "Not specified"}
                            </dd>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <dt className="text-sm text-muted-foreground">Date</dt>
                              <dd className="font-medium">
                                {form.getValues("date") || "Not specified"}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm text-muted-foreground">Time</dt>
                              <dd className="font-medium">
                                {form.getValues("time") || "Not specified"}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm text-muted-foreground">
                                Duration
                              </dt>
                              <dd className="font-medium">
                                {form.getValues("duration")
                                  ? `${form.getValues("duration")} min`
                                  : "Not specified"}
                            </dd>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <dt className="text-sm text-muted-foreground">Price</dt>
                            <dd className="font-medium">
                                {form.getValues("price") && parseFloat(form.getValues("price") || "0") > 0
                                  ? `$${form.getValues("price")}`
                                  : "Free"}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm text-muted-foreground">Platform Fee (2%)</dt>
                              <dd className="font-medium text-emerald-600">
                                {form.getValues("price") && parseFloat(form.getValues("price") || "0") > 0
                                  ? `$${(parseFloat(form.getValues("price") || "0") * PLATFORM_FEE_PERCENT / 100).toFixed(2)} per registration`
                                  : "No fee"}
                              </dd>
                            </div>
                          </div>
                        </dl>
                      </div>

                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                        <p className="text-sm">
                          By creating this activity, you agree to our community
                          guidelines and terms of service.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between pt-6 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(Math.max(1, step - 1))}
                      disabled={step === 1}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    {step < 3 ? (
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        className="gap-2"
                      >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button type="submit" className="gap-2" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Activity"}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateActivity;
