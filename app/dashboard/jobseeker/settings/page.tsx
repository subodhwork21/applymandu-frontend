"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useSWR from "swr";
import { defaultFetcher, baseFetcher } from "@/lib/fetcher";
import { toast, useToast } from '@/hooks/use-toast';
import { deleteCookie } from 'cookies-next/client';
import { useAuth } from '@/lib/auth-context';
import { jobSeekerToken } from '@/lib/tokens';

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  image_path: string | null;
  visible_to_employers: boolean;
  appear_in_search_results: boolean;
  show_contact_info: boolean;
  show_online_status: boolean;
  allow_personalized_recommendations  : boolean;
  email_job_matches: boolean;
  sms_application_updates: boolean;
  subscribe_to_newsletter: boolean;
}

const SettingsPage = () => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<UserProfile>({
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    image_path: null,
    visible_to_employers: false,
    appear_in_search_results: false,
    show_contact_info: false,
    show_online_status: false,
    allow_personalized_recommendations: false,
    email_job_matches: false,
    sms_application_updates: false,
    subscribe_to_newsletter: false
  });
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: ""
  });

  const {user, logout} = useAuth();

  // Fetch user profile data
  const { data, error, isLoading, mutate } = useSWR<Record<string,any>>('api/jobseeker/user-preference', defaultFetcher);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  // Update form data when API data is loaded
  useEffect(() => {
    if (data && data?.success) {
      const userData = data?.data;
      setFormData({
        id: userData.id,
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        image_path: userData.image_path,
        visible_to_employers: userData?.preferences?.visible_to_employers || false,
        appear_in_search_results: userData?.preferences?.appear_in_search_results || false,
        show_contact_info: userData?.preferences?.show_contact_info || false,
        show_online_status: userData?.preferences?.show_online_status || false,
        allow_personalized_recommendations: userData?.preferences?.allow_personalized_recommendations || false,
        email_job_matches: userData?.preferences?.email_job_matches || false,
        sms_application_updates: userData?.preferences?.sms_application_updates || false,
        subscribe_to_newsletter: userData?.preferences?.subscribe_to_newsletter || false
      });
    }
  }, [data]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  
  const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      toast({
        title: "Error",
        description: "Please select an image to upload",
        variant: "destructive",
      });
      return;
    }
    
    const file = fileInput.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
  
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('image', file);
  
      // Get the base URL
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) {
        throw new Error("API URL is not defined");
      }
  
      // Make a direct fetch request instead of using baseFetcher
      const response = await fetch(`${baseUrl}api/jobseeker/upload-image`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${jobSeekerToken()}`
        },
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile image updated successfully",
        });
        
        // Update the user state with the new image path if available
        if (result?.data?.image_path) {
          setFormData(prev => ({
            ...prev,
            image_path: result.data.image_path
          }));
        }
        // Refresh the data
        mutate();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to upload image",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle password changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { response, result, errors } = await baseFetcher('api/jobseeker/update-preference', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      // console.log(result);

      if (response?.ok) {
        toast({
          title: "Success",
          description: "Your settings have been updated successfully.",
          variant: "default",
        });
        mutate(); 
      } else {
        // const errors = errors;
        // for (const key in errors) {
        //   if (errors.hasOwnProperty(key) && errors[key].length > 0) {
            toast({
              title: "Error",
              description: errors,
              variant: "destructive",
            });
        //   }
        // }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async () => {
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { response, result, error, message, errors } = await baseFetcher('api/jobseeker/change-password', {
        method: 'POST',
        body: JSON.stringify({
          current_password: passwordData.current_password,
          password: passwordData.new_password,
          password_confirmation: passwordData.new_password_confirmation
        })
      });


      if (response?.ok) {
        toast({
          title: "Success",
          description: "Your password has been updated successfully.",
          variant: "default",
        });
        setPasswordData({
          current_password: "",
          new_password: "",
          new_password_confirmation: ""
        });
      } else {
        toast({
          title: "Error",
          description: errors,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle account deactivation
  const handleDeactivateAccount = async () => {
    try {
      const { response, result } = await baseFetcher('api/jobseeker/deactivate-account', {
        method: 'POST'
      });

      if (response?.ok) {
        toast({
          title: "Account Deactivated",
          description: "Your account has been deactivated successfully.",
          variant: "default",
        });
        // Redirect to logout or home page
        deleteCookie('JOBSEEKER_TOKEN');
        logout();
        window.location.href = "/";
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to deactivate account. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    setShowDeactivateDialog(false);
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      const { response, result } = await baseFetcher('api/jobseeker/delete-account', {
        method: 'DELETE'
      });

      if (response?.ok) {
        toast({
          title: "Account Deleted",
          description: "Your account has been permanently deleted.",
          variant: "default",
        });
        // Redirect to home page
        window.location.href = "/";
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete account. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
  };

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p>Loading your settings...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-red-500">Error loading your settings. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1">Settings</h1>
          <p className="text-neutral-600">Manage your account preferences and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
<form onSubmit={handleImageUpload} className="bg-white rounded-lg border border-neutral-200 p-6">
  <h3 className="text-lg mb-4">Profile Photo</h3>
  <div className="flex items-center space-x-4">
    <img 
      src={formData.image_path || "https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=789"} 
      alt="Profile" 
      className="w-20 h-20 rounded-full object-cover"
    />
    <div>
      <Button 
        type='button' 
        className="bg-black text-white hover:bg-neutral-800"
        onClick={triggerFileInput}
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Change Photo"}
        <input 
          type="file" 
          accept="image/*" 
          className="sr-only" 
          ref={fileInputRef}
          onChange={() => {
            // Auto-submit the form when a file is selected
            if (fileInputRef.current?.files?.length) {
              handleImageUpload(new Event('submit') as any);
            }
          }}
        />
      </Button>
      <p className="text-sm text-neutral-500 mt-2">Recommended: Square JPG, PNG (300x300px)</p>
    </div>
  </div>
</form>

            {/* Password */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg mb-4">Password</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Current Password</Label>
                  <Input 
                    id="current_password"
                    name="current_password"
                    type="password" 
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <Input 
                    id="new_password"
                    name="new_password"
                    type="password" 
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new_password_confirmation">Confirm New Password</Label>
                  <Input 
                    id="new_password_confirmation"
                    name="new_password_confirmation"
                    type="password" 
                    value={passwordData.new_password_confirmation}
                    onChange={handlePasswordChange}
                  />
                </div>
                <Button 
                  className="w-full bg-black text-white hover:bg-neutral-800"
                  onClick={handlePasswordUpdate}
                  disabled={isSubmitting}
                >
                  Update Password
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <h2 className="text-xl mb-6">Personal Information</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input 
                      id="first_name"
                      name="first_name"
                      value={formData.first_name} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input 
                      id="last_name"
                      name="last_name"
                      value={formData.last_name} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex">
                      <Input 
                        value="+977" 
                        className="w-20 bg-neutral-50 border-r-0 rounded-r-none" 
                        disabled 
                      />
                      <Input 
                        id="phone"
                        name="phone"
                        type="tel" 
                        value={formData.phone} 
                        onChange={handleInputChange}
                        className="flex-1 rounded-l-none" 
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy and Notification Preferences */}
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl mb-4">Privacy Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="profile_visibility" 
                          checked={formData.visible_to_employers}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange('visible_to_employers', checked as boolean)
                          }
                        />
                        <Label htmlFor="profile_visibility">Make my profile visible to employers</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="searchable" 
                          checked={formData.appear_in_search_results}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange('appear_in_search_results', checked as boolean)
                          }
                        />
                        <Label htmlFor="searchable">Allow my profile to appear in search results</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="show_contact_info" 
                          checked={formData.show_contact_info}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange('show_contact_info', checked as boolean)
                          }
                        />
                        <Label htmlFor="show_contact_info">Show my contact information to employers</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="show_activity_status" 
                          checked={formData.show_online_status}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange('show_online_status', checked as boolean)
                          }
                        />
                        <Label htmlFor="show_activity_status">Show my online activity status</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="allow_data_usage" 
                          checked={formData.allow_personalized_recommendations}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange('allow_personalized_recommendations', checked as boolean)
                          }
                        />
                        <Label htmlFor="allow_data_usage">Allow data usage for personalized job recommendations</Label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-neutral-200">
                    <h3 className="text-xl mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="email_notifications" 
                          checked={formData.email_job_matches}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange('email_job_matches', checked as boolean)
                          }
                        />
                        <Label htmlFor="email_notifications">Email notifications for new job matches</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="sms_notifications" 
                          checked={formData.sms_application_updates}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange('sms_application_updates', checked as boolean)
                          }
                        />
                        <Label htmlFor="sms_notifications">SMS notifications for application updates</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="newsletter_subscription" 
                          checked={formData.subscribe_to_newsletter}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange('subscribe_to_newsletter', checked as boolean)
                          }
                        />
                        <Label htmlFor="newsletter_subscription">Subscribe to newsletter</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-xl mb-4">Account Actions</h3>
              <div className="flex flex-col md:flex-row gap-3">
                <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full md:w-auto bg-black text-white hover:bg-neutral-800">
                      Deactivate Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deactivate Account</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to deactivate your account? Your profile will be hidden from employers and you won&apos;t receive any notifications. You can reactivate your account at any time by logging back in.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-black text-white hover:bg-neutral-800"
                        onClick={handleDeactivateAccount}
                      >
                        Deactivate Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full md:w-auto">
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Account</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={handleDeleteAccount}
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Save Changes */}
            <div className="flex justify-end space-x-4">
              <Button variant="outline">Cancel</Button>
              <Button 
                className="bg-black text-white hover:bg-neutral-800"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SettingsPage;
