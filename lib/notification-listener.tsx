// components/chat-notification.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';

interface Message {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender: {
    id: number;
    first_name: string;
    image: string;
  };
}

export const ChatNotificationListener: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [activeChats, setActiveChats] = useState<number[]>([]);

  // Fetch active chats when component mounts
  useEffect(() => {
    if (user?.id) {
      fetchActiveChats();
    }
  }, [user?.id]);

  const fetchActiveChats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('JOBSEEKER_TOKEN')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Extract chat IDs
          const chatIds = data.data.map((chat: any) => chat.id);
          setActiveChats(chatIds);
          
          // Subscribe to each chat channel
          subscribeToChats(chatIds);
        }
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const subscribeToChats = (chatIds: number[]) => {
    if (typeof window === 'undefined' || !window.Echo) return;

    // First, unsubscribe from any existing subscriptions
    activeChats.forEach(chatId => {
      window.Echo.leave(`chat.${chatId}`);
    });

    // Subscribe to each chat channel
    chatIds.forEach(chatId => {
      window.Echo.private(`chat.${chatId}`)
        .listen('NewChatMessage', (e: { chatMessage: Message }) => {
          // Only show notification if the message is from someone else
          if (e.chatMessage.sender_id.toString() !== user?.id) {
            showNotification(e.chatMessage);
          }
        });
    });
  };

  const showNotification = (message: Message) => {
    // Show a toast notification
    toast({
      title: `New message from ${message.sender.first_name}`,
      description: message.content.length > 50 
        ? `${message.content.substring(0, 50)}...` 
        : message.content,
      action: (
        <button 
          onClick={() => router.push(`/dashboard/messages/${message.chat_id}`)}
          className="bg-primary text-white px-3 py-1 rounded-md text-xs"
        >
          View
        </button>
      )
    });

    // You could also play a sound
    const audio = new Audio('/notification-sound.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  // Empty div as this is just a listener component
  return <div className="hidden"></div>;
};
