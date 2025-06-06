"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Upload, Building2, Loader } from "lucide-react";
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
import useSWR from "swr";
import { baseFetcher, defaultFetcher } from "@/lib/fetcher";
import { toast } from "@/hooks/use-toast";
import { employerToken } from "@/lib/tokens";
import Image from "next/image";

// Define the types for our API response
interface EmployerProfile {
  id: number;
  user_id: number;
  address: string;
  website: string;
  logo: string;
  description: string;
  industry: string;
  size: string;
  founded_year: string;
  two_fa: number;
  notification: number;
  created_at: string;
  updated_at: string;
}

interface EmployerSettings {
  id: number;
  first_name: string | null;
  last_name: string | null;
  company_name: string;
  email: string;
  phone: string;
  image_path: string;
  profile: EmployerProfile;
}

interface ApiResponse {
  success: boolean;
  data: EmployerSettings;
}

const SettingsPage = () => {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = React.useState(false);
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
  const [logoFile, setLogoFile] = React.useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isDirty },
    reset,
  } = useForm({
    defaultValues: {
      companyName: "",
      industry: "",
      companySize: "",
      foundedYear: "",
      description: "",
      address: "",
      email: "",
      phone: "",
      website: "",
    },
  });

  // Fetch employer settings data
  const {
    data: settingsData,
    error,
    isLoading,
    mutate,
  } = useSWR<ApiResponse>("api/employer/settings/all", defaultFetcher);

  useEffect(() => {
    if (settingsData?.data) {
      const { company_name, email, phone, profile, image_path } =
        settingsData.data;

      // Set logo preview from existing data
      if (image_path) {
        setLogoPreview(image_path);
      }

      setValue("companyName", company_name || "");
      setValue("email", email || "");
      setValue("phone", phone || "");

      if (profile) {
        setValue("industry", profile.industry || "");
        setValue("companySize", profile.size || "");
        setValue("foundedYear", profile.founded_year || "");
        setValue("description", profile.description || "");
        setValue("address", profile.address || "");
        setValue("website", profile.website || "");
      }

      reset({
        companyName: company_name || "",
        email: email || "",
        phone: phone || "",
        industry: profile?.industry || "",
        companySize: profile?.size || "",
        foundedYear: profile?.founded_year || "",
        description: profile?.description || "",
        address: profile?.address || "",
        website: profile?.website || "",
      });
    }
  }, [settingsData, setValue, reset]);

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    formData.append("company_name", data.companyName);
    formData.append("size", data.companySize);
    formData.append("industry", data.industry);
    formData.append("address", data.address);
    formData.append("website", data.website);
    formData.append("founded_year", data.foundedYear.toString());
    formData.append("description", data.description);
    formData.append("email", data.email);
    formData.append("phone", data.phone);

    if (logoFile) {
      formData.append("logo", logoFile);
    } else if (
      logoPreview &&
      !logoPreview.startsWith("data:") &&
      !logoPreview.startsWith("http")
    ) {
      // If logoPreview is a file path (not a data URL or http URL), append it
      formData.append("logo", logoPreview);
    }

    try {
      const { response, errors, result } = await baseFetcher(
        "api/employer/update-settings",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${employerToken()}`,
          },
        }
      );

      if (response?.ok) {
        toast({
          title: "Settings updated successfully",
          description: "Your settings have been updated successfully.",
        });
        mutate();
        reset(data);
      } else {
        toast({
          title: "Error updating settings",
          description: errors || result?.message,
        });
      }
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">
          Error loading settings. Please try again later.
        </p>
      </div>
    );
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);

      // Create a URL for the file preview
      const objectUrl = URL.createObjectURL(file);
      setLogoPreview(objectUrl);

      // Clean up the URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  // Update the function to correctly handle the Switch component's onChange event
  const handleTwoFactorAuth = async (checked: boolean) => {
    try {
      const { response, result, errors } = await baseFetcher(
        "api/employer/2fa/update",
        {
          method: "POST",
          body: JSON.stringify({ "2fa": checked ? 1 : 0 }),
        }
      );

      if (response?.ok) {
        toast({
          title: "Two Factor Authentication updated",
          description: result?.message,
        });
      } else {
        toast({
          title: "Error updating two factor authentication",
          description: errors || result?.message,
        });
      }
    } catch (error) {
      toast({
        title: "Error updating two factor authentication",
        description: "An unexpected error occurred",
      });
    }
  };

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-2xl mb-6 text-manduSecondary font-medium font-nasalization ">
                Company Details
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      className="text-manduSecondary"
                      htmlFor="companyName"
                    >
                      Company Name
                    </Label>
                    <Input
                      className="text-dashboardTitleLight border border-manduCustom-secondary-grey"
                      id="companyName"
                      {...register("companyName")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-manduSecondary" htmlFor="industry">
                      Industry
                    </Label>
                    <Select
                      defaultValue={
                        settingsData?.data?.profile?.industry || "technology"
                      }
                      onValueChange={(value) => setValue("industry", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent className="text-dashboardTitleLight border border-manduCustom-secondary-grey">
                        <SelectItem className="" value="technology">
                          Information Technology
                        </SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="manufacturing">
                          Manufacturing
                        </SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="hospitality">
                          Hospitality & Tourism
                        </SelectItem>
                        <SelectItem value="construction">
                          Construction
                        </SelectItem>
                        <SelectItem value="agriculture">Agriculture</SelectItem>
                        <SelectItem value="transportation">
                          Transportation & Logistics
                        </SelectItem>
                        <SelectItem value="media">
                          Media & Entertainment
                        </SelectItem>
                        <SelectItem value="telecom">
                          Telecommunications
                        </SelectItem>
                        <SelectItem value="energy">
                          Energy & Utilities
                        </SelectItem>
                        <SelectItem value="real_estate">Real Estate</SelectItem>
                        <SelectItem value="consulting">
                          Consulting & Professional Services
                        </SelectItem>
                        <SelectItem value="legal">Legal Services</SelectItem>
                        <SelectItem value="nonprofit">
                          Non-Profit & NGO
                        </SelectItem>
                        <SelectItem value="government">
                          Government & Public Sector
                        </SelectItem>
                        <SelectItem value="pharma">
                          Pharmaceuticals & Biotechnology
                        </SelectItem>
                        <SelectItem value="automotive">Automotive</SelectItem>
                        <SelectItem value="aerospace">
                          Aerospace & Defense
                        </SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="food">Food & Beverage</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                        <SelectItem value="marketing">
                          Marketing & Advertising
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label
                      className="text-manduSecondary font-medium"
                      htmlFor="companySize"
                    >
                      Company Size
                    </Label>
                    <Select
                      defaultValue={
                        settingsData?.data?.profile?.size || "51-200"
                      }
                      onValueChange={(value) => setValue("companySize", value)}
                    >
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
                    <Label
                      className="text-manduSecondary font-medium"
                      htmlFor="foundedYear"
                    >
                      Founded Year
                    </Label>
                    <Input
                      className="text-dashboardTitleLight border border-manduCustom-secondary-grey"
                      id="foundedYear"
                      type="number"
                      {...register("foundedYear")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    className="text-manduSecondary font-medium"
                    htmlFor="description"
                  >
                    Company Description
                  </Label>
                  <Textarea
                    className="text-dashboardTitleLight border border-manduCustom-secondary-grey"
                    id="description"
                    rows={4}
                    {...register("description")}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    className="text-manduSecondary font-medium"
                    htmlFor="address"
                  >
                    Company Address
                  </Label>
                  <Input
                    className="text-dashboardTitleLight border border-manduCustom-secondary-grey"
                    id="address"
                    {...register("address")}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      className="text-manduSecondary font-medium"
                      htmlFor="email"
                    >
                      Contact Email
                    </Label>
                    <Input
                      className="text-dashboardTitleLight border border-manduCustom-secondary-grey"
                      id="email"
                      type="email"
                      {...register("email")}
                    />
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
                  <Label
                    className="text-manduSecondary font-medium"
                    htmlFor="logo"
                  >
                    Company Logo
                  </Label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {logoPreview ? (
                        <Image
                          width={64}
                          height={64}
                          src={logoPreview}
                          alt="Company Logo"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : settingsData?.data?.image_path ? (
                        <Image
                          width={64}
                          height={64}
                          src={settingsData?.data?.image_path}
                          alt="Company Logo"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Building2 className="w-8 h-8 text-neutral-400" />
                      )}
                    </div>
                    <div className="relative">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 w-full text-manduSecondary font-medium"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                      <Input
                        type="file"
                        onChange={handleLogoChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/*"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-manduCustom-secondary-blue border border-manduCustom-secondary-blue font-medium"
                    disabled={!isDirty && !logoFile}
                    onClick={() => {
                      reset();
                      setLogoFile(null);
                      setLogoPreview(
                        settingsData?.data?.image_path ||
                          settingsData?.data?.profile?.logo ||
                          null
                      );
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isDirty && !logoFile}
                    className="bg-manduCustom-secondary-blue text-white hover:bg-neutral-800"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-2xl mb-4 text-manduSecondary font-medium">
                Account Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="2fa"
                    className="cursor-pointer text-manduNeutral-70"
                  >
                    Two-Factor Authentication
                  </Label>
                  <Switch
                    className="bg-manduCustom-secondary-blue"
                    id="2fa"
                    defaultChecked={
                      !!Number(settingsData?.data?.profile?.two_fa)
                    }
                    onCheckedChange={handleTwoFactorAuth}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="notifications"
                    className="cursor-pointer text-manduNeutral-70"
                  >
                    Email Notifications
                  </Label>
                  <Switch
                  className="bg-manduCustom-secondary-blue"
                    id="notifications"
                    defaultChecked={!!settingsData?.data?.profile?.notification}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4 text-manduSecondary">Subscription</h2>
              <div className="space-y-2">
                <p className="text-sm text-manduNeutral-70 font-medium">
                  Current Plan:{" "}
                  <span className="font-medium text-manduCustom-secondary-blue">
                    Premium
                  </span>
                </p>
                <p className="text-sm text-manduCustom-secondary-blue font-medium">
                  Valid until: Apr 22, 2025
                </p>
                <Button
                  className="w-full mt-4 bg-manduCustom-secondary-blue text-white hover:bg-neutral-800"
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
