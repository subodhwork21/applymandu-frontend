"use client";

import React, { useState } from "react";
import { X, Paperclip } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: {
    name: string;
    position: string;
    avatar: string;
  };
}

const ContactModal = ({ isOpen, onClose, candidate }: ContactModalProps) => {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    sendCopy: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl">Contact {candidate.name}</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Image
              width={48}
              height={48}
              src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${candidate.avatar}`}
              alt={candidate.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="text-lg">{candidate.name}</h3>
              <p className="text-neutral-600 text-sm">{candidate.position}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="Enter message subject"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Type your message here..."
                className="h-32"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Attachments</Label>
              <div className="border border-dashed border-neutral-300 rounded-lg p-6 text-center">
                <Button type="button" variant="outline" className="mx-auto">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Add Attachments
                </Button>
                <p className="text-sm text-neutral-600 mt-2">
                  Drag and drop files here or click to browse
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="copy"
                checked={formData.sendCopy}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, sendCopy: checked as boolean })
                }
              />
              <Label htmlFor="copy" className="text-sm font-normal">
                Send me a copy of this message
              </Label>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-neutral-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-black text-white hover:bg-neutral-800"
            onClick={handleSubmit}
          >
            Send Message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
