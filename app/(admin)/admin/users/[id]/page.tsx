"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  ArrowLeft,
  Save,
  Trash2,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Shield,
  Key,
  Eye,
  EyeOff,
  Upload,
  UserCog,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

// Define interfaces for admin users
interface AdminUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  status: "active" | "inactive";
  last_login: string;
  created_at: string;
  image_path?: string;
  login_history?: {
    date: string;
    ip_address: string;
    device: string;
  }[];
}

// Available admin roles
const adminRoles = [
  "Super Admin",
  "Admin",
  "Manager",
  "Officer",
  "Content Editor",
  "Support Agent",
  "Analyst",
];

// Mock data for a single admin user
const mockAdminUser: AdminUser = {
  id: 1,
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@applymandu.com",
  phone: "+977 9801234567",
  role: "Super Admin",
  status: "active",
  last_login: "2023-06-15T08:30:00",
  created_at: "2023-01-10T10:00:00",
  image_path: "https://github.com/shadcn.png",
  login_history: [
    {
      date: "2023-06-15T08:30:00",
      ip_address: "192.168.1.1",
      device: "Chrome / Windows 10",
    },
    {
      date: "2023-06-10T14:45:00",
      ip_address: "192.168.1.1",
      device: "Chrome / Windows 10",
    },
    {
      date: "2023-06-05T09:15:00",
      ip_address: "192.168.1.1",
      device: "Safari / macOS",
    },
  ],
};

const AdminUserEditPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const userId = parseInt(params.id);
  
  // In a real app, you would fetch the user data from your API
  // const { data: user, isLoading, mutate } = useSWR<AdminUser>(
  //   `api/admin/users/${userId}`,
  //   defaultFetcherAdmin
  // );
  
  // For now, we'll use mock data
  const user = mockAdminUser;
  const isLoading = false;
  const mutate = () => console.log("Mutating data...");
  
  const [userData, setUserData] = useState<AdminUser>(user);
  const [activeTab, setActiveTab] = useState("profile");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  
  // Handle user update
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send the updated user data to your API
    toast({
      title: "User updated",
      description: "The admin user has been updated successfully.",
    });
  };
  
  // Handle user deletion
  const handleDeleteUser = () => {
    // In a real app, you would send a delete request to your API
    toast({
      title: "User deleted",
      description: `${userData.first_name} ${userData.last_name} has been deleted.`,
    });
    router.push("/admin/users-management");
  };
  
  // Handle password reset
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== passwordConfirmation) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you would send the new password to your API
    toast({
      title: "Password reset",
      description: "The password has been reset successfully.",
    });
    setIsResetPasswordDialogOpen(false);
    setPassword("");
    setPasswordConfirmation("");
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading user data...</div>;
  }

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => router.push("/admin/users")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl text-manduSecondary font-nasalization">
              Edit Admin User
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setIsResetPasswordDialogOpen(true)}
            >
              <Key className="h-4 w-4" />
              Reset Password
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleUpdateUser}
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Admin User</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this admin user? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar>
                      <AvatarImage src={userData.image_path} />
                      <AvatarFallback>{userData.first_name.charAt(0)}{userData.last_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{userData.first_name} {userData.last_name}</p>
                      <p className="text-xs text-gray-500">{userData.email}</p>
                      <p className="text-xs text-gray-500">{userData.role}</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteUser}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* User Profile Card */}
          <Card className="border-[1px] border-solid border-slate-200 shadow-sm md:col-span-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userData.image_path} />
                    <AvatarFallback className="text-2xl">{userData.first_name.charAt(0)}{userData.last_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute bottom-0 right-0 rounded-full bg-white"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="text-xl font-bold">{userData.first_name} {userData.last_name}</h3>
                <Badge variant="outline" className={
                  userData.role === "Super Admin" ? "bg-purple-100 text-purple-800 hover:bg-purple-100 mt-2" :
                  userData.role === "Admin" ? "bg-blue-100 text-blue-800 hover:bg-blue-100 mt-2" :
                  userData.role === "Manager" ? "bg-green-100 text-green-800 hover:bg-green-100 mt-2" :
                  userData.role === "Officer" ? "bg-amber-100 text-amber-800 hover:bg-amber-100 mt-2" :
                  "bg-gray-100 text-gray-800 hover:bg-gray-100 mt-2"
                }>
                  {userData.role}
                </Badge>
                <div className="flex items-center justify-center mt-2">
                  {userData.status === "active" ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center">
                      <XCircle className="h-3 w-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                </div>
                <Separator className="my-4" />
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </span>
                    <span className="text-sm font-medium">{userData.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Phone
                    </span>
                    <span className="text-sm font-medium">{userData.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Created
                    </span>
                    <span className="text-sm font-medium">{new Date(userData.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Last Login
                    </span>
                    <span className="text-sm font-medium">{new Date(userData.last_login).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Edit Tabs */}
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Profile Information
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Login Activity
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Edit Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateUser} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">First Name</Label>
                          <Input 
                            id="first_name" 
                            value={userData.first_name}
                            onChange={(e) => setUserData({...userData, first_name: e.target.value})}
                            placeholder="Enter first name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name">Last Name</Label>
                          <Input 
                            id="last_name" 
                            value={userData.last_name}
                            onChange={(e) => setUserData({...userData, last_name: e.target.value})}
                            placeholder="Enter last name"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={userData.email}
                          onChange={(e) => setUserData({...userData, email: e.target.value})}
                          placeholder="Enter email address"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          value={userData.phone}
                          onChange={(e) => setUserData({...userData, phone: e.target.value})}
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select 
                          value={userData.role} 
                          onValueChange={(value) => setUserData({...userData, role: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            {adminRoles.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="status" 
                          checked={userData.status === "active"}
                          onCheckedChange={(checked) => 
                            setUserData({...userData, status: checked ? "active" : "inactive"})
                          }
                        />
                        <Label htmlFor="status">Active Account</Label>
                      </div>
                      <div className="pt-4">
                        <Button type="submit" className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity">
                <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Login Activity History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userData.login_history?.map((login, index) => (
                        <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <Clock className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                              <p className="font-medium text-sm">
                                Logged in successfully
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(login.date).toLocaleString()}
                              </p>
                            </div>
                            <div className="mt-1 text-xs text-gray-500 flex flex-col sm:flex-row sm:gap-4">
                              <span className="flex items-center">
                                <span className="font-medium mr-1">IP:</span> {login.ip_address}
                              </span>
                              <span className="flex items-center">
                                <span className="font-medium mr-1">Device:</span> {login.device}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!userData.login_history || userData.login_history.length === 0) && (
                        <p className="text-center text-gray-500 py-4">
                          No login activity recorded for this user.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Reset Password Dialog */}
        <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Set a new password for {userData.first_name} {userData.last_name}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleResetPassword}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new_password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm_password"
                      type={showPassword ? "text" : "password"}
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      placeholder="Confirm new password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Reset Password</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* User Permissions Section */}
        <Card className="border-[1px] border-solid border-slate-200 shadow-sm mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                User Permissions
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push(`/admin/users-management/${userId}/permissions`)}
              >
                Manage Permissions
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-manduSecondary mb-2">Jobs Management</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">View Jobs</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Create Jobs</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Edit Jobs</span>
                  </div>
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm">Delete Jobs</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-manduSecondary mb-2">User Management</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">View Users</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Edit Users</span>
                  </div>
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm">Delete Users</span>
                  </div>
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm">Manage Permissions</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-manduSecondary mb-2">System Settings</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">View Settings</span>
                  </div>
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm">Edit Settings</span>
                  </div>
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm">Manage Backups</span>
                  </div>
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm">System Logs</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-manduSecondary/5 to-manduCustom-secondary-blue/5 rounded-lg">
          <h3 className="text-lg font-semibold text-manduSecondary mb-2">Managing Admin User</h3>
          <p className="text-gray-600 mb-4">
            This page allows you to edit the details of {userData.first_name} {userData.last_name}, reset their password, and view their login activity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-manduSecondary mb-2 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Profile Information
              </h4>
              <p className="text-sm text-gray-600">
                Edit the user's basic information, including name, email, phone, role, and status.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-manduSecondary mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Permissions
              </h4>
              <p className="text-sm text-gray-600">
                View and manage the user's permissions to control what actions they can perform in the system.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-manduSecondary mb-2 flex items-center">
                <Key className="h-4 w-4 mr-2" />
                Security
              </h4>
              <p className="text-sm text-gray-600">
                Reset the user's password and view their login activity to monitor for suspicious behavior.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminUserEditPage;

