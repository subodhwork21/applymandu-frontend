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

interface User {
  id: string;
  email: string;
  name: string;
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
  closeRegisterModal: () => {},
  isRegisterModalOpen: false,
  openForgotPasswordModal: () => {},
  closeForgotPasswordModal: () => {},
  isForgotPasswordModalOpen: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {toast} = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isEmployer, setIsEmployer] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);

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
        name: result?.user?.name,
      })
      setIsEmployer(result?.is_employer);
      toast({
        title: "Success!",
        description: result?.message,
        variant: "default", 
        className: "bg-blue"
      });
      closeLoginModal();
    }
    else{
        throw new Error("Invalid credentials");
    }
  };

  const fetchUserByToken = async(token: string) =>{
    const {response, result} = await baseFetcher("api/login-with-token", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    })

    if(response?.ok){
      setUser({
        id: result?.data?.id,
        email: result?.data?.email,
        name: result?.data?.name,
      })
      setIsEmployer(result?.is_employer);
    }
    else{
      throw new Error("Invalid token");
      deleteCookie('JOBSEEKER_TOKEN');
      setUser(null);
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
