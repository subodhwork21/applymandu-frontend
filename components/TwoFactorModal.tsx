"use client";

import React, { useState, useEffect } from "react";
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
  const [otpAuthUrl, setOtpAuthUrl] = useState("");

useEffect(() => {
  if (twoFactorSession?.qr_code && twoFactorSession?.secret) {
    // Format: otpauth://totp/[Service]:[User]?secret=[Secret]&issuer=[Issuer]&algorithm=SHA1&digits=6&period=30
    const issuer = "Applymandu";
    const account = twoFactorSession.email || "user";
    const secret = twoFactorSession.secret;
    
    const url = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
    setOtpAuthUrl(url);
  }
}, [twoFactorSession]);

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
            Scan the QR code with your iPhone Camera app or authenticator app to add to your keychain.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          {twoFactorSession?.qr_code && (
            <div className="border p-2 rounded-md">
              {/* Use the otpauth URL for the QR code if available, otherwise use the provided QR code */}
              <img 
                src={ twoFactorSession.qr_code} 
                alt="QR Code for 2FA" 
                className="w-48 h-48"
              />
            </div>
          )}
          
          <div className="text-center text-sm text-muted-foreground">
            <p>A verification code has been sent to your email.</p>
            <p>The code will expire in 10 minutes.</p>
            {otpAuthUrl && (
              <p className="mt-2">
                <a 
                  href={otpAuthUrl}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Add to authenticator app
                </a>
              </p>
            )}
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
