"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  UserCog,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { defaultFetcherAdmin } from "@/lib/fetcher";
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import DataNavigation from "@/components/ui/data-navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
}

interface ApiResponse {
  data: AdminUser[];
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
const mockAdminUsers: AdminUser[] = [
  {
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
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@applymandu.com",
    phone: "+977 9807654321",
    role: "Admin",
    status: "active",
    last_login: "2023-06-14T14:45:00",
    created_at: "2023-02-15T11:30:00",
    image_path: "https://github.com/shadcn.png",
  },
  {
    id: 3,
    first_name: "Robert",
    last_name: "Johnson",
    email: "robert.johnson@applymandu.com",
    phone: "+977 9812345678",
    role: "Manager",
    status: "active",
    last_login: "2023-06-10T09:15:00",
    created_at: "2023-03-20T09:45:00",
  },
  {
    id: 4,
    first_name: "Emily",
    last_name: "Williams",
    email: "emily.williams@applymandu.com",
    phone: "+977 9854321098",
    role: "Officer",
    status: "inactive",
    last_login: "2023-05-28T16:20:00",
    created_at: "2023-04-05T13:15:00",
    image_path: "https://github.com/shadcn.png",
  },
  {
    id: 5,
    first_name: "Michael",
    last_name: "Brown",
    email: "michael.brown@applymandu.com",
    phone: "+977 9867890123",
    role: "Content Editor",
    status: "active",
    last_login: "2023-06-13T11:10:00",
    created_at: "2023-04-18T14:30:00",
  },
];

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

const AdminUsersPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // In a real application, you would fetch this data from your API
  // const { data, isLoading, mutate } = useSWR<ApiResponse>(
  //   `api/admin/users?page=${currentPage}&search=${searchTerm}&role=${selectedRole || ''}&status=${selectedStatus || ''}`,
  //   defaultFetcherAdmin
  // );
  
  // For now, we'll use mock data
  const mockApiResponse: ApiResponse = {
    data: mockAdminUsers,
    meta: {
      current_page: 1,
      from: 1,
      last_page: 1,
      links: [],
      path: "",
      per_page: 10,
      to: mockAdminUsers.length,
      total: mockAdminUsers.length,
    },
  };
  
  const isLoading = false;
  const data = mockApiResponse;
  const mutate = () => console.log("Mutating data...");

  // Filter users based on search term, role, and status
  const filteredUsers = data?.data.filter((user) => {
    const matchesSearch = 
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole ? user.role === selectedRole : true;
    const matchesStatus = selectedStatus ? user.status === selectedStatus : true;
    
    return matchesSearch && matchesRole && matchesStatus;
  }) || [];

  // Handle user creation
  const handleCreateUser = (formData: FormData) => {
    // In a real application, you would send this data to your API
    console.log("Creating new user:", Object.fromEntries(formData));
    toast({
      title: "User created",
      description: "The admin user has been created successfully.",
    });
    setIsCreateDialogOpen(false);
    mutate(); // Refresh the data
  };

  // Handle user deletion
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    // In a real application, you would send a delete request to your API
    console.log("Deleting user:", selectedUser.id);
    toast({
      title: "User deleted",
      description: `${selectedUser.first_name} ${selectedUser.last_name} has been deleted.`,
    });
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
    mutate(); // Refresh the data
  };

  // Handle pagination
  const handlePageChange = (url: string) => {
    // Extract page number from URL
    const pageMatch = url.match(/page=(\d+)/);
    if (pageMatch && pageMatch[1]) {
      setCurrentPage(parseInt(pageMatch[1]));
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedRole(null);
    setSelectedStatus(null);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading admin users...</div>;
  }

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl text-manduSecondary font-nasalization">
            Admin Users
          </h1>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Admin User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Admin User</DialogTitle>
                <DialogDescription>
                  Add a new administrator to the system with specific role and permissions.
                </DialogDescription>
              </DialogHeader>
              <form action={handleCreateUser}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select name="role" required>
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
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                    <Input
                      id="password_confirmation"
                      name="password_confirmation"
                      type="password"
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="status" name="status" value="active" defaultChecked />
                    <Label htmlFor="status">Active Account</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create User</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-[1px] border-solid border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search by name, email, or phone..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-[200px] space-y-2">
                <Label>Role</Label>
                <Select 
                  value={selectedRole || "all"} 
                  onValueChange={(value) => setSelectedRole(value === "all" ? null : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {adminRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-[200px] space-y-2">
                <Label>Status</Label>
                <Select 
                  value={selectedStatus || "all"} 
                  onValueChange={(value) => setSelectedStatus(value === "all" ? null : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={resetFilters} className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Admin Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.image_path} />
                          <AvatarFallback>{user.first_name.charAt(0)}{user.last_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.first_name} {user.last_name}</p>
                          <p className="text-xs text-gray-500">Created {new Date(user.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === "Super Admin" ? "default" : "outline"} className={
                        user.role === "Super Admin" ? "bg-purple-100 text-purple-800 hover:bg-purple-100" :
                        user.role === "Admin" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                        user.role === "Manager" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                        user.role === "Officer" ? "bg-amber-100 text-amber-800 hover:bg-amber-100" :
                        "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-xs flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </p>
                        <p className="text-xs flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {user.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {user.status === "active" ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-600">Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-500 mr-1" />
                            <span className="text-red-600">Inactive</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(user.last_login).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/admin/users/permissions/${user.id}`)}>
                            <Shield className="h-4 w-4 mr-2" />
                            Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No admin users found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            {data?.meta && (
              <div className="mt-4">
                <DataNavigation
                  meta={data.meta}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Admin User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this admin user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedUser && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Avatar>
                    <AvatarImage src={selectedUser.image_path} />
                    <AvatarFallback>{selectedUser.first_name.charAt(0)}{selectedUser.last_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedUser.first_name} {selectedUser.last_name}</p>
                    <p className="text-xs text-gray-500">{selectedUser.email}</p>
                    <p className="text-xs text-gray-500">{selectedUser.role}</p>
                  </div>
                </div>
              )}
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

        {/* Admin User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-grayColor">Total Admins</p>
                  <h3 className="text-2xl font-bold text-manduSecondary mt-1">
                    {data?.data.length || 0}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Active admin users
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-grayColor">Super Admins</p>
                  <h3 className="text-2xl font-bold text-manduSecondary mt-1">
                    {data?.data.filter(user => user.role === "Super Admin").length || 0}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    With full access
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-grayColor">Active Users</p>
                  <h3 className="text-2xl font-bold text-manduSecondary mt-1">
                    {data?.data.filter(user => user.status === "active").length || 0}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Currently active
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-grayColor">Inactive Users</p>
                  <h3 className="text-2xl font-bold text-manduSecondary mt-1">
                    {data?.data.filter(user => user.status === "inactive").length || 0}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Currently inactive
                  </p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-manduSecondary/5 to-manduCustom-secondary-blue/5 rounded-lg">
          <h3 className="text-lg font-semibold text-manduSecondary mb-2">Managing Admin Users</h3>
          <p className="text-gray-600 mb-4">
            This page allows you to manage all administrator accounts in the Applymandu system. You can create, edit, and delete admin users, as well as manage their permissions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-manduSecondary mb-2 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Admin Roles
              </h4>
              <p className="text-sm text-gray-600">
                Different admin roles have different levels of access to the system. Super Admins have full access, while other roles have more limited permissions.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-manduSecondary mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Permissions
              </h4>
              <p className="text-sm text-gray-600">
                Each admin user can have specific permissions assigned to them. You can manage these permissions by clicking on "Manage Permissions" in the user actions menu.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-manduSecondary mb-2 flex items-center">
                <UserCog className="h-4 w-4 mr-2" />
                User Status
              </h4>
              <p className="text-sm text-gray-600">
                You can activate or deactivate admin users as needed. Inactive users cannot log in to the system until their accounts are reactivated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminUsersPage;
