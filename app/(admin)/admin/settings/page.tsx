"use client";

import React, { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { baseFetcherAdmin, defaultFetcherAdmin } from "@/lib/fetcher";
import { Loader2, Save, User, Lock, Bell, Shield, Key } from "lucide-react";
import useSWR from "swr";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { deleteCookie } from "cookies-next";

interface AdminSettings {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  image_path: string;
  role: string;
  permissions: string[];
  two_fa_enabled: boolean;
  email_notifications: {
    new_employer: boolean;
    new_jobseeker: boolean;
    new_job: boolean;
    job_reports: boolean;
    system_alerts: boolean;
  };
  security_settings: {
    login_notification: boolean;
    session_timeout: number;
    ip_restriction: boolean;
    allowed_ips: string[];
  };
}

const AdminSettingsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { data: adminSettings, mutate } = useSWR<AdminSettings>(
    "api/admin/settings",
    defaultFetcherAdmin
  );

  const [formData, setFormData] = useState<Partial<AdminSettings>>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    email_notifications: {
      new_employer: false,
      new_jobseeker: false,
      new_job: false,
      job_reports: false,
      system_alerts: false,
    },
    security_settings: {
      login_notification: false,
      session_timeout: 60,
      ip_restriction: false,
      allowed_ips: [],
    },
    two_fa_enabled: false,
  });

  useEffect(() => {
    if (adminSettings) {
      setFormData({
        first_name: adminSettings.first_name || "",
        last_name: adminSettings.last_name || "",
        email: adminSettings.email || "",
        phone: adminSettings.phone || "",
        email_notifications: adminSettings.email_notifications || {
          new_employer: false,
          new_jobseeker: false,
          new_job: false,
          job_reports: false,
          system_alerts: false,
        },
        security_settings: adminSettings.security_settings || {
          login_notification: false,
          session_timeout: 60,
          ip_restriction: false,
          allowed_ips: [],
        },
        two_fa_enabled: adminSettings.two_fa_enabled || false,
      });
    }
  }, [adminSettings]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section?: string,
    field?: string
  ) => {
    const { name, value, type, checked } = e.target;

    if (section && field) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

 

  const handleAddIP = () => {
    const ipInput = document.getElementById("new-ip") as HTMLInputElement;
    const ip = ipInput.value.trim();
    
    if (ip && formData.security_settings) {
      // Simple IP validation
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (!ipRegex.test(ip)) {
        toast({
          title: "Invalid IP Format",
          description: "Please enter a valid IPv4 address",
          variant: "destructive",
        });
        return;
      }
      
      setFormData((prev) => ({
        ...prev,
        security_settings: {
          ...prev.security_settings!,
          allowed_ips: [...prev.security_settings!.allowed_ips, ip],
        },
      }));
      ipInput.value = "";
    }
  };

  const handleRemoveIP = (ipToRemove: string) => {
    if (formData.security_settings) {
      setFormData((prev) => ({
        ...prev,
        security_settings: {
          ...prev.security_settings!,
          allowed_ips: prev.security_settings!.allowed_ips.filter(
            (ip) => ip !== ipToRemove
          ),
        },
      }));
    }
  };
  

  const handleSaveProfile = async () => {
    setIsLoading(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append("first_name", formData.first_name || "");
    formDataToSend.append("last_name", formData.last_name || "");
    formDataToSend.append("email", formData.email || "");
    formDataToSend.append("phone", formData.phone || "");
    
    if (profileImage) {
      formDataToSend.append("profile_image", profileImage);
    }

    try {
      const { response, result } = await baseFetcherAdmin("api/admin/settings/profile", {
        method: "POST",
        body: formDataToSend,
      });

      if (response?.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        mutate();
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    
    try {
      const { response, result } = await baseFetcherAdmin("api/admin/settings/notifications", {
        method: "POST",
        body: JSON.stringify({
          email_notifications: formData.email_notifications,
        }),
      });

      if (response?.ok) {
        toast({
          title: "Success",
          description: "Notification settings updated successfully",
        });
        mutate();
      } else {
        toast({
          title: "Error",
          description: "Failed to update notification settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSecurity = async () => {
    setIsLoading(true);
    
    try {
      const { response, result } = await baseFetcherAdmin("api/admin/settings/security", {
        method: "POST",
        body: JSON.stringify({
          security_settings: formData.security_settings,
        }),
      });

      if (response?.ok) {
        toast({
          title: "Success",
          description: "Security settings updated successfully",
        });
        mutate();
      } else {
        toast({
          title: "Error",
          description: "Failed to update security settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { response, result } = await baseFetcherAdmin("api/admin/settings/password", {
        method: "POST",
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        }),
      });

      if (response?.ok) {
        toast({
          title: "Success",
          description: "Password changed successfully",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast({
          title: "Error",
          description: result?.message || "Failed to change password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    setIsLoading(true);
    
    try {
      const { response, result } = await baseFetcherAdmin("api/admin/settings/2fa", {
        method: "POST",
        body: JSON.stringify({
          enabled: !formData.two_fa_enabled,
        }),
      });

      if (response?.ok) {
        toast({
          title: "Success",
          description: `Two-factor authentication ${!formData.two_fa_enabled ? "enabled" : "disabled"} successfully`,
        });
        setFormData(prev => ({
          ...prev,
          two_fa_enabled: !prev.two_fa_enabled
        }));
        mutate();
      } else {
        toast({
          title: "Error",
          description: "Failed to update 2FA settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!adminSettings && !formData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-manduCustom-secondary-blue" />
      </div>
    );
  }

   const handleLogout = () => {
    deleteCookie("ADMIN_TOKEN");
    redirect("/");
  };

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl text-manduSecondary font-nasalization mb-6">Admin Settings</h1>

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Password</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card >
              <CardHeader className="flex justify-between items-center flex-row">
                <CardTitle>Profile Information</CardTitle>
               <button onClick={handleLogout} className="text-white px-4 py-2 rounded-[8px] bg-manduSecondary">
                Logout
               </button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-32 h-32 relative rounded-full overflow-hidden border border-gray-200">
                      {profileImagePreview ? (
                        <Image
                          src={profileImagePreview}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      ) : adminSettings?.image_path ? (
                        <Image
                          src={adminSettings.image_path}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <User className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="profile-image" className="block mb-2">
                        Profile Image
                      </Label>
                      <Input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Recommended: Square image, at least 300x300 pixels.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                                                id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        placeholder="Enter last name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        type="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Admin Role</Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="font-medium">{adminSettings?.role || "Administrator"}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Contact the system administrator to change your role permissions.
                      </p>
                    </div>
                  </div>

                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={isLoading}
                    className="bg-manduCustom-secondary-blue hover:bg-manduCustom-secondary-blue/90"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch
                        checked={formData.two_fa_enabled}
                        onCheckedChange={handleToggle2FA}
                        disabled={isLoading}
                      />
                    </div>
                    {formData.two_fa_enabled && (
                      <div className="p-4 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-700">
                          Two-factor authentication is enabled. You will be prompted for a verification code when logging in.
                        </p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Login Notifications</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Login Notifications</p>
                        <p className="text-sm text-gray-500">
                          Receive an email when someone logs into your account
                        </p>
                      </div>
                      <Switch
                        checked={formData.security_settings?.login_notification}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({
                            ...prev,
                            security_settings: {
                              ...prev.security_settings!,
                              login_notification: checked
                            }
                          }))
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Session Timeout</h3>
                    <div className="space-y-2">
                      <Label htmlFor="session_timeout">Automatically log out after inactivity (minutes)</Label>
                      <Input
                        id="session_timeout"
                        type="number"
                        min="5"
                        max="1440"
                        value={formData.security_settings?.session_timeout}
                        onChange={(e) => 
                          setFormData(prev => ({
                            ...prev,
                            security_settings: {
                              ...prev.security_settings!,
                              session_timeout: parseInt(e.target.value)
                            }
                          }))
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">IP Restrictions</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable IP Restrictions</p>
                        <p className="text-sm text-gray-500">
                          Only allow logins from specific IP addresses
                        </p>
                      </div>
                      <Switch
                        checked={formData.security_settings?.ip_restriction}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({
                            ...prev,
                            security_settings: {
                              ...prev.security_settings!,
                              ip_restriction: checked
                            }
                          }))
                        }
                      />
                    </div>

                    {formData.security_settings?.ip_restriction && (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            id="new-ip"
                            placeholder="Enter IP address (e.g., 192.168.1.1)"
                          />
                          <Button 
                            onClick={handleAddIP}
                            variant="outline"
                          >
                            Add IP
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Allowed IP Addresses</Label>
                          {formData.security_settings?.allowed_ips.length === 0 ? (
                            <p className="text-sm text-gray-500">No IP addresses added yet</p>
                          ) : (
                            <div className="space-y-2">
                              {formData.security_settings?.allowed_ips.map((ip) => (
                                <div key={ip} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                  <span>{ip}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveIP(ip)}
                                    className="h-8 w-8 p-0 text-red-500"
                                  >
                                    &times;
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={handleSaveSecurity} 
                    disabled={isLoading}
                    className="bg-manduCustom-secondary-blue hover:bg-manduCustom-secondary-blue/90"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Security Settings
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Employer Registrations</p>
                          <p className="text-sm text-gray-500">
                            Receive notifications when new employers register
                          </p>
                        </div>
                        <Switch
                          checked={formData.email_notifications?.new_employer}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({
                              ...prev,
                              email_notifications: {
                                ...prev.email_notifications!,
                                new_employer: checked
                              }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Jobseeker Registrations</p>
                          <p className="text-sm text-gray-500">
                            Receive notifications when new jobseekers register
                          </p>
                        </div>
                        <Switch
                          checked={formData.email_notifications?.new_jobseeker}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({
                              ...prev,
                              email_notifications: {
                                ...prev.email_notifications!,
                                new_jobseeker: checked
                              }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Job Postings</p>
                          <p className="text-sm text-gray-500">
                            Receive notifications when new jobs are posted
                          </p>
                        </div>
                        <Switch
                          checked={formData.email_notifications?.new_job}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({
                              ...prev,
                              email_notifications: {
                                ...prev.email_notifications!,
                                new_job: checked
                              }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Job Reports</p>
                          <p className="text-sm text-gray-500">
                            Receive weekly and monthly job posting reports
                          </p>
                        </div>
                        <Switch
                          checked={formData.email_notifications?.job_reports}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({
                              ...prev,
                              email_notifications: {
                                ...prev.email_notifications!,
                                job_reports: checked
                              }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">System Alerts</p>
                          <p className="text-sm text-gray-500">
                            Receive notifications about system performance and issues
                          </p>
                        </div>
                        <Switch
                          checked={formData.email_notifications?.system_alerts}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({
                              ...prev,
                              email_notifications: {
                                ...prev.email_notifications!,
                                system_alerts: checked
                              }
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleSaveNotifications} 
                    disabled={isLoading}
                    className="bg-manduCustom-secondary-blue hover:bg-manduCustom-secondary-blue/90"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Notification Settings
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current_password">Current Password</Label>
                      <Input
                        id="current_password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter your current password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new_password">New Password</Label>
                      <Input
                        id="new_password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                      <p className="text-sm text-gray-500">
                        Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">Confirm New Password</Label>
                      <Input
                        id="confirm_password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleChangePassword} 
                    disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                    className="bg-manduCustom-secondary-blue hover:bg-manduCustom-secondary-blue/90"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <Key className="mr-2 h-4 w-4" />
                        Change Password
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default AdminSettingsPage;

