"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Plus, Edit, Trash, MoreHorizontal, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSWR from "swr";
import { baseFetcher, defaultFetcher } from "@/lib/fetcher";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Company {
  id: number;
  name: string;
  email: string;
  logo: string;
  website: string;
  industry: string;
  size: string;
  location: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

interface CompaniesResponse {
  data: Company[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

const AdminCompaniesPage = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const params = searchParams.toString();

  const { data: companiesResponse, mutate } = useSWR<CompaniesResponse>(
    `api/admin/companies?${params ? `${params}` : ""}`,
    defaultFetcher
  );

  const { data: stats } = useSWR<Record<string, any>>(
    "api/admin/companies/stats", 
    defaultFetcher
  );

  const handleToggleCompanyStatus = async (companyId: number) => {
    const { response, result, errors } = await baseFetcher(`api/admin/companies/${companyId}/toggle-status`, {
      method: "POST",
    });
    
    if (response?.ok) {
      toast({
        title: "Success",
        description: result.message || "Company status updated successfully",
      });
      mutate();
    } else {
      toast({
        title: "Error",
        description: errors || "Something went wrong",
      });
    }
  };

  const handleDeleteCompany = async () => {
    if (!selectedCompanyId) return;
    
    const { response, result, errors } = await baseFetcher(`api/admin/companies/${selectedCompanyId}`, {
      method: "DELETE",
    });
    
    if (response?.ok) {
      toast({
        title: "Success",
        description: result.message || "Company deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      mutate();
    } else {
      toast({
        title: "Error",
        description: errors || "Something went wrong",
      });
    }
  };

  const confirmDelete = (companyId: number) => {
    setSelectedCompanyId(companyId);
    setIsDeleteDialogOpen(true);
  };

  // Filter companies based on search query and filters
  const filteredCompanies = companiesResponse?.data.filter((company) => {
    if (statusFilter !== "all") {
      const companyStatus = company.status ? "active" : "inactive";
      if (statusFilter !== companyStatus) return false;
    }

    if (industryFilter !== "all" && company.industry !== industryFilter) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        company.name.toLowerCase().includes(query) ||
        company.email.toLowerCase().includes(query) ||
        company.location.toLowerCase().includes(query)
      );
    }

    return true;
  }) || [];

  if (!companiesResponse) {
    return <div className="p-8 text-center">Loading companies...</div>;
  }

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl text-manduSecondary font-nasalization">Manage Companies</h1>
          <Button
            className="bg-manduPrimary text-white hover:bg-neutral-800 w-full sm:w-auto"
            onClick={() => router.push("/dashboard/admin/companies/create")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Company
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 md:grid-cols-3 gap-6">
          <div className="lg:col-span-4 md:col-span-2">
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-[#E5E7EB]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex flex-col sm:flex-row md:flex-row space-y-4 sm:space-y-0 md:space-y-0 space-x-0 sm:space-x-4 md:space-x-4 w-full md:w-auto">
                  <Select 
                    defaultValue="all" 
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-full md:w-[180px] border border-grayText">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select 
                    defaultValue="all"
                    value={industryFilter}
                    onValueChange={setIndustryFilter}
                  >
                    <SelectTrigger className="w-full md:w-[180px] border border-grayText">
                      <SelectValue placeholder="All Industries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    type="text"
                    placeholder="Search companies..."
                    className="pl-10 w-full md:w-64"
                    value={searchQuery}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        let searchParam = new URLSearchParams(searchParams).toString();
                        searchParam = "";
                        searchParam += `search=${searchQuery}`;
                        router.push(`/dashboard/admin/companies?${searchParam}`, {
                          scroll: false,
                        });
                        mutate();
                      }
                    }}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4 flex flex-col gap-6">
                {filteredCompanies.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500">
                    No companies found matching your criteria.
                  </div>
                ) : (
                  filteredCompanies.map((company) => (
                    <Card 
                      key={company.id} 
                      className="w-full rounded-[15px] border-[0.5px] border-manduSecondary/30 shadow-[0px_2px_5px_#00000040]"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                              {company.logo ? (
                                <img 
                                  src={company.logo} 
                                  alt={company.name} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-manduPrimary text-white text-xl font-bold">
                                  {company.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <h2 className="font-['Poppins'] font-semibold text-manduPrimary text-xl leading-6">
                                {company.name}
                              </h2>
                              <p className="text-grayColor text-sm mt-1">{company.email}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="bg-[#f1f1f1b2] text-manduBorder">
                                  {company.industry}
                                </Badge>
                                <Badge variant="outline" className="bg-[#f1f1f1b2] text-manduBorder">
                                  {company.size}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Badge className={`${company.status ? "bg-[#14dc14]/10 text-[#006B24]" : "bg-red-100 text-manduSecondary"} font-semibold text-sm px-4 py-0.5 rounded-full`}>
                              {company.status ? "Active" : "Inactive"}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/companies/${company.id}`)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/companies/${company.id}/edit`)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleCompanyStatus(company.id)}>
                                  {company.status ? "Deactivate" : "Activate"}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => confirmDelete(company.id)}
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Pagination */}
              {companiesResponse.meta.last_page > 1 && (
                <div className="flex justify-center mt-6 overflow-x-auto">
                  <div className="flex flex-wrap space-x-1">
                    {companiesResponse.meta.links.map((link, i) => (
                      <Button
                        key={i}
                        variant={link.active ? "default" : "outline"}
                        size="sm"
                        disabled={!link.url}
                        className={link.active ? "bg-manduPrimary text-white" : ""}
                        onClick={() => {
                          if (link.url) {
                            const url = new URL(link.url);
                            const page = url.searchParams.get("page");

                            if (page) {
                              router.push(`/dashboard/admin/companies?page=${page}`, {
                                scroll: false,
                              });
                              mutate();
                            }
                          }
                        }}
                      >
                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 md:col-span-1 space-y-6">
            <Card className="w-full rounded-[15.54px] border-[1.94px] border-solid border-slate-200">
              <div className="bg-[#fcfcfc] rounded-t-[13px] border-t-[1.86px] border-r-[1.86px] border-l-[1.86px] border-slate-200 p-[13px_29px]">
                <h2 className="font-medium text-manduSecondary text-xl leading-[30px]">
                  Companies Overview
                </h2>
              </div>
              <CardContent className="p-[10px_30px]">
                <div className="flex flex-col gap-[26px]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">Active Companies</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.active_companies || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">Inactive Companies</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.inactive_companies || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">Total Companies</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.total_companies || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">New This Month</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.new_companies_this_month || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full rounded-[15.54px] border-[1.94px] border-solid border-slate-200">
              <div className="bg-[#fcfcfc] rounded-t-[13px] border-t-[1.86px] border-r-[1.86px] border-l-[1.86px] border-slate-200 p-[13px_29px]">
                <h2 className="font-medium text-manduSecondary text-xl leading-[30px]">
                  Quick Actions
                </h2>
              </div>
              <CardContent className="p-[10px_30px]">
                <div className="flex flex-col gap-[20px]">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-manduBorder hover:text-neutral-900"
                    onClick={() => router.push("/dashboard/admin/companies/create")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Company
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-manduBorder hover:text-neutral-900"
                    onClick={() => router.push("/dashboard/admin/companies/export")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Companies
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this company? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCompany}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AdminCompaniesPage;
