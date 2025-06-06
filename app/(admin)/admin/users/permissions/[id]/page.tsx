"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  ArrowLeft,
  Save,
  Shield,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Info,
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
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define interfaces for admin users and permissions
interface AdminUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  status: "active" | "inactive";
  image_path?: string;
}

interface Permission {
  id: number;
  name: string;
  slug: string;
  description: string;
  module: string;
}

interface PermissionGroup {
  module: string;
  permissions: Permission[];
}

// Mock data for a single admin user
const mockAdminUser: AdminUser = {
  id: 1,
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@applymandu.com",
  phone: "+977 9801234567",
  role: "Super Admin",
  status: "active",
  image_path: "https://github.com/shadcn.png",
};

// Mock data for permissions
const mockPermissions: Permission[] = [
  // Jobs Module
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
    name: "Approve Jobs",
    slug: "approve-jobs",
    description: "Can approve job listings submitted by employers",
    module: "Jobs",
  },
  
  // Users Module
  {
    id: 6,
    name: "View Users",
    slug: "view-users",
    description: "Can view all users in the system",
    module: "Users",
  },
  {
    id: 7,
    name: "Create Users",
    slug: "create-users",
    description: "Can create new user accounts",
    module: "Users",
  },
  {
    id: 8,
    name: "Edit Users",
    slug: "edit-users",
    description: "Can edit user information",
    module: "Users",
  },
  {
    id: 9,
    name: "Delete Users",
    slug: "delete-users",
    description: "Can delete users from the system",
    module: "Users",
  },
  {
    id: 10,
    name: "Manage User Roles",
    slug: "manage-user-roles",
    description: "Can assign roles to users",
    module: "Users",
  },
  
  // Applications Module
  {
    id: 11,
    name: "View Applications",
    slug: "view-applications",
    description: "Can view job applications",
    module: "Applications",
  },
  {
    id: 12,
    name: "Process Applications",
    slug: "process-applications",
    description: "Can process and update application status",
    module: "Applications",
  },
  {
    id: 13,
    name: "Delete Applications",
    slug: "delete-applications",
    description: "Can delete job applications",
    module: "Applications",
  },
  
  // Reports Module
  {
    id: 14,
    name: "View Reports",
    slug: "view-reports",
    description: "Can view system reports",
    module: "Reports",
  },
  {
    id: 15,
    name: "Generate Reports",
    slug: "generate-reports",
    description: "Can generate new reports",
    module: "Reports",
  },
  {
    id: 16,
    name: "Export Reports",
    slug: "export-reports",
    description: "Can export reports to various formats",
    module: "Reports",
  },
  
  // Settings Module
  {
    id: 17,
    name: "View Settings",
    slug: "view-settings",
    description: "Can view system settings",
    module: "Settings",
  },
  {
    id: 18,
    name: "Edit Settings",
    slug: "edit-settings",
    description: "Can edit system settings",
    module: "Settings",
  },
  {
    id: 19,
    name: "Manage Email Templates",
    slug: "manage-email-templates",
    description: "Can manage system email templates",
    module: "Settings",
  },
  {
    id: 20,
    name: "Manage System Backups",
    slug: "manage-backups",
    description: "Can create and restore system backups",
    module: "Settings",
  },
];

// Mock user permissions (IDs of permissions the user has)
const mockUserPermissions = [1, 2, 3, 6, 8, 11, 14, 17];

const AdminUserPermissionsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const userId = parseInt(params.id);
  
  // In a real app, you would fetch the user data and permissions from your API
  // const { data: user, isLoading: userLoading } = useSWR<AdminUser>(
  //   `api/admin/users/${userId}`,
  //   defaultFetcherAdmin
  // );
  
  // For now, we'll use mock data
  const user = mockAdminUser;
  const userLoading = false;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [userPermissions, setUserPermissions] = useState<number[]>(mockUserPermissions);
  
  // Group permissions by module
  const groupedPermissions = mockPermissions.reduce<PermissionGroup[]>((groups, permission) => {
    const existingGroup = groups.find(group => group.module === permission.module);
    
    if (existingGroup) {
      existingGroup.permissions.push(permission);
    } else {
      groups.push({
        module: permission.module,
        permissions: [permission],
      });
    }
    
    return groups;
  }, []);
  
  // Filter permissions based on search term and selected module
  const filteredPermissionGroups = groupedPermissions
    .filter(group => !selectedModule || group.module === selectedModule)
    .map(group => ({
      ...group,
      permissions: group.permissions.filter(permission => 
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.description.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(group => group.permissions.length > 0);
  
  // Toggle a permission
  const togglePermission = (permissionId: number) => {
    if (userPermissions.includes(permissionId)) {
      setUserPermissions(userPermissions.filter(id => id !== permissionId));
    } else {
      setUserPermissions([...userPermissions, permissionId]);
    }
  };
  
  // Toggle all permissions in a module
  const toggleModulePermissions = (module: string, checked: boolean) => {
    const modulePermissionIds = mockPermissions
      .filter(permission => permission.module === module)
      .map(permission => permission.id);
    
    if (checked) {
      // Add all module permissions that aren't already in userPermissions
      const newPermissions = [...userPermissions];
      modulePermissionIds.forEach(id => {
        if (!newPermissions.includes(id)) {
          newPermissions.push(id);
        }
      });
      setUserPermissions(newPermissions);
    } else {
      // Remove all module permissions
      setUserPermissions(userPermissions.filter(id => !modulePermissionIds.includes(id)));
    }
  };
  
  // Check if all permissions in a module are selected
  const isModuleFullySelected = (module: string) => {
    const modulePermissionIds = mockPermissions
      .filter(permission => permission.module === module)
      .map(permission => permission.id);
    
    return modulePermissionIds.every(id => userPermissions.includes(id));
  };
  
  // Check if some permissions in a module are selected
  const isModulePartiallySelected = (module: string) => {
    const modulePermissionIds = mockPermissions
      .filter(permission => permission.module === module)
      .map(permission => permission.id);
    
    const selectedCount = modulePermissionIds.filter(id => userPermissions.includes(id)).length;
    return selectedCount > 0 && selectedCount < modulePermissionIds.length;
  };
  
  // Save permissions
  const savePermissions = () => {
    // In a real app, you would send the updated permissions to your API
    toast({
      title: "Permissions updated",
      description: `Permissions for ${user.first_name} ${user.last_name} have been updated.`,
    });
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedModule(null);
  };

  if (userLoading) {
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
              onClick={() => router.push(`/admin/users-management/${userId}`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl text-manduSecondary font-nasalization">
              Manage User Permissions
            </h1>
          </div>
          <Button 
            className="flex items-center gap-2"
            onClick={savePermissions}
          >
            <Save className="h-4 w-4" />
            Save Permissions
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="border-[1px] border-solid border-slate-200 shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={user.image_path} />
                <AvatarFallback>{user.first_name.charAt(0)}{user.last_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-bold">{user.first_name} {user.last_name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={
                    user.role === "Super Admin" ? "bg-purple-100 text-purple-800 hover:bg-purple-100" :
                    user.role === "Admin" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                    user.role === "Manager" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                    user.role === "Officer" ? "bg-amber-100 text-amber-800 hover:bg-amber-100" :
                    "bg-gray-100 text-gray-800 hover:bg-gray-100"
                  }>
                    {user.role}
                  </Badge>
                  {user.status === "active" ? (
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
              </div>
            </div>
          </CardContent>
        </Card>

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
                    placeholder="Search permissions..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-[200px] space-y-2">
                <Label>Module</Label>
                <Select 
                  value={selectedModule || "all"} 
                  onValueChange={(value) => setSelectedModule(value === "all" ? null : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Modules" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    {Array.from(new Set(mockPermissions.map(p => p.module))).map(module => (
                      <SelectItem key={module} value={module}>{module}</SelectItem>
                    ))}
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

        {/* Permissions */}
        <Card className="border-[1px] border-solid border-slate-200 shadow-sm mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              User Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredPermissionGroups.length > 0 ? (
                filteredPermissionGroups.map((group) => (
                  <Accordion key={group.module} type="single" collapsible className="border rounded-md">
                    <AccordionItem value={group.module}>
                      <AccordionTrigger className="px-4 py-2 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center h-5">
                            <Checkbox
                              id={`module-${group.module}`}
                              checked={isModuleFullySelected(group.module)}
                              indeterminate={isModulePartiallySelected(group.module)}
                              onCheckedChange={(checked) => 
                                toggleModulePermissions(group.module, checked === true)
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="data-[state=indeterminate]:bg-blue-600 data-[state=indeterminate]:text-white"
                            />
                          </div>
                          <Label 
                            htmlFor={`module-${group.module}`}
                            className="text-base font-medium cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {group.module}
                          </Label>
                          <Badge className="ml-2 bg-gray-100 text-gray-800 hover:bg-gray-100">
                            {group.permissions.length}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-0 pb-4">
                        <div className="space-y-2 mt-2">
                          {group.permissions.map((permission) => (
                            <div key={permission.id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-gray-50">
                              <Checkbox
                                id={`permission-${permission.id}`}
                                checked={userPermissions.includes(permission.id)}
                                onCheckedChange={() => togglePermission(permission.id)}
                              />
                              <div className="grid gap-1.5 leading-none">
                                <div className="flex items-center">
                                  <Label 
                                    htmlFor={`permission-${permission.id}`}
                                    className="font-medium cursor-pointer"
                                  >
                                    {permission.name}
                                  </Label>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{permission.description}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {permission.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No permissions found. Try adjusting your search or filters.
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button 
                className="flex items-center gap-2"
                onClick={savePermissions}
              >
                <Save className="h-4 w-4" />
                Save Permissions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Permission Summary */}
        <Card className="border-[1px] border-solid border-slate-200 shadow-sm mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Permission Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedPermissions.map((group) => (
                <div key={group.module} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-manduSecondary">{group.module}</h4>
                    <Badge className={
                      isModuleFullySelected(group.module) 
                        ? "bg-green-100 text-green-800" 
                        : isModulePartiallySelected(group.module)
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }>
                      {isModuleFullySelected(group.module) 
                        ? "Full Access" 
                        : isModulePartiallySelected(group.module)
                        ? "Partial Access"
                        : "No Access"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {group.permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center text-sm">
                        {userPermissions.includes(permission.id) ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                        )}
                        <span className={userPermissions.includes(permission.id) ? "" : "text-gray-500"}>
                          {permission.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-manduSecondary/5 to-manduCustom-secondary-blue/5 rounded-lg">
          <h3 className="text-lg font-semibold text-manduSecondary mb-2">Understanding Permissions</h3>
          <p className="text-gray-600 mb-4">
            Permissions control what actions {user.first_name} {user.last_name} can perform in the Applymandu system. You can grant or revoke specific permissions based on their role and responsibilities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-manduSecondary mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Module Permissions
              </h4>
              <p className="text-sm text-gray-600">
                You can select or deselect all permissions in a module by using the checkbox next to the module name.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-manduSecondary mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Permission Details
              </h4>
              <p className="text-sm text-gray-600">
                Hover over the info icon next to each permission to see a detailed description of what the permission allows.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-manduSecondary mb-2 flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Saving Changes
              </h4>
              <p className="text-sm text-gray-600">
                Don't forget to click the "Save Permissions" button after making changes to apply them to the user's account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminUserPermissionsPage;
