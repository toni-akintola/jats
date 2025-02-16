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

const formSchema = z.object({
  name: z.string().min(2),
  title: z.string().min(2),
  company: z.string().min(2),
  location: z.string().min(2),
  experience: z.string(),
  specialization: z.string(),
  investmentThesis: z.string().min(10),
  riskProfile: z.enum(["Conservative", "Moderate", "Aggressive"]),
  propertyTypes: z.string(),
  marketTypes: z.string(),
  dealSizeMin: z.string(),
  dealSizeMax: z.string(),
  developmentTypes: z.string(),
  exitStrategy: z.string(),
  preferredStructure: z.string(),
  sustainabilityFocus: z.boolean(),
});

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      title: "",
      company: "",
      location: "",
      experience: "",
      specialization: "",
      investmentThesis: "",
      riskProfile: "Moderate",
      propertyTypes: "",
      marketTypes: "",
      dealSizeMin: "",
      dealSizeMax: "",
      developmentTypes: "",
      exitStrategy: "",
      preferredStructure: "",
      sustainabilityFocus: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Card className="bg-white/5 border-white/10 text-white">
      <CardHeader>
        <CardTitle>Developer Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              Save Preferences
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
