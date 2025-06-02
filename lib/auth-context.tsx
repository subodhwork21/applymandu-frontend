"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { baseFetcher } from "./fetcher";
import {
  getCookie,
  getCookies,
  setCookie,
  deleteCookie,
  hasCookie,
} from "cookies-next";
import { toast } from "react-toastify";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  phone?: string;
  image_path?: string;
  experiences?: [];
  position_title?: string;
  two_fa_enabled?: boolean;
}

interface AdminUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  image_path?: string;
  role: 'admin';
}

interface TwoFactorSession {
  qr_code: string;
  verification_url: string;
  token: string;
  expires_at: string;
  email: string;
  secret: string;
}

interface AuthContextType {
  user: User | null;
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void | { requires2FA: boolean, email: string }>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  adminLogout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isEmployer: boolean | null;
  isLoginModalOpen: boolean;
  openRegisterModal: () => void;
  isLoading: boolean;
  closeRegisterModal: () => void;
  isRegisterModalOpen: boolean;
  openForgotPasswordModal: () => void;
  closeForgotPasswordModal: () => void;
  isForgotPasswordModalOpen: boolean;
  // New 2FA related states and functions
  twoFactorSession: TwoFactorSession | null;
  isTwoFactorModalOpen: boolean;
  openTwoFactorModal: () => void;
  closeTwoFactorModal: () => void;
  verifyTwoFactorCode: (code: string) => Promise<void>;
  generateTwoFactorSession: (email: string, token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  adminUser: null,
  isAuthenticated: false,
  isAdminAuthenticated: false,
  login: async () => {},
  adminLogin: async () => {},
  logout: () => {},
  adminLogout: () => {},
  openLoginModal: () => {},
  closeLoginModal: () => {},
  isEmployer: false,
  isLoginModalOpen: false,
  openRegisterModal: () => {},
  isLoading: false,
  closeRegisterModal: () => {},
  isRegisterModalOpen: false,
  openForgotPasswordModal: () => {},
  closeForgotPasswordModal: () => {},
  isForgotPasswordModalOpen: false,
  // New 2FA related states and functions
  twoFactorSession: null,
  isTwoFactorModalOpen: false,
  openTwoFactorModal: () => {},
  closeTwoFactorModal: () => {},
  verifyTwoFactorCode: async () => {},
  generateTwoFactorSession: async () => {},
});

// Helper function to get admin token
export function adminToken(): string {
  if (typeof window !== 'undefined') {
    return getCookie("ADMIN_TOKEN") || "";
  }
  return "";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [token2fa ,setToken] = useState<string | null>(null);
  const [isEmployer, setIsEmployer] = useState<boolean | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);
  const [twoFactorSession, setTwoFactorSession] = useState<TwoFactorSession | null>(null);
  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState(false);
  const [pendingLoginEmail, setPendingLoginEmail] = useState<string | null>(null);
  const [pendingLoginPassword, setPendingLoginPassword] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // Regular user login
  const login = async (email: string, password: string) => {
    const { response, result, errors, message } = await baseFetcher(
      "api/login",
      {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );

    if (response?.ok) {
      if(result?.two_fa === true){
         setPendingLoginEmail(email);
        setPendingLoginPassword(password);
        
        // Generate 2FA session
        await generateTwoFactorSession(email, result?.token);
        setToken(result?.token);
        
        // Return info that 2FA is required
        return { requires2FA: true, email };
      }
      if(result?.is_employer === true){

        setCookie("EMPLOYER_TOKEN", result?.token);
      }
      else{
        setCookie("JOBSEEKER_TOKEN", result?.token);
      }
      setUser({
        id: result?.user?.id,
        email: result?.user?.email,
        first_name: result?.user?.first_name,
        last_name: result?.user?.last_name,
        image_path: result?.user?.image_path,
        // position_title: result?.user?.experiences[0]?.position_title
      });
      setIsEmployer(result?.is_employer);
      toast({
        title: "Success",
        description: result?.message,
      });
      closeLoginModal();
    } else {
      throw new Error(errors || result?.message);
    }
  };

  // Admin login
  const adminLogin = async (email: string, password: string) => {
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
      deleteCookie("JOBSEEKER_TOKEN");
      deleteCookie("EMPLOYER_TOKEN");
      setCookie("ADMIN_TOKEN", result?.token);
      setAdminUser({
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
      
      router.push("/admin");
    } else {
      throw new Error(errors || result?.message || "Admin login failed");
    }
  };

  const generateTwoFactorSession = async (email: string, token: string) => {
    try {
      const { response, result } = await baseFetcher(
        "api/2fa/generate",
        {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },  
        }
      );

      if (response?.ok && result) {
        setTwoFactorSession({
          qr_code: result.qr_code,
          verification_url: result.verification_url,
          token: result.token,
          expires_at: result.expires_at,
          email: email,
          secret: result?.secret_key

        });
        openTwoFactorModal();
      } else {
        toast({
          title: "Error",
          description: "Failed to generate 2FA session",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const openTwoFactorModal = () => setIsTwoFactorModalOpen(true);
  const closeTwoFactorModal = () => setIsTwoFactorModalOpen(false);

  const fetchUserByToken = async (token: string, adminToken: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/login-with-token`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response?.json();
    if (response?.status === 200) {
      if(adminToken != null){
        deleteCookie("JOBSEEKER_TOKEN");
        deleteCookie("EMPLOYER_TOKEN");
        setCookie("IMP_TOKEN", result?.token);
         setIsEmployer(result?.is_employer);
        setIsLoading(false);
       result?.is_employer === true ?  setUser({
          id: result?.data?.id,
          email: result?.data?.email,
          image_path: result?.data?.image_path,
          company_name: result?.data?.company_name,
        }) :  setUser({
          id: result?.data?.id,
          email: result?.data?.email,
          first_name: result?.data?.first_name,
          last_name: result?.data?.last_name,
          image_path: result?.data?.image_path,
          position_title: result?.data?.experiences[0]?.position_title,
        });
        return;
      }
      if (result?.is_employer === true) {
        deleteCookie("JOBSEEKER_TOKEN");
        setCookie("EMPLOYER_TOKEN", result?.token);
        setUser({
          id: result?.data?.id,
          email: result?.data?.email,
          image_path: result?.data?.image_path,
          company_name: result?.data?.company_name,
        });
        setIsEmployer(result?.is_employer);
        setIsLoading(false);
      } else {
        deleteCookie("EMPLOYER_TOKEN");
        setCookie("JOBSEEKER_TOKEN", result?.token);
        setUser({
          id: result?.data?.id,
          email: result?.data?.email,
          first_name: result?.data?.first_name,
          last_name: result?.data?.last_name,
          image_path: result?.data?.image_path,
          position_title: result?.data?.experiences[0]?.position_title,
        });
        setIsEmployer(result?.is_employer);
        setIsLoading(false);
      }
    } else {
      deleteCookie("JOBSEEKER_TOKEN");
      deleteCookie("EMPLOYER_TOKEN");
      setUser(null);
      setIsLoading(false);
      // router.push("/");
      // throw new Error("Invalid token");
    }
  };

  // Check admin token and fetch admin user data
  const checkAdminToken = async (token: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/admin/login-with-token`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response?.json();
      if (response.ok) {
        setAdminUser({
          id: result.data.id,
          email: result.data.email,
          first_name: result.data.first_name,
          last_name: result.data.last_name,
          image_path: result.data.image_path,
          role: 'admin'
        });
        setCookie("ADMIN_TOKEN", result?.token);
        setIsLoading(false);
        return true;
      }
      
      // If token is invalid, clear it
      // deleteCookie("ADMIN_TOKEN");
      // setAdminUser(null);
        setIsLoading(false);

      return false;
    } catch (error) {
        setIsLoading(false);

      console.error("Admin token check error:", error);
      // deleteCookie("ADMIN_TOKEN");
      setAdminUser(null);
      return false;
    }
  };

   const verifyTwoFactorCode = async (code: string) => {
    if (!twoFactorSession) {
      toast({
        title: "Error",
        description: "No active 2FA session",
        variant: "destructive",
      });
      return;
    }

    try {
      const { response, result } = await baseFetcher(
        "api/2fa/verify",
        {
          method: "POST",
          body: JSON.stringify({
            token: twoFactorSession.token,
            code: code,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token2fa}`,
          },
        }
      );

      if (response?.ok) {
        // If we have pending login credentials, complete the login process
        if (pendingLoginEmail && pendingLoginPassword) {
          await completeLoginAfter2FA();
        }

        setUser({
          id: result?.user?.id,
          email: result?.user?.email,
          first_name: result?.user?.first_name,
          last_name: result?.user?.last_name,
          image_path: result?.user?.image_path,
          two_fa_enabled: result?.user?.two_fa_enabled,
        });

        setIsEmployer(true);
        setCookie("EMPLOYER_TOKEN", result?.token);
        setIsLoading(false);
        closeLoginModal();

        
        toast({
          title: "Success",
          description: "Two-factor authentication successful",
        });
        
        closeTwoFactorModal();
        setTwoFactorSession(null);
      } else {
        toast({
          title: "Error",
          description: result?.message || "Invalid verification code",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const completeLoginAfter2FA = async () => {
    if (!pendingLoginEmail || !pendingLoginPassword) return;
    
    const { response, result, errors } = await baseFetcher(
      "api/login/complete-2fa",
      {
        method: "POST",
        body: JSON.stringify({
          email: pendingLoginEmail,
          password: pendingLoginPassword,
          token: twoFactorSession?.token,
        }),
      }
    );

    if (response?.ok) {
      setCookie("EMPLOYER_TOKEN", result?.token);
      setUser({
        id: result?.user?.id,
        email: result?.user?.email,
        first_name: result?.user?.first_name,
        last_name: result?.user?.last_name,
        image_path: result?.user?.image_path,
        two_fa_enabled: result?.user?.two_fa_enabled,
      });
      setIsEmployer(result?.is_employer);
      
      // Clear pending login info
      setPendingLoginEmail(null);
      setPendingLoginPassword(null);
      
      toast({
        title: "Success",
        description: "Login successful",
      });
      closeLoginModal();
    } else {
      toast({
        title: "Error",
        description: errors || result?.message,
        variant: "destructive",
      });
    }
  };

  // Regular user logout
  const logout = async() => {
   const {response, result, error} = await baseFetcher("api/logout", {
      method: "POST",
    });
    if(response?.ok){
       setUser(null);
    deleteCookie("JOBSEEKER_TOKEN");
    deleteCookie("EMPLOYER_TOKEN");
    toast({
      title: "Success!",
      description: "Logout successful",
      variant: "default",
      className: "bg-blue",
    });
    closeLoginModal();
      // router.push("/");
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

  // Admin logout
  const adminLogout = async() => {
    const {response, result, error} = await baseFetcher("api/admin/logout", {
      method: "POST",
    });
    
    if(response?.ok){
      setAdminUser(null);
      deleteCookie("ADMIN_TOKEN");
      
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

  const openLoginModal = () => {
    setIsRegisterModalOpen(false);
    setIsForgotPasswordModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => {
    setIsLoginModalOpen(false);
    setIsForgotPasswordModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const openForgotPasswordModal = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
    setIsForgotPasswordModalOpen(true);
  };

  const closeForgotPasswordModal = () => setIsForgotPasswordModalOpen(false);

  const token = getCookie("JOBSEEKER_TOKEN") || getCookie("EMPLOYER_TOKEN") || getCookie("IMP_TOKEN");
  const adminToken = getCookie("ADMIN_TOKEN");

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      // Check for regular user token
      if (token) {
        await fetchUserByToken(token, adminToken);
      }
      
     
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [token]);


  useEffect(()=>{
      setIsLoading(true);

    const checkAuth = async () => {

      if (adminToken) {
        await checkAdminToken(adminToken);
      }
      setIsLoading(false);
    }
    checkAuth();
  }, [adminToken])

  return (
    <AuthContext.Provider
      value={{
        user,
        adminUser,
        isAuthenticated: !!user,
        isAdminAuthenticated: !!adminUser,
        login,
        adminLogin,
        logout,
        adminLogout,
        openLoginModal,
        closeLoginModal,
        isEmployer,
        isLoading,
        isLoginModalOpen,
        openRegisterModal,
        closeRegisterModal,
        isRegisterModalOpen,
        openForgotPasswordModal,
        closeForgotPasswordModal,
        isForgotPasswordModalOpen,
        // New 2FA related states and functions
        twoFactorSession,
        isTwoFactorModalOpen,
        openTwoFactorModal,
        closeTwoFactorModal,
        verifyTwoFactorCode,
        generateTwoFactorSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
   
  return context;
}

// Legacy hook for admin auth - now uses the unified context
export function useAdminAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AuthProvider");
  }
  
  return {
    user: context.adminUser,
    isAuthenticated: context.isAdminAuthenticated,
    login: context.adminLogin,
    logout: context.adminLogout,
    isLoading: context.isLoading,
  };
}

