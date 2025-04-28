"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SettingsPage = () => {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = React.useState(false);

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1">Settings</h1>
          <p className="text-neutral-600">Manage your account preferences and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Photo */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg mb-4">Profile Photo</h3>
              <div className="flex items-center space-x-4">
                <img 
                  src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=789" 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full"
                />
                <div>
                  <Button className="bg-black text-white hover:bg-neutral-800">Change Photo</Button>
                  <p className="text-sm text-neutral-500 mt-2">Recommended: Square JPG, PNG (300x300px)</p>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg mb-4">Password</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <h2 className="text-xl mb-6">Personal Information</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input defaultValue="Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input type="email" defaultValue="john.doe@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <div className="flex">
                      <Input 
                        value="+977" 
                        className="w-20 bg-neutral-50 border-r-0 rounded-r-none" 
                        disabled 
                      />
                      <Input 
                        type="tel" 
                        defaultValue="98XXXXXXXX" 
                        className="flex-1 rounded-l-none" 
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy and Notification Preferences */}
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl mb-4">Privacy Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="profileVisibility" />
                        <Label htmlFor="profileVisibility">Make my profile visible to employers</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="searchable" />
                        <Label htmlFor="searchable">Allow my profile to appear in search results</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="contactInfo" />
                        <Label htmlFor="contactInfo">Show my contact information to employers</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="activityStatus" />
                        <Label htmlFor="activityStatus">Show my online activity status</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="dataUsage" />
                        <Label htmlFor="dataUsage">Allow data usage for personalized job recommendations</Label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-neutral-200">
                    <h3 className="text-xl mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="emailNotif" />
                        <Label htmlFor="emailNotif">Email notifications for new job matches</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="smsNotif" />
                        <Label htmlFor="smsNotif">SMS notifications for application updates</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="newsletter" />
                        <Label htmlFor="newsletter">Subscribe to newsletter</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-xl mb-4">Account Actions</h3>
              <div className="flex flex-col md:flex-row gap-3">
                <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full md:w-auto bg-black text-white hover:bg-neutral-800">
                      Deactivate Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deactivate Account</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to deactivate your account? Your profile will be hidden from employers and you won&apos;t receive any notifications. You can reactivate your account at any time by logging back in.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-black text-white hover:bg-neutral-800">
                        Deactivate Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full md:w-auto">
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Account</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700">
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Save Changes */}
            <div className="flex justify-end space-x-4">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-black text-white hover:bg-neutral-800">Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SettingsPage;