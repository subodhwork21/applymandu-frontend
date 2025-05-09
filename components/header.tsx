"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { MenuIcon } from "./ui/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  LogOut,
  Settings,
  User,
  Briefcase,
  BookMarked,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import RegisterModal from "./register-modal";
import { usePathname } from "next/navigation";
import { isActivePath, navigationItems, routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import AuthSkeleton from "./ui/auth-skeleton";
import MessageModal from "./message-modal";
import { employerToken, jobSeekerToken } from "@/lib/tokens";
import { toast } from "react-toastify";
import { initializeEcho } from "@/lib/echo-setup";
import { useRouter } from "next/navigation";

interface ChatPreview {
  id: number;
  user_id: number;
  name: string;
  position: string;
  avatar: string;
  last_message: string;
  unread_count: number;
  updated_at: string;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    user,
    isAuthenticated,
    isEmployer,
    logout,
    isLoading,
    openLoginModal,
    openRegisterModal,
  } = useAuth();

  const pathName = usePathname();
  const isActive = pathName;
  
  // Chat notifications state
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<{
    id: string;
    name: string;
    position: string;
    avatar: string;
  } | null>(null);

 


  const fetchChatPreviews = useCallback(async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}api/chats/previews`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jobSeekerToken() || employerToken()}`
        }
      });
  
      const data = await response.json();
      
      if (data.success) {
        setChats(data.data);
        // Calculate total unread messages
        const unreadCount = data.data.reduce((total: number, chat: ChatPreview) => 
          total + chat.unread_count, 0);
        setTotalUnread(unreadCount);
      }
    } catch (error) {
      console.error("Error fetching chat previews:", error);
    }
  }, []);
  // Fetch chat previews
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      
      // Initial data fetch
      fetchChatPreviews();
      // Set up Echo listener for new messages
      if (window.Echo) {
        const channel = window.Echo.private(`user.${user?.id}.messages`);
        channel.listen('NewChatMessage', ( ) => {

          fetchChatPreviews();
        });
        
        // Add error handling
        channel.error(() => {
        });
      }
      
      // Clean up function
      return () => {
        if (window.Echo) {
          console.log(`Leaving channel user.${user?.id}.messages`);
          window.Echo.leave(`user.${user?.id}.messages`);
        }
      };
    }
  }, [isAuthenticated, user?.id]);

 

  const handleOpenMessageModal = (chat: ChatPreview) => {
    setSelectedChat({
      id: chat.user_id.toString(),
      name: chat.name,
      position: chat.position || "User",
      avatar: chat.avatar || "",
    });
    setIsMessageModalOpen(true);
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto 2xl:px-4 px-16 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center cursor-pointer">
              <div className="text-3xl">
                <span className="text-black">Apply</span>
                <span className="text-neutral-800">mandu</span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "text-sm hover:text-neutral-900 cursor-pointer transition-colors",
                  isActivePath(
                    pathName,
                    item.path,
                    item.path === routes.home
                  ) && "font-bold text-neutral-900"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {
            isLoading ? <AuthSkeleton/>: 
            isAuthenticated  ? (
              <>
                {/* Messages Dropdown */}
          { pathName.includes("dashboard") &&     <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <MessageCircle className="h-5 w-5 text-neutral-600" />
                      {totalUnread > 0 && (
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {totalUnread > 9 ? '9+' : totalUnread}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold">Messages</p>
                        <Link href="/dashboard/messages">
                          <Button
                            variant="ghost"
                            className="h-auto p-0 text-xs text-neutral-600 hover:text-neutral-900"
                          >
                            View all
                          </Button>
                        </Link>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-96 overflow-auto">
                      {chats.length === 0 ? (
                        <div className="p-4 text-center text-sm text-neutral-500">
                          No messages yet
                        </div>
                      ) : (
                        chats.map((chat) => (
                          <DropdownMenuItem 
                            key={chat.id} 
                            className="flex items-start p-4 cursor-pointer"
                            onClick={() => handleOpenMessageModal(chat)}
                          >
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={chat.avatar} alt={chat.name} />
                                <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {chat.unread_count > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  {chat.unread_count}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 ml-3">
                              <div className="flex justify-between">
                                <p className="text-sm font-medium">{chat.name}</p>
                                <p className="text-xs text-neutral-500">
                                  {formatMessageTime(chat.updated_at)}
                                </p>
                              </div>
                              <p className="text-xs text-neutral-500 mt-1 truncate">
                                {chat.last_message}
                              </p>
                            </div>
                          </DropdownMenuItem>
                        ))
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>}

                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5 text-neutral-600" />
                      <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        3
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold">Notifications</p>
                        <Button
                          variant="ghost"
                          className="h-auto p-0 text-xs text-neutral-600 hover:text-neutral-900"
                        >
                          Mark all as read
                        </Button>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-96 overflow-auto">
                      <DropdownMenuItem className="flex items-start p-4 cursor-pointer">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <Briefcase className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            New job match found
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            Senior Developer position at TechCorp matches your
                            profile
                          </p>
                          <p className="text-xs text-neutral-400 mt-2">
                            2 hours ago
                          </p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-start p-4 cursor-pointer">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <BookMarked className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Application viewed
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            Your application for Product Designer at DesignCo
                            was viewed 8
                          </p>
                          <p className="text-xs text-neutral-400 mt-2">
                            1 day ago
                          </p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-start p-4 cursor-pointer">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <CreditCard className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Subscription renewed
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            Your premium subscription has been renewed
                            successfully
                          </p>
                          <p className="text-xs text-neutral-400 mt-2">
                            2 days ago
                          </p>
                        </div>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="p-4 cursor-pointer">
                      <Link
                        href="/notifications"
                        className="text-sm text-center w-full text-neutral-600 hover:text-neutral-900"
                      >
                        View all notifications
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Profile Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 h-auto p-1"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.image_path}
                          alt={user?.first_name}
                        />
                        <AvatarFallback>{user?.first_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-neutral-800">
                        {user?.first_name ? user?.first_name + " " + user?.last_name : user?.company_name} 
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-xs leading-none text-neutral-600">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {
                        isEmployer ? (
                          <Link href="/dashboard/employer">
                            <DropdownMenuItem>
                              <span>Employer</span>
                            </DropdownMenuItem>
                          </Link>
                        ) : (
                          <Link href="/dashboard/jobseeker/">
                            <DropdownMenuItem>
                              <span>Dashboard</span>
                            </DropdownMenuItem>
                          </Link>
                        )
                      }
                      {
                        isEmployer ?   <Link href="/dashboard/employer/applications">
                        <DropdownMenuItem>
                          <span>My Applications</span>
                        </DropdownMenuItem>
                      </Link> :   <Link href="/dashboard/jobseeker/applications">
                        <DropdownMenuItem>
                          <span>My Applications</span>
                        </DropdownMenuItem>
                      </Link>
                      }
                    
                      <Link href="/dashboard/jobseeker/saved">
                        <DropdownMenuItem>
                          <span>Saved Jobs</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/dashboard/jobseeker/settings">
                        <DropdownMenuItem>
                          <span>Settings</span>
                        </DropdownMenuItem>
                      </Link>
                      {isEmployer ? (
                        <p onClick={() => openRegisterModal(false)}>
                          <DropdownMenuItem>
                            <span>Sign up as JobSeeker</span>
                          </DropdownMenuItem>
                        </p>
                      ) : (
                        <p onClick={() => openRegisterModal(true)}>
                          <DropdownMenuItem>
                            <span>Sign up as Employer</span>
                          </DropdownMenuItem>
                        </p>
                      )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  className="hidden md:flex bg-black text-white hover:bg-neutral-800"
                  onClick={openLoginModal}
                >
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  className="hidden md:flex bg-white border-neutral-200 hover:bg-neutral-50"
                  onClick={() => openRegisterModal(false)}
                >
                  Register
                </Button>
              </>
            )}
            <button
              className="md:hidden text-neutral-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 bg-white border-t border-neutral-200 mt-3">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "text-sm hover:text-neutral-900 cursor-pointer px-2 py-1",
                    isActivePath(
                      pathName,
                      item.path,
                      item.path === routes.home
                    ) && "font-bold text-neutral-900"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              {isLoading ? (
                <AuthSkeleton/>
              ) : !isAuthenticated && (
                <div className="flex space-x-4 pt-2">
                  <Button
                    className="flex-1 bg-black text-white hover:bg-neutral-800"
                    onClick={openLoginModal}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-white border-neutral-200 hover:bg-neutral-50"
                    onClick={() => openRegisterModal(false)}
                  >
                    Register
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
      
      {/* Message Modal */}
      {selectedChat && (
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={() => {
            setIsMessageModalOpen(false);
            // Refresh chat previews after closing modal to update unread counts
            fetchChatPreviews();
          }}
          candidate={selectedChat}
        />
      )}
    </header>
  );
};

export default Header;
