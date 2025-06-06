"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserCog,
  ArrowLeft,
  Save,
  Trash2,
  Shield,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

// Define interfaces for the permissions and roles
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
    permissions: [mockPermissions[0]],
  },
];

const PermissionDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const permissionId = parseInt(params.id);
  
  // In a real app, you would fetch the permission data from your API
  const permission = mockPermissions.find(p => p.id === permissionId) || mockPermissions[0];
  
  const [permissionData, setPermissionData] = useState<Permission>(permission);
  const [activeTab, setActiveTab] = useState("details");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Get roles with this permission
  const rolesWithPermission = mockRoles.filter(role => 
    role.permissions.some(p => p.id === permissionId)
  );
  
  // Handle permission update
  // Handle permission update
  const handleUpdatePermission = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send the updated permission data to your API
    toast({
      title: "Permission updated",
      description: "The permission has been updated successfully.",
    });
  };
  
  // Handle permission deletion
  const handleDeletePermission = () => {
    // In a real app, you would send a delete request to your API
    toast({
      title: "Permission deleted",
      description: "The permission has been deleted successfully.",
    });
    router.push("/admin/roles-permissions");
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
              Permission Details
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleUpdatePermission}
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
                  Delete Permission
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Permission</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this permission? This action cannot be undone and will remove this permission from all roles.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeletePermission}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                Permission Details
              </TabsTrigger>
              <TabsTrigger value="roles" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Roles with Permission
              </TabsTrigger>
            </TabsList>

            {/* Permission Details Tab */}
            <TabsContent value="details">
              <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                    <UserCog className="h-5 w-5 mr-2" />
                    Edit Permission Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdatePermission} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Permission Name</Label>
                        <Input 
                          id="name" 
                          value={permissionData.name}
                          onChange={(e) => setPermissionData({...permissionData, name: e.target.value})}
                          placeholder="Enter permission name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug">Permission Slug</Label>
                        <Input 
                          id="slug" 
                          value={permissionData.slug}
                          onChange={(e) => setPermissionData({...permissionData, slug: e.target.value})}
                          placeholder="Enter permission slug"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        value={permissionData.description}
                        onChange={(e) => setPermissionData({...permissionData, description: e.target.value})}
                        placeholder="Enter permission description"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="module">Module</Label>
                      <Input 
                        id="module" 
                        value={permissionData.module}
                        onChange={(e) => setPermissionData({...permissionData, module: e.target.value})}
                        placeholder="Enter module name"
                        required
                      />
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

            {/* Roles with Permission Tab */}
            <TabsContent value="roles">
              <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Roles with this Permission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role Name</TableHead>
                        <TableHead>User Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Total Permissions</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rolesWithPermission.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell className="font-medium">
                            {role.name}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              role.user_type === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : role.user_type === 'employer'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {role.user_type.charAt(0).toUpperCase() + role.user_type.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>{role.description}</TableCell>
                          <TableCell>{role.permissions.length}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => router.push(`/admin/roles-permissions/roles/${role.id}`)}
                            >
                              View Role
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {rolesWithPermission.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No roles have been assigned this permission yet.
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

        {/* Permission Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-grayColor">Roles Using Permission</p>
                  <h3 className="text-2xl font-bold text-manduSecondary mt-1">
                    {rolesWithPermission.length}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Out of {mockRoles.length} total roles
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-grayColor">Module</p>
                  <h3 className="text-2xl font-bold text-manduSecondary mt-1">
                    {permissionData.module}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Feature category
                  </p>
                </div>
                <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <UserCog className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-manduSecondary/5 to-manduCustom-secondary-blue/5 rounded-lg">
          <h3 className="text-lg font-semibold text-manduSecondary mb-2">Managing Permissions</h3>
          <p className="text-gray-600 mb-4">
            This page allows you to manage the details of the "{permissionData.name}" permission and see which roles use it.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-manduSecondary mb-2 flex items-center">
                <UserCog className="h-4 w-4 mr-2" />
                Permission Details
              </h4>
              <p className="text-sm text-gray-600">
                Edit the basic information about this permission, including its name, description, and module.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-manduSecondary mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Role Assignment
              </h4>
              <p className="text-sm text-gray-600">
                View which roles have been assigned this permission. To add or remove this permission from roles, edit the role directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PermissionDetailsPage;
