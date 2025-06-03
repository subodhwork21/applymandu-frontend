"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash, 
  Save, 
  X, 
  MoreHorizontal,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import useSWR from "swr";
import { baseFetcher, defaultFetcher, defaultFetcherAdmin } from "@/lib/fetcher";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Loader2 } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  blogs_count: number;
  created_at: string;
  updated_at: string;
}

interface CategoriesResponse {
  data: Category[];
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta?: {
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

const AdminBlogCategoriesPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [categoryForm, setCategoryForm] = useState({
    id: 0,
    name: "",
    description: "",
  });

  const { data: categoriesResponse, mutate } = useSWR<CategoriesResponse>(
    "api/admin/blog-categories",
    defaultFetcherAdmin
  );

  const { data: stats } = useSWR<Record<string, any>>(
    "api/admin/blogs/categories/stats", 
    defaultFetcher
  );

  const handleAddCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { response, result, errors } = await baseFetcher("api/admin/blogs/categories", {
        method: "POST",
        body: JSON.stringify({
          name: categoryForm.name,
          description: categoryForm.description,
        }),
      });

      if (response?.ok) {
        toast({
          title: "Success",
          description: result.message || "Category added successfully",
        });
        setIsAddCategoryDialogOpen(false);
        setCategoryForm({ id: 0, name: "", description: "" });
        mutate();
      } else {
        toast({
          title: "Error",
          description: errors || "Something went wrong",
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
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { response, result, errors } = await baseFetcher(`api/admin/blogs/categories/${categoryForm.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: categoryForm.name,
          description: categoryForm.description,
        }),
      });

      if (response?.ok) {
        toast({
          title: "Success",
          description: result.message || "Category updated successfully",
        });
        setIsEditCategoryDialogOpen(false);
        setCategoryForm({ id: 0, name: "", description: "" });
        mutate();
      } else {
        toast({
          title: "Error",
          description: errors || "Something went wrong",
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
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategoryId) return;
    
    setIsSubmitting(true);

    try {
      const { response, result, errors } = await baseFetcher(`api/admin/blogs/categories/${selectedCategoryId}`, {
        method: "DELETE",
      });
      
      if (response?.ok) {
        toast({
          title: "Success",
          description: result.message || "Category deleted successfully",
        });
        setIsDeleteDialogOpen(false);
        mutate();
      } else {
        toast({
          title: "Error",
          description: errors || "Something went wrong",
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
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (category: Category) => {
    setCategoryForm({
      id: category.id,
      name: category.name,
      description: category.description,
    });
    setIsEditCategoryDialogOpen(true);
  };

  const confirmDelete = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setIsDeleteDialogOpen(true);
  };

  // Filter categories based on search query
  const filteredCategories = categoriesResponse?.data.filter((category) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query)
      );
    }
    return true;
  }) || [];

  if (!categoriesResponse) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-manduPrimary" />
      </div>
    );
  }

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.push("admin/blogs")}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl text-manduSecondary font-nasalization">Blog Categories</h1>
          </div>
          <Button
            className="bg-manduPrimary text-white hover:bg-neutral-800 w-full sm:w-auto"
            onClick={() => {
              setCategoryForm({ id: 0, name: "", description: "" });
              setIsAddCategoryDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Category
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 md:grid-cols-3 gap-6">
          <div className="lg:col-span-4 md:col-span-2">
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-[#E5E7EB]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    type="text"
                    placeholder="Search categories..."
                    className="pl-10 w-full md:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredCategories.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500">
                    No categories found matching your criteria.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Blogs</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Created</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCategories.map((category) => (
                          <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-4 text-sm font-medium text-gray-900">
                              {category.name}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">
                              {category.description || "No description"}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                              <Badge variant="outline" className="bg-[#f1f1f1b2] text-manduBorder">
                                {category.blogs_count} blogs
                              </Badge>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                              {format(new Date(category.created_at), "MMM dd, yyyy")}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-5 w-5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => router.push(`/blog/category/${category.slug}`)}>
                                    View Blogs
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openEditDialog(category)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => confirmDelete(category.id)}
                                  >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Pagination - if your API supports it */}
              {categoriesResponse.meta && categoriesResponse.meta.last_page > 1 && (
                <div className="flex justify-center mt-6 overflow-x-auto">
                  <div className="flex flex-wrap space-x-1">
                    {categoriesResponse.meta.links.map((link, i) => (
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
                              router.push(`admin/blogs/categories?page=${page}`, {
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
                  Categories Overview
                </h2>
              </div>
              <CardContent className="p-[10px_30px]">
                <div className="flex flex-col gap-[26px]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">Total Categories</span>
                    <span className="text-sm text-grayColor font-bold">
                      {categoriesResponse.data.length}
                    </span>
                  </div>
                  {stats && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-grayColor font-normal leading-[21.4px]">Most Popular</span>
                        <span className="text-sm text-grayColor font-bold">
                          {stats.most_popular_category || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-grayColor font-normal leading-[21.4px]">Uncategorized Blogs</span>
                        <span className="text-sm text-grayColor font-bold">
                          {stats.uncategorized_blogs || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-grayColor font-normal leading-[21.4px]">Categories This Month</span>
                        <span className="text-sm text-grayColor font-bold">
                          {stats.categories_this_month || 0}
                        </span>
                      </div>
                    </>
                  )}
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
                    onClick={() => {
                      setCategoryForm({ id: 0, name: "", description: "" });
                      setIsAddCategoryDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Category
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-manduBorder hover:text-neutral-900"
                    onClick={() => router.push("/admin/blogs")}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Blogs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category for organizing blog posts.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                placeholder="Enter category description"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddCategoryDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddCategory}
              disabled={isSubmitting}
              className="bg-manduPrimary hover:bg-manduPrimary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input
                id="edit-name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                placeholder="Enter category description"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditCategoryDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditCategory}
              disabled={isSubmitting}
              className="bg-manduPrimary hover:bg-manduPrimary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
              Any blogs assigned to this category will be moved to "Uncategorized".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteCategory}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AdminBlogCategoriesPage;
