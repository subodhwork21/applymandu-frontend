"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Upload, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import UpgradePlanModal from "@/components/upgrade-plan-modal";

const SettingsPage = () => {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      companyName: "TechCorp Solutions",
      industry: "technology",
      companySize: "51-200",
      foundedYear: "2020",
      description: "",
      address: "",
      email: "",
      phone: "",
      website: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-6">Company Details</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" {...register("companyName")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select defaultValue="technology">
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">
                          Information Technology
                        </SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company Size</Label>
                    <Select defaultValue="51-200">
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-50">1-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">
                          201-500 employees
                        </SelectItem>
                        <SelectItem value="500+">500+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="foundedYear">Founded Year</Label>
                    <Input
                      id="foundedYear"
                      type="number"
                      {...register("foundedYear")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    {...register("description")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Company Address</Label>
                  <Input id="address" {...register("address")} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Contact Email</Label>
                    <Input id="email" type="email" {...register("email")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact Phone</Label>
                    <Input id="phone" type="tel" {...register("phone")} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Company Website</Label>
                  <Input id="website" type="url" {...register("website")} />
                </div>

                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-neutral-400" />
                    </div>
                    <Button type="button" variant="outline" className="h-10">
                      <Upload className="h-4 w-4 mr-2" />
                      Change Logo
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" disabled={!isDirty}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isDirty}
                    className="bg-black text-white hover:bg-neutral-800"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Account Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="2fa" className="cursor-pointer">
                    Two-Factor Authentication
                  </Label>
                  <Switch id="2fa" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications" className="cursor-pointer">
                    Email Notifications
                  </Label>
                  <Switch id="notifications" defaultChecked />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Subscription</h2>
              <div className="space-y-2">
                <p className="text-sm">
                  Current Plan: <span className="font-medium">Premium</span>
                </p>
                <p className="text-sm text-neutral-600">
                  Valid until: Apr 22, 2025
                </p>
                <Button
                  className="w-full mt-4 bg-black text-white hover:bg-neutral-800"
                  onClick={() => setIsUpgradeModalOpen(true)}
                >
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UpgradePlanModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </section>
  );
};

export default SettingsPage;
