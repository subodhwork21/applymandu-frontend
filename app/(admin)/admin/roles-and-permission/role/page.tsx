"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  UserCog,
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

// Define interfaces for the role and permissions
interface Permission {
  id: number;
  name: string;
  slug: string;
  description: string;
  module: string;
}

interface Role {
  id: number;
  name: string;
  slug: string;
  description: string;
  user_type: "admin" | "employer" | "jobseeker";
  permissions: Permission[];
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_type: "admin" | "employer" | "jobseeker";
  roles: Role[];
}

// Mock data for permissions
const mockPermissions: Permission[] = [
  {
    id: 1,
    name: "View Jobs",
    slug: "view-jobs",
    description: "Can view all jobs in the system",
    module: "Jobs",
  },
  {
    id: 2,
    name: "Create Jobs",
    slug: "create-jobs",
    description: "Can create new job listings",
    module: "Jobs",
  },
  {
    id: 3,
    name: "Edit Jobs",
    slug: "edit-jobs",
    description: "Can edit existing job listings",
    module: "Jobs",
  },
  {
    id: 4,
    name: "Delete Jobs",
    slug: "delete-jobs",
    description: "Can delete job listings",
    module: "Jobs",
  },
  {
    id: 5,
    name: "View Users",
    slug: "view-users",
    description: "Can view all users in the system",
    module: "Users",
  },
  {
    id: 6,
    name: "Edit Users",
    slug: "edit-users",
    description: "Can edit user information",
    module: "Users",
  },
  {
    id: 7,
    name: "Delete Users",
    slug: "delete-users",
    description: "Can delete users from the system",
    module: "Users",
  },
  {
    id: 8,
    name: "Manage Applications",
    slug: "manage-applications",
    description: "Can manage job applications",
    module: "Applications",
  },
  {
    id: 9,
    name: "View Reports",
    slug: "view-reports",
    description: "Can view system reports",
    module: "Reports",
  },
  {
    id: 10,
    name: "Manage Settings",
    slug: "manage-settings",
    description: "Can manage system settings",
    module: "Settings",
  },
];

// Mock data for roles
const mockRoles: Role[] = [
  {
    id: 1,
    name: "Super Admin",
    slug: "super-admin",
    description: "Has full access to all system features",
    user_type: "admin",
    permissions: mockPermissions,
  },
  {
    id: 2,
    name: "Admin",
    slug: "admin",
    description: "Has access to most system features",
    user_type: "admin",
    permissions: mockPermissions.filter((p) => p.id !== 10),
  },
];

// Mock data for users with this role
const mockUsers: User[] = [
  {
    id: 1,
    first_name: "Admin",
    last_name: "User",
    email: "admin@applymandu.com",
    user_type: "admin",
    roles: [mockRoles[0]],
  },
  {
    id: 2,
    first_name: "Manager",
    last_name: "User",
    email: "manager@applymandu.com",
    user_type: "admin",
    roles: [mockRoles[1]],
  },
];

const RoleDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const roleId = parseInt(params.id);
  
  // In a real app, you would fetch the role data from your API
  const role = mockRoles.find(r => r.id === roleId) || mockRoles[0];
  
  const [roleData, setRoleData] = useState<Role>(role);
  const [activeTab, setActiveTab] = useState("details");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  
  // Get users with this role
  const usersWithRole = mockUsers.filter(user => 
    user.roles.some(r => r.id === roleId)
  );
  
  // Get available modules from permissions
  const modules = Array.from(new Set(mockPermissions.map(p => p.module)));
  
  // Group permissions by module
  const permissionsByModule = modules.map(module => ({
    module,
    permissions: mockPermissions.filter(p => p.module === module)
  }));
  
  // Handle role update
  const handleUpdateRole = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send the updated role data to your API
    toast({
      title: "Role updated",
      description: "The role has been updated successfully.",
    });
  };
  
  // Handle role deletion
  const handleDeleteRole = () => {
    // In a real app, you would send a delete request to your API
    toast({
      title: "Role deleted",
      description: "The role has been deleted successfully.",
    });
    router.push("/admin/roles-permissions");
  };
  
  // Handle permission toggle
  const handlePermissionToggle = (permissionId: number) => {
    const hasPermission = roleData.permissions.some(p => p.id === permissionId);
    
    if (hasPermission) {
      // Remove permission
      setRoleData({
        ...roleData,
        permissions: roleData.permissions.filter(p => p.id !== permissionId)
      });
    } else {
      // Add permission
      const permissionToAdd = mockPermissions.find(p => p.id === permissionId);
      if (permissionToAdd) {
        setRoleData({
          ...roleData,
          permissions: [...roleData.permissions, permissionToAdd]
        });
      }
    }
  };
  
  // Handle adding a user to this role
  const handleAddUserToRole = (formData: FormData) => {
    // In a real app, you would send this data to your API
    const userId = formData.get("user_id");
    console.log("Adding user to role:", userId);
    
    toast({
      title: "User added to role",
      description: "The user has been assigned to this role successfully.",
    });
    setIsAddUserDialogOpen(false);
  };

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => router.push("/admin/roles-permissions")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl text-manduSecondary font-nasalization">
              Role Details
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleUpdateRole}
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
                  Delete Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Role</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this role? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteRole}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Role Details
              </TabsTrigger>
              <TabsTrigger value="permissions" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                Permissions
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                Users with Role
              </TabsTrigger>
            </TabsList>

            {/* Role Details Tab */}
            <TabsContent value="details">
              <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Edit Role Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateRole} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Role Name</Label>
                        <Input 
                          id="name" 
                          value={roleData.name}
                          onChange={(e) => setRoleData({...roleData, name: e.target.value})}
                          placeholder="Enter role name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug">Role Slug</Label>
                        <Input 
                          id="slug" 
                          value={roleData.slug}
                          onChange={(e) => setRoleData({...roleData, slug: e.target.value})}
                          placeholder="Enter role slug"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        value={roleData.description}
                        onChange={(e) => setRoleData({...roleData, description: e.target.value})}
                        placeholder="Enter role description"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user_type">User Type</Label>
                      <Select 
                        value={roleData.user_type}
                        onValueChange={(value: "admin" | "employer" | "jobseeker") => 
                          setRoleData({...roleData, user_type: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="employer">Employer</SelectItem>
                          <SelectItem value="jobseeker">Jobseeker</SelectItem>
                        </SelectContent>
                      </Select>
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

            {/* Permissions Tab */}
            <TabsContent value="permissions">
              <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                    <UserCog className="h-5 w-5 mr-2" />
                    Manage Role Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {permissionsByModule.map(({ module, permissions }) => (
                      <div key={module} className="space-y-2">
                        <h3 className="text-md font-medium text-manduSecondary">
                          {module} Permissions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {permissions.map((permission) => {
                            const isChecked = roleData.permissions.some(p => p.id === permission.id);
                            return (
                              <div key={permission.id} className="flex items-start space-x-2 p-2 border rounded-md">
                                <Checkbox 
                                  id={`permission-${permission.id}`}
                                  checked={isChecked}
                                  onCheckedChange={() => handlePermissionToggle(permission.id)}
                                />
                                <div className="space-y-1">
                                  <Label 
                                    htmlFor={`permission-${permission.id}`}
                                    className="font-medium text-sm cursor-pointer"
                                  >
                                    {permission.name}
                                  </Label>
                                  <p className="text-xs text-gray-500">
                                    {permission.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    <div className="pt-4">
                      <Button 
                        type="button" 
                        className="flex items-center gap-2"
                        onClick={handleUpdateRole}
                      >
                        <Save className="h-4 w-4" />
                        Save Permission Changes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users with Role Tab */}
            <TabsContent value="users">
              <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                      <UserCog className="h-5 w-5 mr-2" />
                      Users with this Role
                    </CardTitle>
                    <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Assign to User
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Role to User</DialogTitle>
                          <DialogDescription>
                            Assign the "{roleData.name}" role to a user.
                          </DialogDescription>
                        </DialogHeader>
                        <form action={handleAddUserToRole}>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="user_id" className="text-right">
                                User
                              </Label>
                              <Select name="user_id" required>
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select a user" />
                                </SelectTrigger>
                                <SelectContent>
                                  {mockUsers
                                    .filter(user => !user.roles.some(r => r.id === roleId))
                                    .map((user) => (
                                      <SelectItem key={user.id} value={user.id.toString()}>
                                        {user.first_name} {user.last_name} ({user.email})
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Assign Role</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>User Type</TableHead>
                        <TableHead>Other Roles</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersWithRole.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.first_name} {user.last_name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              user.user_type === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : user.user_type === 'employer'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user.roles
                                .filter(r => r.id !== roleId)
                                .map((role) => (
                                  <span key={role.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                    {role.name}
                                  </span>
                                ))}
                              {user.roles.filter(r => r.id !== roleId).length === 0 && (
                                <span className="text-gray-500 text-sm">No other roles</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                // In a real app, you would send a request to remove the role from this user
                                toast({
                                  title: "Role removed",
                                  description: `The role has been removed from ${user.first_name} ${user.last_name}.`,
                                });
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {usersWithRole.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No users have been assigned this role yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Role Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-grayColor">Total Permissions</p>
                  <h3 className="text-2xl font-bold text-manduSecondary mt-1">
                    {roleData.permissions.length}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Out of {mockPermissions.length} available
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCog className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-grayColor">Users with Role</p>
                  <h3 className="text-2xl font-bold text-manduSecondary mt-1">
                    {usersWithRole.length}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Active users with this role
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <UserCog className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-grayColor">Role Type</p>
                  <h3 className="text-2xl font-bold text-manduSecondary mt-1">
                    {roleData.user_type.charAt(0).toUpperCase() + roleData.user_type.slice(1)}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    User type for this role
                  </p>
                </div>
                <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-manduSecondary/5 to-manduCustom-secondary-blue/5 rounded-lg">
          <h3 className="text-lg font-semibold text-manduSecondary mb-2">Managing Roles</h3>
          <p className="text-gray-600 mb-4">
            This page allows you to manage the details, permissions, and user assignments for the "{roleData.name}" role.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-manduSecondary mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Role Details
              </h4>
              <p className="text-sm text-gray-600">
                Edit the basic information about this role, including its name, description, and user type.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-manduSecondary mb-2 flex items-center">
                <UserCog className="h-4 w-4 mr-2" />
                Permissions
              </h4>
              <p className="text-sm text-gray-600">
                Manage the permissions assigned to this role to control what users with this role can do.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-manduSecondary mb-2 flex items-center">
                <UserCog className="h-4 w-4 mr-2" />
                User Assignment
              </h4>
              <p className="text-sm text-gray-600">
                View and manage which users have been assigned this role in the system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoleDetailsPage;
