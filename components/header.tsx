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
  Calendar,
  MessageSquare,
  Verified,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import RegisterModal from "./register-modal";
import { usePathname } from "next/navigation";
import { isActivePath, navigationItems, routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import AuthSkeleton from "./ui/auth-skeleton";
import MessageModal from "./message-modal";
import { employerToken, jobSeekerToken } from "@/lib/tokens";
import { initializeEcho } from "@/lib/echo-setup";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useSWR from "swr";
import { formatDistanceToNow } from "date-fns";
import { baseFetcher, defaultFetcher } from "@/lib/fetcher";
import { echo } from "@/lib/echo-setup";
import { toast } from "@/hooks/use-toast";
import { deleteCookie, getCookie } from "cookies-next";


interface ChatPreview {
  id: number;
  user_id: number;
  name: string;
  position: string;
  avatar: string;
  last_message: string;
  unread_count: number;
  updated_at: string;
  image_path: string;
}

// Define types for the notification data
interface NotificationData {
  description: string;
  subject_type: string;
  subject_id: number;
  match_percentage: number;
  [key: string]: any;
}

interface Notification {
  id: string;
  type: string;
  activity_type: string;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
  source: string;
  notification_type: string;
}

interface NotificationsResponse {
  current_page: number;
  data: Notification[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
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
  const router = useRouter();


  const [seekFor, setSeekFor] = useState<string>("");

  useEffect(()=>{
    if(isAuthenticated && isEmployer){
      setSeekFor("jobseeker");
    }
    else if(isAuthenticated && !isEmployer){
      setSeekFor("employer");
    }
    else{
      setSeekFor("");
    }
  }, [isAuthenticated, isEmployer])

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

  // Add state for active tab in notifications dropdown
  const [activeTab, setActiveTab] = useState<"notifications" | "messages">(
    "notifications"
  );

  const leaveImpersonation = () => {
    deleteCookie("IMP_TOKEN");
    router.push("/admin/");
  };

  const fetchChatPreviews = useCallback(async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}api/chats/previews`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jobSeekerToken() || employerToken()}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setChats(data.data);
        // Calculate total unread messages
        const unreadCount = data.data.reduce(
          (total: number, chat: ChatPreview) => total + chat.unread_count,
          0
        );
        setTotalUnread(unreadCount);
      }
    } catch (error) {
      console.error("Error fetching chat previews:", error);
    }
  }, []);

  // Fetch chat previews
  useEffect(() => {
    if (isAuthenticated && user?.id && echo) {
      // Initial data fetch
      fetchChatPreviews();
      // Set up Echo listener for new messages
        const channel = echo?.private(`user.${user?.id}.messages`);
        channel.listen("NewChatMessage", () => {
          fetchChatPreviews();
        });

        // Add error handling
        channel.error(() => {});

      // Clean up function
      return () => {
        if (window.Echo) {
          console.log(`Leaving channel user.${user?.id}.messages`);
          window.Echo.leave(`user.${user?.id}.messages`);
        }
      };
    }
  }, [isAuthenticated, user?.id, fetchChatPreviews]);

  const handleOpenMessageModal = (chat: ChatPreview) => {
    setSelectedChat({
      id: chat.user_id.toString(),
      name: chat.name,
      position: chat.position || "User",
      avatar: chat.image_path || "",
    });
    setIsMessageModalOpen(true);
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  // Inside your Header component:
  const pathname = usePathname();
  const {
    data: notificationsData,
    error: notificationsError,
    mutate: refetchNotifications,
  } = useSWR<NotificationsResponse>(
    isAuthenticated ? `api/notifications` : null,
    defaultFetcher
  );

  // Refetch notifications when the pathname changes
  // useEffect(() => {
  //   refetchNotifications();
  // }, [pathname, refetchNotifications]);

  // Helper function to get notification icon based on activity type
  const getNotificationIcon = (activityType: string) => {
    switch (activityType) {
      case "interview_scheduled":
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case "application_viewed":
        return <BookMarked className="h-4 w-4 text-green-600" />;
      case "job_match":
        return <Briefcase className="h-4 w-4 text-purple-600" />;
      case "message_received":
        return <MessageSquare className="h-4 w-4 text-orange-600" />;
      case "payment_processed":
        return <CreditCard className="h-4 w-4 text-red-600" />;
      default:
        return <Bell className="h-4 w-4 text-blue-600" />;
    }
  };
  // Helper function to get background color based on activity type
  const getNotificationBgColor = (activityType: string) => {
    switch (activityType) {
      case "interview_scheduled":
        return "bg-blue-100";
      case "application_viewed":
        return "bg-green-100";
      case "job_match":
        return "bg-purple-100";
      case "message_received":
        return "bg-orange-100";
      case "payment_processed":
        return "bg-red-100";
      default:
        return "bg-blue-100";
    }
  };

  // Helper function to format the time
  const formatNotificationTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "some time ago";
    }
  };

  const markAllAsRead = async () => {
    const {response, errors, result} = await baseFetcher("api/notifications/read-all", {
      method: "POST",

    })

    if(response?.ok){
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
      refetchNotifications();
    }
    else{
      toast({
        title: "Error",
        description: errors || "Failed to mark notifications as read",
      });
    }
    }




  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto 2xl:px-4 xl:px-32 lg:px-16 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center cursor-pointer">
              <Image
                src="/main-logo.svg"
                alt="Logo"
                width={94}
                height={60}
                className="w-[54px] h-[40px] md:w-[94px] md:h-[60px]"
              />
            </Link>
          </div>

          <nav className="hidden md:flex space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "text-body1 text-manduCustom-secondary-blue cursor-pointer transition-colors",
                  isActivePath(
                    pathName,
                    item.path,
                    item.path === routes.home
                  ) && "font-bold text-manduCustom-secondary-blue"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-x-5">
            {isLoading ? (
              <AuthSkeleton />
            ) : isAuthenticated ? (
              <>
                {/* Notifications Dropdown with Messages Tab */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative shadow-2xl border-[1px] p-2">
                      <Bell className="h-5 w-5 text-neutral-600" />
                      <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notificationsData && notificationsData?.data?.length > 0 ? totalUnread + notificationsData?.data?.filter((notification)=>{
return notification?.read_at === null;
                        }).length : 0}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold">
                          {activeTab === "notifications"
                            ? "Notifications"
                            : "Messages"}
                        </p>
                        {activeTab === "notifications" ? (
                          <Button
                          onClick={()=> markAllAsRead()}
                            variant="ghost"
                            className="h-auto p-0 text-xs text-neutral-600 hover:text-neutral-900"
                          >
                            Mark all as read
                          </Button>
                        ) : (
                          <Link href="/dashboard/messages">
                            <Button
                              variant="ghost"
                              className="h-auto p-0 text-xs text-neutral-600 hover:text-neutral-900"
                            >
                              View all
                            </Button>
                          </Link>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    {/* <DropdownMenuSeparator /> */}

                    {/* Tabs for Notifications and Messages */}
                    <div className="flex border-b border-neutral-200">
                      <button
                        className={`flex-1 py-2 px-4 text-sm font-medium ${
                          activeTab === "notifications"
                            ? "border-b-2 border-neutral-900"
                            : "text-neutral-600 hover:text-neutral-900"
                        }`}
                        onClick={() => setActiveTab("notifications")}
                      >
                        Notifications
                      </button>
                      <button
                        className={`flex-1 py-2 px-4 text-sm ${
                          activeTab === "messages"
                            ? "font-medium border-b-2 border-neutral-900"
                            : "text-neutral-600 hover:text-neutral-900"
                        }`}
                        onClick={() => setActiveTab("messages")}
                      >
                        Messages {totalUnread > 0 && `(${totalUnread})`}
                      </button>
                    </div>

                    <div className="max-h-96 overflow-auto">
                      {/* Notifications Section */}
                      {activeTab === "notifications" && (
                        <div>
                          {notificationsError ? (
                            <DropdownMenuItem className="text-center p-4 cursor-default">
                              <p className="text-sm text-red-500">
                                Failed to load notifications
                              </p>
                            </DropdownMenuItem>
                          ) : !notificationsData ? (
                            <DropdownMenuItem className="text-center p-4 cursor-default">
                              <p className="text-sm text-neutral-500">
                                Loading notifications...
                              </p>
                            </DropdownMenuItem>
                          ) : notificationsData.data.length === 0 ? (
                            <DropdownMenuItem className="text-center p-4 cursor-default">
                              <p className="text-sm text-neutral-500 text-center w-full">
                                No notifications yet
                              </p>
                            </DropdownMenuItem>
                          ) : (
                            notificationsData.data.map((notification) => (
                              <DropdownMenuItem

                              onClick={()=> router.push("/jobs/"+ notification.data.slug)}
                                key={notification.id}
                                className={`flex items-start p-4 cursor-pointer ${notification?.read_at ? "bg-[#F1F5F9] text-black hover:bg-patternText hover:text-white ": "bg-manduCustom-secondary-blue/40 text-white"}`}
                              >
                                <div
                                  className={`h-8 w-8 rounded-full ${getNotificationBgColor(
                                    notification.notification_type 
                                  )} flex items-center justify-center mr-3`}
                                >
                                  {getNotificationIcon(
                                    notification.notification_type
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">
                                    {notification.notification_type
                                      .replace("_", " ")
                                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                                      <span>
                                       {
                                        notification?.read_at ? 
                                        <Verified className="inline-block ml-1 h-4 w-4 text-green-500" /> : null
                                       }
                                      </span>
                                  </p>
                                  <p className="text-xs text-neutral-500 mt-1">
                                    {notification.data.job_title} job matches {notification?.data?.match_percentage}% of your job alert.
                                  </p>
                                  <p className="text-xs text-neutral-400 mt-2">
                                    {formatNotificationTime(
                                      notification.created_at
                                    )}
                                  </p>
                                </div>
                              </DropdownMenuItem>
                            ))
                          )}
                        </div>
                      )}

                      {/* Messages Section */}
                      {activeTab === "messages" && (
                        <div>
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
                                    <AvatarImage
                                      src={chat.avatar}
                                      alt={chat.name}
                                    />
                                    <AvatarFallback>
                                      {chat.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  {chat.unread_count > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                      {chat.unread_count}
                                    </span>
                                  )}
                                </div>
                                <div className="flex-1 ml-3">
                                  <div className="flex justify-between">
                                    <p className="text-sm font-medium">
                                      {chat.name}
                                    </p>
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
                      )}
                    </div>

                    <DropdownMenuItem className="p-4 cursor-pointer">
                      {/* {activeTab === "notifications" ? (
                        <>
                          {notificationsData && notificationsData.total > 0 && (
                            <DropdownMenuItem className="text-center p-3 border-t border-neutral-100">
                              <Button
                                variant="link"
                                className="w-full text-sm text-neutral-600"
                              >
                                View all notifications
                              </Button>
                            </DropdownMenuItem>
                          )}
                        </>
                      ) : (
                        <Link
                          href="/dashboard/messages"
                          className="text-sm text-center w-full text-neutral-600 hover:text-neutral-900"
                        >
                          View all messages
                        </Link>
                      )} */}
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
                        <AvatarFallback>
                          {user?.first_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-profileNameText md:block hidden">
                        {user?.first_name
                          ? user?.first_name + " " + user?.last_name
                          : user?.company_name}
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
                      {isEmployer ? (
                        <Link href="/dashboard/employer">
                          <DropdownMenuItem>
                            <span>Employer Dashboard</span>
                          </DropdownMenuItem>
                        </Link>
                      ) : (
                        <Link href="/dashboard/jobseeker/">
                          <DropdownMenuItem>
                            <span>Dashboard</span>
                          </DropdownMenuItem>
                        </Link>
                      )}
                      {isEmployer ? (
                        <Link href="/dashboard/employer/applications">
                          <DropdownMenuItem>
                            <span>My Applications</span>
                          </DropdownMenuItem>
                        </Link>
                      ) : (
                        <Link href="/dashboard/jobseeker/applications">
                          <DropdownMenuItem>
                            <span>My Applications</span>
                          </DropdownMenuItem>
                        </Link>
                      )}

                      {isEmployer ? (
                        <Link href="/dashboard/employer/settings">
                          <DropdownMenuItem>
                            <span>Settings</span>
                          </DropdownMenuItem>
                        </Link>
                      ) : (
                        <>
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
                        </>
                      )}

                      {seekFor === "jobseeker" ? (
                        <p onClick={() => openRegisterModal()}>
                          <DropdownMenuItem>
                            <span>Sign up as JobSeeker</span>
                          </DropdownMenuItem>
                        </p>
                      ) : (
                        <p onClick={() => openRegisterModal()}>
                          <DropdownMenuItem>
                            <span>Sign up as Employer</span>
                          </DropdownMenuItem>
                        </p>
                      )}
                     
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                     {
                        getCookie("ADMIN_TOKEN") ?  <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={leaveImpersonation}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Leave Impersonation</span>
                    </DropdownMenuItem>:  <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                      }
                   
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  className="font-[600] text-body1 hidden md:flex border-manduSecondary border-[1px] bg-white text-manduSecondary hover:bg-white hover:text-manduSecondary rounded-[24px]"
                  onClick={openLoginModal}
                >
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  className="hidden md:flex text-body1 bg-manduSecondary border-manduSecondary hover:text-manduSecondary border-[1px] text-white  rounded-[24px]"
                  onClick={() => openRegisterModal()}
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
              {(
                !isAuthenticated && (
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
                      onClick={() => openRegisterModal()}
                    >
                      Register
                    </Button>
                  </div>
                )
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
