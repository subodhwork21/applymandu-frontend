"use client";

import React, { useState } from "react";
import { X, Paperclip, Send } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  time: string;
  sender: "company" | "candidate";
}

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: {
    name: string;
    position: string;
    avatar: string;
  };
}

const MessageModal = ({ isOpen, onClose, candidate }: MessageModalProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi John, thank you for your application. We'd like to schedule an interview with you.",
      time: "10:30 AM",
      sender: "company",
    },
    {
      id: 2,
      text: "Thank you for considering my application. I'm available for an interview.",
      time: "10:35 AM",
      sender: "candidate",
    },
  ]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: newMessage,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          sender: "company",
        },
      ]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0">
        <div className="border-b border-neutral-200 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img
              src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${candidate.avatar}`}
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
          <ScrollArea className="h-64 pr-4 mb-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.sender === "company" ? "" : "justify-end"
                  }`}
                >
                  {message.sender === "company" && (
                    <img
                      src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=123"
                      alt="Company"
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div
                    className={`rounded-lg p-3 max-w-[80%] ${
                      message.sender === "company"
                        ? "bg-neutral-100"
                        : "bg-black text-white"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span
                      className={`text-xs ${
                        message.sender === "company"
                          ? "text-neutral-500"
                          : "text-neutral-300"
                      } mt-1 block`}
                    >
                      {message.time}
                    </span>
                  </div>
                  {message.sender === "candidate" && (
                    <img
                      src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${candidate.avatar}`}
                      alt={candidate.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                </div>
              ))}
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
                />
              </div>
              <div className="flex flex-col gap-2 justify-end">
                <Button
                  size="icon"
                  className="bg-black text-white hover:bg-neutral-800"
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageModal;
