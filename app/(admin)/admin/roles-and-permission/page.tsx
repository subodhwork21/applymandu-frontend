"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Briefcase,
  Building,
  Shield,
  UserCog,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { defaultFetcherAdmin } from "@/lib/fetcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import DataNavigation from "@/components/ui/data-navigation";
import { toast } from "@/hooks/use-toast";

// Define interfaces for the roles and permissions
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

interface ApiResponse {
  data: Role[] | Permission[] | User[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

// Mock data for development
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
  {
    id: 3,
    name: "Employer Premium",
    slug: "employer-premium",
    description: "Premium employer with enhanced features",
    user_type: "employer",
    permissions: mockPermissions.filter((p) => [1, 2, 3, 8].includes(p.id)),
  },
  {
    id: 4,
    name: "Employer Basic",
    slug: "employer-basic",
    description: "Basic employer with limited features",
    user_type: "employer",
    permissions: mockPermissions.filter((p) => [1, 2].includes(p.id)),
  },
  {
    id: 5,
    name: "Jobseeker Premium",
    slug: "jobseeker-premium",
    description: "Premium jobseeker with enhanced features",
    user_type: "jobseeker",
    permissions: mockPermissions.filter((p) => [1, 8].includes(p.id)),
  },
  {
    id: 6,
    name: "Jobseeker Basic",
    slug: "jobseeker-basic",
    description: "Basic jobseeker with limited features",
    user_type: "jobseeker",
    permissions: mockPermissions.filter((p) => [1].includes(p.id)),
  },
];

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
    first_name: "Employer",
    last_name: "Premium",
    email: "employer@company.com",
    user_type: "employer",
    roles: [mockRoles[2]],
  },
  {
    id: 3,
    first_name: "Job",
    last_name: "Seeker",
    email: "jobseeker@example.com",
    user_type: "jobseeker",
    roles: [mockRoles[4]],
  },
];

const RolesPermissionsPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("roles");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [isAddPermissionDialogOpen, setIsAddPermissionDialogOpen] = useState(false);
  const [isAssignRoleDialogOpen, setIsAssignRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // In a real application, you would fetch this data from your API
  // const { data: rolesData, isLoading: rolesLoading } = useSWR<ApiResponse>(
  //   "api/admin/roles",
  //   defaultFetcherAdmin
  // );
  
  // For now, we'll use mock data
  const rolesData = {
    data: mockRoles,
    meta: {
      current_page: 1,
      from: 1,
      last_page: 1,
      links: [],
      path: "",
      per_page: 10,
      to: mockRoles.length,
      total: mockRoles.length,
    },
  };
  
  const permissionsData = {
    data: mockPermissions,
    meta: {
      current_page: 1,
      from: 1,
      last_page: 1,
      links: [],
      path: "",
      per_page: 10,
      to: mockPermissions.length,
      total: mockPermissions.length,
    },
  };
  
  const usersData = {
    data: mockUsers,
    meta: {
      current_page: 1,
      from: 1,
      last_page: 1,
      links: [],
      path: "",
      per_page: 10,
      to: mockUsers.length,
      total: mockUsers.length,
    },
  };

  // Filter roles based on search term and selected user type
  const filteredRoles = rolesData.data.filter((role) => {
    const matchesSearch = 
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUserType = selectedUserType ? role.user_type === selectedUserType : true;
    
    return matchesSearch && matchesUserType;
  });

  // Filter permissions based on search term
  const filteredPermissions = permissionsData.data.filter((permission) =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter users based on search term and selected user type
  const filteredUsers = usersData.data.filter((user) => {
    const matchesSearch = 
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUserType = selectedUserType ? user.user_type === selectedUserType : true;
    
    return matchesSearch && matchesUserType;
  });

  // Handle role creation
  const handleCreateRole = (formData: FormData) => {
    // In a real application, you would send this data to your API
    console.log("Creating new role:", Object.fromEntries(formData));
    toast({
      title: "Role created",
      description: "The role has been created successfully.",
    });
    setIsAddRoleDialogOpen(false);
  };

  // Handle permission creation
  const handleCreatePermission = (formData: FormData) => {
    // In a real application, you would send this data to your API
    console.log("Creating new permission:", Object.fromEntries(formData));
    toast({
      title: "Permission created",
      description: "The permission has been created successfully.",
    });
    setIsAddPermissionDialogOpen(false);
  };

  // Handle role assignment
  const handleAssignRole = (formData: FormData) => {
    // In a real application, you would send this data to your API
    console.log("Assigning role:", Object.fromEntries(formData));
    toast({
      title: "Role assigned",
      description: "The role has been assigned successfully.",
    });
    setIsAssignRoleDialogOpen(false);
  };

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl text-manduSecondary font-nasalization">
            Roles & Permissions
          </h1>
          <div className="flex items-center gap-2">
            <Select
              value={selectedUserType || ""}
              onValueChange={(value) => setSelectedUserType(value || null)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All User Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All User Types</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="employer">Employer</SelectItem>
                <SelectItem value="jobseeker">Jobseeker</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="roles" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Roles
              </TabsTrigger>
              <TabsTrigger value="permissions" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                Permissions
              </TabsTrigger>
              <TabsTrigger value="user-roles" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                User Roles
              </TabsTrigger>
            </TabsList>

            {/* Roles Tab */}
            <TabsContent value="roles">
              <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Manage Roles
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          type="search"
                          placeholder="Search roles..."
                          className="pl-9 w-full sm:w-[250px]"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Role
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create New Role</DialogTitle>
                            <DialogDescription>
                              Add a new role to the system. Roles define what users can do.
                            </DialogDescription>
                          </DialogHeader>
                          <form action={handleCreateRole}>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Name
                                </Label>
                                <Input
                                  id="name"
                                  name="name"
                                  placeholder="Role name"
                                  className="col-span-3"
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="slug" className="text-right">
                                  Slug
                                </Label>
                                <Input
                                  id="slug"
                                  name="slug"
                                  placeholder="role-slug"
                                  className="col-span-3"
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                  Description
                                </Label>
                                <Input
                                  id="description"
                                  name="description"
                                  placeholder="Role description"
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="user_type" className="text-right">
                                  User Type
                                </Label>
                                <Select name="user_type" defaultValue="admin">
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select user type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="employer">Employer</SelectItem>
                                    <SelectItem value="jobseeker">Jobseeker</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right pt-2">Permissions</Label>
                                <div className="col-span-3 space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-2">
                                  {mockPermissions.map((permission) => (
                                    <div key={permission.id} className="flex items-center space-x-2">
                                      <Checkbox 
                                        id={`permission-${permission.id}`} 
                                        name="permissions[]" 
                                        value={permission.id.toString()} 
                                      />
                                      <Label htmlFor={`permission-${permission.id}`} className="text-sm">
                                        {permission.name} <span className="text-gray-500 text-xs">({permission.module})</span>
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="button" variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit">Create Role</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>User Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRoles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell className="font-medium">{role.name}</TableCell>
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
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {role.permissions.slice(0, 3).map((permission) => (
                                <span key={permission.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                  {permission.name}
                                </span>
                              ))}
                              {role.permissions.length > 3 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                  +{role.permissions.length - 3} more
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => {
                                setSelectedRole(role);
                                // In a real app, you would open an edit dialog here
                              }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => {
                                // In a real app, you would show a confirmation dialog
                                toast({
                                  title: "Role deleted",
                                  description: `The role "${role.name}" has been deleted.`,
                                });
                              }}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredRoles.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No roles found. Try adjusting your search or filters.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  {/* Pagination would go here in a real application */}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Permissions Tab */}
            <TabsContent value="permissions">
              <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                      <UserCog className="h-5 w-5 mr-2" />
                      Manage Permissions
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          type="search"
                          placeholder="Search permissions..."
                          className="pl-9 w-full sm:w-[250px]"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Dialog open={isAddPermissionDialogOpen} onOpenChange={setIsAddPermissionDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Permission
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create New Permission</DialogTitle>
                            <DialogDescription>
                              Add a new permission to the system. Permissions define specific actions users can perform.
                            </DialogDescription>
                          </DialogHeader>
                          <form action={handleCreatePermission}>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Name
                                </Label>
                                <Input
                                  id="name"
                                  name="name"
                                  placeholder="Permission name"
                                  className="col-span-3"
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="slug" className="text-right">
                                  Slug
                                </Label>
                                <Input
                                  id="slug"
                                  name="slug"
                                  placeholder="permission-slug"
                                  className="col-span-3"
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                  Description
                                </Label>
                                <Input
                                  id="description"
                                  name="description"
                                  placeholder="Permission description"
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="module" className="text-right">
                                  Module
                                </Label>
                                <Input
                                  id="module"
                                  name="module"
                                  placeholder="Module name"
                                  className="col-span-3"
                                  required
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="button" variant="outline" onClick={() => setIsAddPermissionDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit">Create Permission</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Module</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPermissions.map((permission) => (
                        <TableRow key={permission.id}>
                          <TableCell className="font-medium">{permission.name}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                              {permission.module}
                            </span>
                          </TableCell>
                          <TableCell>{permission.description}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => {
                                setSelectedPermission(permission);
                                // In a real app, you would open an edit dialog here
                              }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => {
                                // In a real app, you would show a confirmation dialog
                                toast({
                                  title: "Permission deleted",
                                  description: `The permission "${permission.name}" has been deleted.`,
                                });
                              }}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredPermissions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                            No permissions found. Try adjusting your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  {/* Pagination would go here in a real application */}
                </CardContent>
              </Card>
            </TabsContent>

            {/* User Roles Tab */}
            <TabsContent value="user-roles">
              <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Manage User Roles
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          type="search"
                          placeholder="Search users..."
                          className="pl-9 w-full sm:w-[250px]"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Dialog open={isAssignRoleDialogOpen} onOpenChange={setIsAssignRoleDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Assign Role
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Role to User</DialogTitle>
                            <DialogDescription>
                              Assign a role to a user to define their permissions in the system.
                            </DialogDescription>
                          </DialogHeader>
                          <form action={handleAssignRole}>
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
                                    {mockUsers.map((user) => (
                                      <SelectItem key={user.id} value={user.id.toString()}>
                                        {user.first_name} {user.last_name} ({user.email})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role_id" className="text-right">
                                  Role
                                </Label>
                                <Select name="role_id" required>
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {mockRoles.map((role) => (
                                      <SelectItem key={role.id} value={role.id.toString()}>
                                        {role.name} ({role.user_type})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="button" variant="outline" onClick={() => setIsAssignRoleDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit">Assign Role</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>User Type</TableHead>
                        <TableHead>Assigned Roles</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
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
                              {user.roles.map((role) => (
                                <span key={role.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                  {role.name}
                                </span>
                              ))}
                              {user.roles.length === 0 && (
                                <span className="text-gray-500 text-sm">No roles assigned</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => {
                                setSelectedUser(user);
                                setIsAssignRoleDialogOpen(true);
                              }}>
                                <Plus className="h-4 w-4 mr-1" />
                                Role
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => {
                                // In a real app, you would show a confirmation dialog
                                toast({
                                  title: "Roles removed",
                                  description: `All roles have been removed from ${user.first_name} ${user.last_name}.`,
                                });
                              }}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredUsers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No users found. Try adjusting your search or filters.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  {/* Pagination would go here in a real application */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Role Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Role Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="font-medium">Admin Roles</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-manduSecondary">
                      {mockRoles.filter(r => r.user_type === 'admin').length}
                    </span>
                    <span className="text-sm text-grayColor ml-1">
                      roles
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="font-medium">Employer Roles</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-manduSecondary">
                      {mockRoles.filter(r => r.user_type === 'employer').length}
                    </span>
                    <span className="text-sm text-grayColor ml-1">
                      roles
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="font-medium">Jobseeker Roles</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-manduSecondary">
                      {mockRoles.filter(r => r.user_type === 'jobseeker').length}
                    </span>
                    <span className="text-sm text-grayColor ml-1">
                      roles
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                <UserCog className="h-5 w-5 mr-2" />
                Permission Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from(new Set(mockPermissions.map(p => p.module))).map((module, index) => (
                  <div key={module} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index % 5 === 0 ? 'bg-blue-500' :
                        index % 5 === 1 ? 'bg-green-500' :
                        index % 5 === 2 ? 'bg-amber-500' :
                        index % 5 === 3 ? 'bg-red-500' :
                        'bg-indigo-500'
                      }`}></div>
                      <span className="font-medium">{module}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-manduSecondary">
                        {mockPermissions.filter(p => p.module === module).length}
                      </span>
                      <span className="text-sm text-grayColor ml-1">
                        permissions
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-manduSecondary mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-manduSecondary/20 hover:bg-manduSecondary/5"
              onClick={() => setIsAddRoleDialogOpen(true)}
            >
              <Shield className="h-6 w-6 text-manduCustom-secondary-blue" />
              <span>Create New Role</span>
              <span className="text-xs text-grayColor">Define access levels</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-manduSecondary/20 hover:bg-manduSecondary/5"
              onClick={() => setIsAddPermissionDialogOpen(true)}
            >
              <UserCog className="h-6 w-6 text-manduCustom-secondary-blue" />
              <span>Add Permission</span>
              <span className="text-xs text-grayColor">Create new capabilities</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-manduSecondary/20 hover:bg-manduSecondary/5"
              onClick={() => setIsAssignRoleDialogOpen(true)}
            >
              <Users className="h-6 w-6 text-manduCustom-secondary-blue" />
              <span>Assign User Role</span>
              <span className="text-xs text-grayColor">Manage user access</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-manduSecondary/20 hover:bg-manduSecondary/5"
              onClick={() => router.push("/admin/settings/permissions")}
            >
              <Building className="h-6 w-6 text-manduCustom-secondary-blue" />
              <span>Permission Settings</span>
              <span className="text-xs text-grayColor">Configure defaults</span>
            </Button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-manduSecondary/5 to-manduCustom-secondary-blue/5 rounded-lg">
          <h3 className="text-lg font-semibold text-manduSecondary mb-2">Understanding Roles & Permissions</h3>
          <p className="text-gray-600 mb-4">
            Roles define what users can do in the system. Each role contains a set of permissions that grant access to specific features.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-manduSecondary mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Roles
              </h4>
              <p className="text-sm text-gray-600">
                Roles are collections of permissions assigned to users. They define the level of access a user has in the system.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-manduSecondary mb-2 flex items-center">
                <UserCog className="h-4 w-4 mr-2" />
                Permissions
              </h4>
              <p className="text-sm text-gray-600">
                Permissions are individual capabilities that allow users to perform specific actions within the system.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-manduSecondary mb-2 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                User Assignment
              </h4>
              <p className="text-sm text-gray-600">
                Assign roles to users to grant them the permissions they need to perform their tasks in the system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RolesPermissionsPage;

