"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Plus,
  Edit,
  Trash,
  Eye,
  MoreHorizontal,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSWR from "swr";
import {
  baseFetcherAdmin,
  defaultFetcher,
  defaultFetcherAdmin,
} from "@/lib/fetcher";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminToken } from "@/lib/auth-context";
import { getCookies } from "cookies-next";

interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  image: string;
  image_path: string;
  author: string;
  status: string;
  created_at: string;
  updated_at: string;
  excerpt?: string;
  featured_image?: string;
  category_id?: number;
  category_name?: string;
  author_id?: number;
  author_name?: string;
  published_at?: string;
  views?: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  blogs_count?: number;
  created_at?: string;
  updated_at?: string;
}

interface BlogsResponse {
  articles: Blog[];
}

// Create Blog Modal Component
const CreateBlogModal = ({ isOpen, onClose, categories, mutate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      categories: [],
      status: "draft",
      author: "",
      image: undefined,
    },
  });

  const { register, handleSubmit, setValue, getValues, reset, watch, formState: { errors } } = form;
  
  // Watch the categories field to ensure it's always an array
  const watchedCategories = watch("categories");

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setImagePreview(null);
    }
  }, [isOpen, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPEG, PNG, JPG, GIF, or SVG image",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image size should not exceed 2MB",
          variant: "destructive",
        });
        return;
      }
      
      setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSlug = () => {
    const title = getValues("title");
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");
      setValue("slug", slug);
    }
  };

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    // Ensure categories is always an array
    let currentCategories = Array.isArray(watchedCategories) ? watchedCategories : [];
    
    // If the category is already selected, remove it
    if (currentCategories.includes(value)) {
      currentCategories = currentCategories.filter(cat => cat !== value);
    } else {
      // Otherwise add it
      currentCategories.push(value);
    }
    
    setValue("categories", currentCategories);
  };

  const onSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!values.title) {
        toast({
          title: "Error",
          description: "Title is required",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      if (!values.content) {
        toast({
          title: "Error",
          description: "Content is required",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      if (!values.image) {
        toast({
          title: "Error",
          description: "Featured image is required",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      if (!values.author) {
        toast({
          title: "Error",
          description: "Author is required",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      if (!values.categories || values.categories.length === 0) {
        toast({
          title: "Error",
          description: "At least one category is required",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (key === "image" && value instanceof File) {
          formData.append(key, value);
        } else if (key === "categories" && Array.isArray(value)) {
          // Append each category as categories[]
          value.forEach((cat, index) => {
            formData.append(`categories[${index}]`, cat);
          });
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const { response, result, errors } = await baseFetcherAdmin(
        "api/admin/blog/store",
        {
          method: "POST",
          body: formData,
          headers: {
            "Authorization": `Bearer ${adminToken()}`,
          },
        }
      );

      if (response?.ok) {
        toast({
          title: "Success",
          description: result.message || "Blog created successfully",
        });
        mutate();
        onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Blog</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new blog post.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  placeholder="Enter blog title"
                  {...register("title", {
                    required: "Title is required",
                    maxLength: {
                      value: 255,
                      message: "Title must be less than 255 characters"
                    }
                  })}
                  onBlur={() => {
                    if (!getValues("slug")) {
                      generateSlug();
                    }
                  }}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content <span className="text-red-500">*</span></Label>
                <Textarea
                  id="content"
                  placeholder="Write your blog content here..."
                  className="min-h-[300px]"
                  {...register("content", {
                    required: "Content is required"
                  })}
                />
                {errors.content && (
                  <p className="text-sm text-red-500">{errors.content.message}</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <div className="flex gap-2">
                  <Input 
                    id="slug" 
                    placeholder="blog-post-slug" 
                    {...register("slug")}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateSlug}
                    className="shrink-0"
                  >
                    Generate
                  </Button>
                </div>
                {errors.slug && (
                  <p className="text-sm text-red-500">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Categories <span className="text-red-500">*</span></Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {categories?.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        value={category.id.toString()}
                        checked={watchedCategories?.includes(category.id.toString())}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="h-4 w-4 rounded border-gray-300 text-manduSecondary focus:ring-manduSecondary"
                      />
                      <label htmlFor={`category-${category.id}`} className="text-sm">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.categories && (
                  <p className="text-sm text-red-500">{errors.categories.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                <Select
                  onValueChange={(value) => setValue("status", value)}
                  defaultValue={getValues("status")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-500">{errors.status.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author <span className="text-red-500">*</span></Label>
                <Input
                  id="author"
                  placeholder="Author name"
                  {...register("author", {
                    required: "Author is required"
                  })}
                />
                {errors.author && (
                  <p className="text-sm text-red-500">{errors.author.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Featured Image <span className="text-red-500">*</span></Label>
                <div className="space-y-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">
                    Accepted formats: JPEG, PNG, JPG, GIF, SVG. Max size: 2MB.
                  </p>
                  {imagePreview && (
                    <div className="mt-2 relative w-full h-48 rounded-md overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImagePreview(null);
                          setValue("image", null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {errors.image && (
                  <p className="text-sm text-red-500">{errors.image.message}</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Blog"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


// Edit Blog Modal Component
const EditBlogModal = ({ isOpen, onClose, blog, categories, mutate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [imagePreview, setImagePreview] = useState<string | null>(
    blog?.image_path || null
  );

  const form = useForm({
    defaultValues: {
      title: blog?.title || "",
      slug: blog?.slug || "",
      content: blog?.content || "",
      categories: blog?.category_id?.toString() || "",
      status: blog?.status || "draft",
      author: blog?.author || "",
      image: undefined,
    },
  });

  const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = form;

  // Update form when blog changes
  useEffect(() => {
    if (blog) {
      reset({
        title: blog.title || "",
        slug: blog.slug || "",
        content: blog.content || "",
        categories: blog.category_id?.toString() || "",
        status: blog.status || "draft",
        author: blog.author || "",
        image: undefined,
      });
      setImagePreview(blog.image_path || null);
    }
  }, [blog, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSlug = () => {
    const title = getValues("title");
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");
      setValue("slug", slug);
    }
  };
  const onSubmit = async (values) => {
    if (!blog) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "image") {
          if (value instanceof File) {
            formData.append(key, value);
          }
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Add method for proper handling in Laravel
      formData.append('_method', 'PUT');

      const { response, result, errors } = await baseFetcherAdmin(`api/admin/blogs/${blog.id}`, {
        method: "POST", // Using POST with _method=PUT for file uploads
        body: formData,
      });

      if (response?.ok) {
        toast({
          title: "Success",
          description: result.message || "Blog updated successfully",
        });
        mutate();
        onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Blog</DialogTitle>
          <DialogDescription>
            Update the details of your blog post.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter blog title"
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 5,
                      message: "Title must be at least 5 characters"
                    }
                  })}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your blog content here..."
                  className="min-h-[300px]"
                  {...register("content", {
                    required: "Content is required",
                    minLength: {
                      value: 20,
                      message: "Content must be at least 20 characters"
                    }
                  })}
                />
                {errors.content && (
                  <p className="text-sm text-red-500">{errors.content.message}</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <div className="flex gap-2">
                  <Input 
                    id="slug" 
                    placeholder="blog-post-slug" 
                    {...register("slug", {
                      required: "Slug is required",
                      minLength: {
                        value: 5,
                        message: "Slug must be at least 5 characters"
                      }
                    })}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={generateSlug}
                    className="shrink-0"
                  >
                    Generate
                  </Button>
                </div>
                {errors.slug && (
                  <p className="text-sm text-red-500">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="categories">Category</Label>
                <Select
                  onValueChange={(value) => setValue("categories", value)}
                  value={getValues("categories")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("categories", {
                    required: "Category is required"
                  })}
                />
                {errors.categories && (
                  <p className="text-sm text-red-500">{errors.categories.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) => setValue("status", value)}
                  value={getValues("status")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("status", {
                    required: "Status is required"
                  })}
                />
                {errors.status && (
                  <p className="text-sm text-red-500">{errors.status.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  placeholder="Author name"
                  {...register("author", {
                    required: "Author is required",
                    minLength: {
                      value: 3,
                      message: "Author name must be at least 3 characters"
                    }
                  })}
                />
                {errors.author && (
                  <p className="text-sm text-red-500">{errors.author.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Featured Image</Label>
                <div className="space-y-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  {imagePreview && (
                    <div className="mt-2 relative w-full h-48 rounded-md overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImagePreview(null);
                          setValue("image", null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {errors.image && (
                  <p className="text-sm text-red-500">{errors.image.message}</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Blog"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Delete Blog Modal Component
const DeleteBlogModal = ({ isOpen, onClose, blog, mutate }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!blog) return;
    
    setIsDeleting(true);
    
    try {
      const { response, result, errors } = await baseFetcherAdmin(`api/admin/blogs/${blog.id}`, {
        method: "DELETE",
      });

      if (response?.ok) {
        toast({
          title: "Success",
          description: result.message || "Blog deleted successfully",
        });
        mutate();
        onClose();
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
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the blog post
            <span className="font-medium text-foreground"> "{blog?.title}"</span> and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Main Admin Blogs Page Component
const AdminBlogsPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  // Fetch blogs with filters
  const { data: blogsData, error: blogsError, isLoading: blogsLoading, mutate } = useSWR<BlogsResponse>(
    `api/admin/all-blogs?page=${currentPage}${searchTerm ? `&search=${searchTerm}` : ""}${
      selectedStatus ? `&status=${selectedStatus}` : ""
    }${selectedCategory ? `&category=${selectedCategory}` : ""}`,
    defaultFetcherAdmin
  );

  // Fetch categories for dropdowns
  const { data: categoriesData, error: categoriesError } = useSWR<Category[]>(
    "api/admin/blog-categories",
    defaultFetcherAdmin
  );

  // For debugging
  useEffect(() => {
    if (categoriesData) {
      console.log('Categories data:', categoriesData);
    }
    if (categoriesError) {
      console.error('Categories error:', categoriesError);
    }
  }, [categoriesData, categoriesError]);

  // Handle edit blog
  const handleEditBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsEditModalOpen(true);
  };

  // Handle delete blog
  const handleDeleteBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsDeleteModalOpen(true);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value === "all" ? null : value);
    setCurrentPage(1);
  };

  // Handle category filter change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === "all" ? null : value);
    setCurrentPage(1);
  };

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl text-manduSecondary font-nasalization">
            Blog Management
          </h1>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-manduSecondary hover:bg-manduSecondary/80"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Blog

           </Button>
        </div>

        {/* Filters section */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search blogs..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-40">
                  <Select
                    value={selectedStatus || "all"}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full sm:w-40">
                  <Select
                    value={selectedCategory || "all"}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categoriesData?.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blogs list */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {blogsLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-manduSecondary" />
              <p className="text-gray-500">Loading blogs...</p>
            </div>
          ) : blogsError ? (
            <div className="p-8 text-center">
              <p className="text-red-500">Error loading blogs. Please try again.</p>
            </div>
          ) : blogsData?.articles?.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No blogs found. Try adjusting your filters or create a new blog.</p>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 bg-manduSecondary hover:bg-manduSecondary/80"
              >
                <Plus className="mr-2 h-4 w-4" /> Add New Blog
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogsData?.articles?.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {blog.image_path ? (
                            <div className="flex-shrink-0 h-10 w-10 mr-3">
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={blog.image_path}
                                alt={blog.title}
                              />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 h-10 w-10 mr-3 bg-gray-200 rounded-md flex items-center justify-center">
                              <svg
                                className="h-6 w-6 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900">
                              {blog.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {blog.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {blog.categories[0]?.name || "Uncategorized"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {blog.author || "Unknown"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          className={
                            blog.status === "published"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          }
                        >
                          {blog.status === "published" ? "Published" : "Draft"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {blog.created_at
                          ? format(new Date(blog.created_at), "MMM d, yyyy")
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/blogs/${blog.id}`)}
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditBlog(blog)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteBlog(blog)}
                            title="Delete"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {blogsData?.articles && blogsData.articles.length > 0 && (
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {/* You would typically get total pages from API response */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={blogsData.articles.length < 10} // Assuming 10 items per page
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Modals */}
        <CreateBlogModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          categories={categoriesData || []}
          mutate={mutate}
        />
        
        {selectedBlog && (
          <>
            <EditBlogModal 
              isOpen={isEditModalOpen} 
              onClose={() => {
                setIsEditModalOpen(false);
                setSelectedBlog(null);
              }} 
              blog={selectedBlog}
              categories={categoriesData || []}
              mutate={mutate}
            />
            
            <DeleteBlogModal 
              isOpen={isDeleteModalOpen} 
              onClose={() => {
                setIsDeleteModalOpen(false);
                setSelectedBlog(null);
              }} 
              blog={selectedBlog}
              mutate={mutate}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default AdminBlogsPage;

