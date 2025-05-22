"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

const TwoFactorModal = () => {
  const { isTwoFactorModalOpen, closeTwoFactorModal, twoFactorSession, verifyTwoFactorCode } = useAuth();
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!verificationCode.trim()) return;
    
    setIsVerifying(true);
    try {
      await verifyTwoFactorCode(verificationCode);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={isTwoFactorModalOpen} onOpenChange={closeTwoFactorModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            Scan the QR code with your mobile device or enter the verification code sent to your email.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          {twoFactorSession?.qr_code && (
            <div className="border p-2 rounded-md">
              <img 
                src={twoFactorSession.qr_code} 
                alt="QR Code for 2FA" 
                className="w-48 h-48"
              />
            </div>
          )}
          
          <div className="text-center text-sm text-muted-foreground">
            <p>A verification code has been sent to your email.</p>
            <p>The code will expire in 10 minutes.</p>
          </div>
          
          <div className="grid w-full gap-2">
            <Label htmlFor="verification-code">Verification Code</Label>
            <Input
              id="verification-code"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={closeTwoFactorModal} disabled={isVerifying}>
            Cancel
          </Button>
          <Button onClick={handleVerify} disabled={!verificationCode.trim() || isVerifying}>
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorModal;
