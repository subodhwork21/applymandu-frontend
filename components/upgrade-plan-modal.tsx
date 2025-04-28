"use client";

import React from "react";
import { X, Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradePlanModal = ({ isOpen, onClose }: UpgradePlanModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl p-0">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl">Choose Your Plan</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Basic Plan */}
            <div className="border border-neutral-200 rounded-lg p-6">
              <h3 className="text-xl mb-2">Basic</h3>
              <div className="text-3xl mb-4">
                $49<span className="text-sm text-neutral-600">/mo</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 mr-2 text-neutral-600" />
                  <span>5 Job Postings</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 mr-2 text-neutral-600" />
                  <span>Basic Analytics</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 mr-2 text-neutral-600" />
                  <span>Email Support</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Select Plan
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="border-2 border-black rounded-lg p-6 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded-full">
                Popular
              </div>
              <h3 className="text-xl mb-2">Premium</h3>
              <div className="text-3xl mb-4">
                $99<span className="text-sm text-neutral-600">/mo</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 mr-2 text-neutral-600" />
                  <span>Unlimited Job Postings</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 mr-2 text-neutral-600" />
                  <span>Advanced Analytics</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 mr-2 text-neutral-600" />
                  <span>Priority Support</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 mr-2 text-neutral-600" />
                  <span>Featured Listings</span>
                </li>
              </ul>
              <Button className="w-full bg-black text-white hover:bg-neutral-800">
                Select Plan
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="border border-neutral-200 rounded-lg p-6">
              <h3 className="text-xl mb-2">Enterprise</h3>
              <div className="text-3xl mb-4">
                $199<span className="text-sm text-neutral-600">/mo</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 mr-2 text-neutral-600" />
                  <span>Custom Solutions</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 mr-2 text-neutral-600" />
                  <span>API Access</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 mr-2 text-neutral-600" />
                  <span>24/7 Support</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 mr-2 text-neutral-600" />
                  <span>Dedicated Manager</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-neutral-200 bg-neutral-50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-600">
              Prices are in USD and charged monthly
            </span>
            <Button
              variant="ghost"
              className="text-sm text-neutral-600 hover:text-neutral-900"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePlanModal;
