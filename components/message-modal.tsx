"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Paperclip, Send } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/lib/auth-context";
import { employerToken, jobSeekerToken } from "@/lib/tokens";
import { echo } from "@/lib/echo-setup";
import Image from "next/image";


interface Message {
  id: number;
  chat_id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender?: {
    id: number;
    // name: string;
    image?: string;
    image_path?: string;
  };
  receiver?: {
    id: number;
    // name: string;
    image?: string;
    image_path?: string;
  };
}

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: {
    id: string;
    name: string;
    position: string;
    avatar: string;
  };
}

const MessageModal = ({ isOpen, onClose, candidate }: MessageModalProps) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const echoRef = useRef<any | null>(null);
  const markedMessagesRef = useRef<Set<number>>(new Set());
  const initialLoadRef = useRef<boolean>(true);

  // Fetch or create chat when modal opens
  useEffect(() => {
    if (isOpen && candidate.id) {
      getOrCreateChat();
    }

    return () => {
      // Clean up Echo listeners when component unmounts
      if (echoRef.current && chatId) {
        echoRef.current.leave(`chat.${chatId}`);
      }
      // Reset state when modal closes
      if (!isOpen) {
        setMessages([]);
        setChatId(null);
        setPage(1);
        setHasMore(true);
        markedMessagesRef.current.clear();
        initialLoadRef.current = true;
      }
    };
  }, [isOpen, candidate.id]);

  const [isMessageReceived, setIsMessageReceived] = useState<boolean>(false);
// In your component:
useEffect(() => {
  // Only proceed if both echo and chatId are available
  if (!echo || !chatId) return;

  // console.log(`Subscribing to private-chat.${chatId} channel`);
  
  // Create a reference to the channel for cleanup
  const channel = echo.private(`chat.${chatId}`);
  
  // Listen for the new-chat-message event (without the dot)
  channel.listen('NewChatMessage', (e: { chat_message: Message }) => {
  if (e?.chat_message?.sender_id?.toString() !== user?.id?.toString()) {
    new Audio('/notification.wav').play();
    setMessages(prev => [...prev, e.chat_message]);
    setIsMessageReceived(true); 
    setTimeout(() => {
      setIsMessageReceived(false);
    }, 3000);
    if (!e?.chat_message?.is_read) {
      markAsReadSafely([e?.chat_message?.id]);
    }
  }
})
  
  // Listen for the message-read event (without the dot)
  channel.listen('MessageRead', (e: { chat_id: number, message_ids: number[], user_id: number }) => {
    console.log('Message read event received:', e);
    if (e?.user_id?.toString() !== user?.id?.toString()) {
      setMessages(prev =>
        prev.map(msg =>
          e?.message_ids?.includes(msg.id) ? { ...msg, is_read: true } : msg
        )
      );
    }
  });

  // Clean up function
  return () => {
    console.log(`Unsubscribing from private-chat.${chatId} channel`);
    echo?.leave(`chat.${chatId}`);
  };
}, [chatId, user?.id]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Process unread messages after initial load
  useEffect(() => {
    if (chatId && messages.length > 0 && initialLoadRef.current) {
      initialLoadRef.current = false;

      // Find unread messages from other users
      const unreadMessageIds = messages
        .filter(msg =>
          !msg.is_read &&
          msg.sender_id.toString() !== user?.id
        )
        .map(msg => msg.id);

      // Mark them as read if there are any
      if (unreadMessageIds.length > 0) {
        markAsReadSafely(unreadMessageIds);
      }
    }
  }, [chatId, messages, user?.id]);

  // Safe wrapper for marking messages as read to avoid infinite loops
  const markAsReadSafely = (messageIds: number[]) => {
    // Filter out already marked messages
    const newMessageIds = messageIds.filter(id => !markedMessagesRef.current.has(id));

    if (newMessageIds.length === 0) return;

    // Add to marked set before API call
    newMessageIds.forEach(id => markedMessagesRef.current.add(id));

    // Call API to mark as read
    markMessagesAsRead(newMessageIds);
  };

  const getOrCreateChat = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}api/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jobSeekerToken() || employerToken()}`
        },
        body: JSON.stringify({ user_id: candidate.id })
      });

      const data = await response.json();

      if (data.success && data.data.chat_id) {
        setChatId(data.data.chat_id);
        await fetchMessages(data.data.chat_id);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId: number, pageNum = 1) => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}api/chats/${chatId}/messages?page=${pageNum}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jobSeekerToken() || employerToken()}`
        }
      });

      const data = await response.json();

      if (data.success) {
        const newMessages = data.data.data; 

        if (pageNum === 1) {
          setMessages(newMessages.reverse()); 
        } else {
          // Subsequent pages, prepend to existing messages
          setMessages(prev => [...newMessages.reverse(), ...prev]);
        }

        // Check if there are more pages
        setHasMore(data.data.current_page < data.data.last_page);
        setPage(data.data.current_page);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMessages = () => {
    if (chatId && hasMore && !loading) {
      fetchMessages(chatId, page + 1);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jobSeekerToken() || employerToken()}`
        },
        body: JSON.stringify({
          chat_id: chatId,
          message: newMessage
        })
      });

      const data = await response.json();

      if (data.success) {
        // Add the new message to the list
        setMessages(prev => [...prev, data.data]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const markMessagesAsRead = async (messageIds: number[]) => {
    if (!chatId || !messageIds || !Array.isArray(messageIds) || messageIds.length === 0) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      await fetch(`${baseUrl}api/messages/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jobSeekerToken() || employerToken()}`
        },
        body: JSON.stringify({
          chat_id: chatId,
          message_ids: messageIds || []
        })
      });

      // Update local message state to reflect read status
      setMessages(prev =>
        prev.map(msg =>
          messageIds?.includes(msg?.id) ? { ...msg, is_read: true } : msg
        )
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (dateString: string) => {
  try {
    if (!dateString) {
      console.error("Empty date string");
      return "Unknown time";
    }

    // Handle different date formats
    let normalizedDateString = dateString;
    
    // Remove microseconds if present
    if (dateString.includes('.')) {
      normalizedDateString = dateString.replace(/\.\d+Z?$/, dateString.endsWith('Z') ? 'Z' : '');
    }
    
    // Add Z if missing (for UTC)
    if (!normalizedDateString.endsWith('Z') && !normalizedDateString.includes('+')) {
      normalizedDateString += 'Z';
    }
    
    const date = new Date(normalizedDateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date after normalization:", dateString, "->", normalizedDateString);
      
      // Fallback: try parsing without any normalization
      const fallbackDate = new Date(dateString);
      if (!isNaN(fallbackDate.getTime())) {
        return fallbackDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      
      return "Unknown time";
    }

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "Unknown time";
  }
};



  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0">
        <div className="border-b border-neutral-200 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Image
            width={40}
            height={40}
              src={candidate.avatar || `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${candidate.id}`}
              alt={candidate.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="text-lg">Message to {candidate.name}</h3>
              <p className="text-sm text-neutral-600">{candidate.position}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading && messages.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading messages...</p>
            </div>
          ) : (
            <>
              <ScrollArea className="h-64 pr-4 mb-6" ref={scrollAreaRef}>
                {hasMore && (
                  <div className="text-center mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadMoreMessages}
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Load older messages"}
                    </Button>
                  </div>
                )}

                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message?.id}
                      className={`flex ${message?.sender_id?.toString() === user?.id.toString()
                          ? "justify-end"
                          : "justify-start"
                        } mb-4`}
                    >
                      <div className={`flex gap-4 max-w-[80%] ${message?.sender_id?.toString() === user?.id.toString()
                          ? "flex-row-reverse"
                          : "flex-row"
                        }`}>
                        {/* Avatar for current user */}
                        {message?.sender_id?.toString() === user?.id.toString() && (
                          <Image
                          width={32}
                          height={32}
                            src={user.image_path || "https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=company"}
                            alt="You"
                            className="w-8 h-8 rounded-full flex-shrink-0"
                          />
                        )}

                        {/* Message bubble */}
                        <div
                          className={`rounded-lg p-3 ${message?.sender_id?.toString() === user?.id.toString()
                              ? "bg-black text-white"
                              : "bg-neutral-100 text-black"
                            }`}
                        >
                          <p className="text-sm">{message?.content}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span
                              className={`text-xs ${message?.sender_id?.toString() === user?.id.toString()
                                  ? "text-neutral-300"
                                  : "text-neutral-500"
                                }`}
                            >
                              {formatMessageTime(message?.created_at)}
                            </span>
                            {(message?.sender_id?.toString() === user?.id.toString() || message?.sender_id?.toString() === candidate?.id.toString()) && (
                              <span className="text-xs text-neutral-300 ml-2">
                                {message?.is_read ? "Read" : "Sent"}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Avatar for other user */}
                        {message?.sender_id?.toString() !== user?.id.toString() && (
                          <Image
                          width={32}
                          height={32}
                            src={candidate.avatar || `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${candidate.id}`}
                            alt={candidate.name}
                            className="w-8 h-8 rounded-full flex-shrink-0"
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="border-t border-neutral-200 pt-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      rows={3}
                      className="resize-none"
                      disabled={loading || !chatId}
                    />
                  </div>
                  <div className="flex flex-col gap-2 justify-end">
                    <Button
                      size="icon"
                      className="bg-black text-white hover:bg-neutral-800"
                      onClick={handleSendMessage}
                      disabled={loading || !chatId || !newMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
     

    </Dialog>
    <Dialog>
       <DialogContent className="sm:max-w-2xl p-0">
  <div className="border-b border-neutral-200 p-4 flex justify-between items-center">
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Image
          width={40}
          height={40}
          src={candidate.avatar || `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${candidate.id}`}
          alt={candidate.name}
          className="w-10 h-10 rounded-full"
        />
        {isMessageReceived && (
          <span className="absolute -top-1 -right-1 bg-green-500 rounded-full w-3 h-3 animate-pulse"></span>
        )}
      </div>
      <div>
        <h3 className="text-lg">Message to {candidate.name}</h3>
        <p className="text-sm text-neutral-600">{candidate.position}</p>
      </div>
    </div>
  </div>
  {/* Rest of your component */}
</DialogContent>
    </Dialog>
    </>
  );
};

export default MessageModal;
