"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  propertyTypeOptions,
  marketTypeOptions,
  developmentTypeOptions,
  exitStrategyOptions,
} from "@/types/profile";
import { useProfileStore } from "@/store/profile-store";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long",
  }),
  title: z.string().min(2, {
    message: "Title is required",
  }),
  company: z.string().min(2, {
    message: "Company name is required",
  }),
  location: z.string().min(2, {
    message: "Location is required",
  }),
  imageUrl: z.string().min(1, {
    message: "Profile image is required",
  }),
  experience: z.string().min(1, {
    message: "Years of experience is required",
  }),
  specialization: z.string().min(1, {
    message: "Please select at least one specialization",
  }),
  investmentThesis: z.string().min(10, {
    message: "Investment thesis must be at least 10 characters long",
  }),
  riskProfile: z.enum(["Conservative", "Moderate", "Aggressive"], {
    required_error: "Please select a risk profile",
  }),
  propertyTypes: z.string().min(1, {
    message: "Please select at least one property type",
  }),
  marketTypes: z.string().min(1, {
    message: "Please select at least one market type",
  }),
  dealSizeMin: z.string().min(1, {
    message: "Minimum deal size is required",
  }),
  dealSizeMax: z.string().min(1, {
    message: "Maximum deal size is required",
  }),
  developmentTypes: z.string().min(1, {
    message: "Please select at least one development type",
  }),
  exitStrategy: z.string().min(1, {
    message: "Please select an exit strategy",
  }),
  preferredStructure: z.string().min(1, {
    message: "Please select a preferred structure",
  }),
  sustainabilityFocus: z.boolean(),
});

export function ProfileForm() {
  const { profile, updateProfile } = useProfileStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile?.name || "",
      title: profile?.title || "",
      company: profile?.company || "",
      location: profile?.location || "",
      imageUrl: profile?.imageUrl || "",
      experience: profile?.experience?.toString() || "",
      specialization: profile?.specialization[0] || "",
      investmentThesis: profile?.investmentThesis || "",
      riskProfile: profile?.riskProfile || "Moderate",
      propertyTypes: profile?.investmentPreferences.propertyTypes[0] || "",
      marketTypes: profile?.investmentPreferences.marketTypes[0] || "",
      dealSizeMin:
        profile?.investmentPreferences.dealSize.min?.toString() || "",
      dealSizeMax:
        profile?.investmentPreferences.dealSize.max?.toString() || "",
      developmentTypes: profile?.developmentTypes[0] || "",
      exitStrategy: profile?.exitStrategy[0] || "",
      preferredStructure: profile?.preferredStructure[0] || "",
      sustainabilityFocus: profile?.sustainabilityFocus || false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    updateProfile({
      name: values.name,
      title: values.title,
      company: values.company,
      location: values.location,
      experience: parseInt(values.experience),
      specialization: [values.specialization],
      investmentThesis: values.investmentThesis,
      riskProfile: values.riskProfile as
        | "Conservative"
        | "Moderate"
        | "Aggressive",
      investmentPreferences: {
        propertyTypes: [values.propertyTypes],
        marketTypes: [values.marketTypes],
        dealSize: {
          min: parseInt(values.dealSizeMin),
          max: parseInt(values.dealSizeMax),
        },
        targetMarkets: profile?.investmentPreferences.targetMarkets || [],
      },
      developmentTypes: [values.developmentTypes],
      exitStrategy: [values.exitStrategy],
      preferredStructure: [values.preferredStructure],
      sustainabilityFocus: values.sustainabilityFocus,
    });
  }

  return (
    <Card className="bg-white/5 border-white/10 text-white">
      <CardHeader>
        <CardTitle>Developer Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white/80">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Developer"
                          {...field}
                          className="bg-white/5"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Principal Developer"
                          {...field}
                          className="bg-white/5"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Urban Development Partners"
                          {...field}
                          className="bg-white/5"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="San Francisco Bay Area"
                          {...field}
                          className="bg-white/5"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white/80">
                Experience & Expertise
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="15"
                          {...field}
                          className="bg-white/5"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Specialization</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white/5">
                            <SelectValue placeholder="Select specialization" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Urban Mixed-Use">
                            Urban Mixed-Use
                          </SelectItem>
                          <SelectItem value="Transit-Oriented Development">
                            Transit-Oriented Development
                          </SelectItem>
                          <SelectItem value="Affordable Housing">
                            Affordable Housing
                          </SelectItem>
                          <SelectItem value="Luxury Residential">
                            Luxury Residential
                          </SelectItem>
                          <SelectItem value="Commercial Office">
                            Commercial Office
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white/80">
                Investment Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="riskProfile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Profile</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white/5">
                            <SelectValue placeholder="Select risk profile" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Conservative">
                            Conservative
                          </SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Aggressive">Aggressive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredStructure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Structure</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white/5">
                            <SelectValue placeholder="Select structure" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Solo Development">
                            Solo Development
                          </SelectItem>
                          <SelectItem value="Joint Venture">
                            Joint Venture
                          </SelectItem>
                          <SelectItem value="Fund Investment">
                            Fund Investment
                          </SelectItem>
                          <SelectItem value="Public-Private Partnership">
                            Public-Private Partnership
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="propertyTypes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Types</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/5">
                          <SelectValue placeholder="Select property types" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {propertyTypeOptions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="marketTypes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Types</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/5">
                          <SelectValue placeholder="Select market types" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {marketTypeOptions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dealSizeMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Deal Size</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="$1,000,000"
                        {...field}
                        className="bg-white/5"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dealSizeMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Deal Size</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="$50,000,000"
                        {...field}
                        className="bg-white/5"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="investmentThesis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Thesis</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your investment strategy and goals..."
                      {...field}
                      className="bg-white/5 min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="developmentTypes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Development Types</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/5">
                          <SelectValue placeholder="Select development types" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {developmentTypeOptions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exitStrategy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exit Strategy</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/5">
                          <SelectValue placeholder="Select exit strategy" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {exitStrategyOptions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="sustainabilityFocus"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="w-4 h-4 rounded border-white/20 bg-white/5"
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Sustainability Focus</FormLabel>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Save Preferences
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
