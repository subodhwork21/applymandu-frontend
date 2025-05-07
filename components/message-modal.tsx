"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Paperclip, Send } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/lib/auth-context";

interface Message {
  id: number;
  chat_id: number;
  sender_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender?: {
    id: number;
    name: string;
    image?: string;
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

  // Set up Echo listeners when chatId is available
  useEffect(() => {
    if (chatId && window.Echo) {
      echoRef.current = window.Echo;
      
      // Listen for new messages
      echoRef.current.private(`chat.${chatId}`)
        .listen('NewChatMessage', (e: { message: Message }) => {
          if (e.message.sender_id.toString() !== user?.id) {
            setMessages(prev => [...prev, e.message]);
            
            // Mark the new message as read immediately
            if (!e.message.is_read) {
              markAsReadSafely([e.message.id]);
            }
          }
        })
        .listen('MessageRead', (e: { chat_id: number, message_ids: number[], user_id: number }) => {
          if (e.user_id.toString() !== user?.id) {
            setMessages(prev => 
              prev.map(msg => 
                e.message_ids.includes(msg.id) ? { ...msg, is_read: true } : msg
              )
            );
          }
        });
    }
  }, [chatId]);

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
      const response = await fetch(`${baseUrl}/api/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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
      const response = await fetch(`${baseUrl}/api/chats/${chatId}/messages?page=${pageNum}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        const newMessages = data.data.data; // Pagination data structure
        
        if (pageNum === 1) {
          // First page, replace all messages
          setMessages(newMessages.reverse()); // Reverse to show oldest first
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
      const response = await fetch(`${baseUrl}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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
    if (!chatId || messageIds.length === 0) return;
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      await fetch(`${baseUrl}/api/messages/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          chat_id: chatId,
          message_ids: messageIds
        })
      });
      
      // Update local message state to reflect read status
      setMessages(prev => 
        prev.map(msg => 
          messageIds.includes(msg.id) ? { ...msg, is_read: true } : msg
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
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0">
        <div className="border-b border-neutral-200 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img
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
                      key={message.id}
                      className={`flex gap-4 ${
                        message.sender_id.toString() === user?.id ? "" : "justify-end"
                      }`}
                    >
                      {message.sender_id.toString() === user?.id && (
                        <img
                          src={user.image_path || "https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=company"}
                          alt="You"
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div
                        className={`rounded-lg p-3 max-w-[80%] ${
                          message.sender_id.toString() === user?.id
                            ? "bg-neutral-100"
                            : "bg-black text-white"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span
                            className={`text-xs ${
                              message.sender_id.toString() === user?.id
                                ? "text-neutral-500"
                                : "text-neutral-300"
                            }`}
                          >
                            {formatMessageTime(message.created_at)}
                          </span>
                          {message.sender_id.toString() === user?.id && (
                            <span className="text-xs text-neutral-500 ml-2">
                              {message.is_read ? "Read" : "Sent"}
                            </span>
                          )}
                        </div>
                      </div>
                      {message.sender_id.toString() !== user?.id && (
                        <img
                          src={candidate.avatar || `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${candidate.id}`}
                          alt={candidate.name}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
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
  );
};

export default MessageModal;
