"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { baseFetcher } from "./fetcher";
import {
  getCookie,
  getCookies,
  setCookie,
  deleteCookie,
  hasCookie,
  useGetCookies,
  useSetCookie,
  useHasCookie,
  useDeleteCookie,
  useGetCookie,
} from 'cookies-next/client';
import { toast } from "react-toastify";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  image_path?: string;
  experiences?: [],
  position_title?: string;

}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isEmployer: boolean;
  isLoginModalOpen: boolean;
  openRegisterModal: (isEmployer?: boolean) => void;
  isLoading: boolean;
  closeRegisterModal: () => void;
  isRegisterModalOpen: boolean;
  openForgotPasswordModal: () => void;
  closeForgotPasswordModal: () => void;
  isForgotPasswordModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
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
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {toast} = useToast();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isEmployer, setIsEmployer] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);

    const [isLoading, setIsLoading] = useState(true);
  const login = async (email: string, password: string) => {

    const {response, result} = await baseFetcher('api/login', {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password
      })
    });


    if(response?.ok){

      setCookie('JOBSEEKER_TOKEN', result?.token);
      setUser({
        id: result?.user?.id,
        email: result?.user?.email,
        first_name: result?.user?.first_name,
        last_name: result?.user?.last_name,
        image_path: result?.user?.image_path,
        position_title: result?.user?.experiences[0]?.position_title
      })
      setIsEmployer(result?.is_employer);
      toast({
        title: "Success",
        description: result?.message,
      });
      closeLoginModal();
    }
    else{
        throw new Error("Invalid credentials");
    }
  };

  const fetchUserByToken = async(token: string) =>{

    const {response, result, error} = await baseFetcher("api/login-with-token", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    })




    if(response?.status === 200){
      setUser({
        id: result?.data?.id,
        email: result?.data?.email,
        first_name: result?.data?.first_name,
        last_name: result?.data?.last_name,
        image_path: result?.data?.image_path,
        position_title: result?.data?.experiences[0]?.position_title
      })
      setIsEmployer(result?.is_employer);
      setIsLoading(false);
    }
    else{
      deleteCookie('JOBSEEKER_TOKEN');
      setUser(null);
      setIsLoading(false);
      router.push("/")
      // throw new Error("Invalid token");
      

    }
  }

  const logout = () => {
    setUser(null);
    deleteCookie('JOBSEEKER_TOKEN');
    toast({
      title: "Success!",
      description: "Logout successful",
      variant: "default", 
      className: "bg-blue"
    });
    router.push("/")
  closeLoginModal();
  };

  const openLoginModal = () => {
    setIsRegisterModalOpen(false);
    setIsForgotPasswordModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = (employer=false) => {
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

  const token = getCookie('JOBSEEKER_TOKEN');

  useEffect(()=>{
    if(token){
      fetchUserByToken(token);
    }
  }, [token])

  useEffect(()=>{
    setIsLoading(false);
  },[])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
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
