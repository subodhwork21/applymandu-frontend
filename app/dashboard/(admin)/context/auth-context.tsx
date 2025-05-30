"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { baseFetcher } from "@/lib/fetcher";

interface AdminUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  image_path?: string;
  role: 'admin';
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  isLoading: false,
});

// Helper function to get admin token
export function adminToken(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("ADMIN_TOKEN") || "";
  }
  return "";
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const { response, result, errors, message } = await baseFetcher(
      "api/admin/login",
      {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );

    if (response?.ok) {
      localStorage.setItem("ADMIN_TOKEN", result?.token);
      setUser({
        id: result?.user?.id,
        email: result?.user?.email,
        first_name: result?.user?.first_name,
        last_name: result?.user?.last_name,
        image_path: result?.user?.image_path,
        role: 'admin'
      });
      
      toast({
        title: "Success",
        description: result?.message || "Admin login successful",
      });
      
      router.push("/dashboard/admin");
    } else {
      throw new Error(errors || result?.message || "Admin login failed");
    }
  };

  const logout = async() => {
    const {response, result, error} = await baseFetcher("api/admin/logout", {
      method: "POST",
    });
    
    if(response?.ok){
      setUser(null);
      localStorage.removeItem("ADMIN_TOKEN");
      
      toast({
        title: "Success!",
        description: "Logout successful",
        variant: "default",
        className: "bg-blue",
      });
      
      router.push("/admin/login");
    }
    else{
      toast({
        title: "Error!",
        description: "Something went wrong",
        variant: "destructive",
        className: "bg-red",
      });
    }
  };

  // Check admin token and fetch user data
  const checkAdminToken = async (token: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/admin/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response?.json();
      if (response.ok && result.success) {
        setUser({
          id: result.data.id,
          email: result.data.email,
          first_name: result.data.first_name,
          last_name: result.data.last_name,
          image_path: result.data.image_path,
          role: 'admin'
        });
        setIsLoading(false);
        return true;
      }
      
      // If token is invalid, clear it
      localStorage.removeItem("ADMIN_TOKEN");
      setUser(null);
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Admin token check error:", error);
      localStorage.removeItem("ADMIN_TOKEN");
      setUser(null);
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      // Check for admin token
      const adminTokenValue = adminToken();
      if (adminTokenValue) {
        await checkAdminToken(adminTokenValue);
      } else {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
   
  return context;
}
