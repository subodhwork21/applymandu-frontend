"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { useApplication } from "@/lib/application-context";
import { useAuth } from "@/lib/auth-context";
import { mockUserProfile } from "@/lib/constants";

const ApplicationPanel = () => {
  const { isApplyOpen, selectedJob, closeApplicationPanel } = useApplication();
  const { isAuthenticated } = useAuth();
  const profile = mockUserProfile;

  const form = useForm({
    defaultValues: {
      firstName: isAuthenticated ? profile.personalDetails.firstName : "",
      lastName: isAuthenticated ? profile.personalDetails.lastName : "",
      email: isAuthenticated ? profile.personalDetails.email : "",
      phone: isAuthenticated ? profile.personalDetails.mobile : "+977",
      yearsOfExperience: isAuthenticated
        ? profile.experiences.length.toString()
        : "",
      expectedSalary: isAuthenticated
        ? profile.personalDetails.salaryExpectations.replace(/[^0-9]/g, "")
        : "",
      noticePeriod: "",
      coverLetter: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    closeApplicationPanel();
  };

  return (
    <Sheet open={isApplyOpen} onOpenChange={closeApplicationPanel}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl h-[100dvh] flex flex-col p-0"
      >
        <div className="p-6 flex-1 overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Apply for {selectedJob?.title}</SheetTitle>
            <SheetDescription>
              Submit your application to {selectedJob?.company}
            </SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yearsOfExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter years of experience"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectedSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Salary (Annual)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter expected salary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="noticePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notice Period (in days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter notice period"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverLetter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Letter</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-4 mt-auto flex gap-4 w-full shadow-lg">
          <Button
            type="button"
            variant="outline"
            onClick={closeApplicationPanel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            onClick={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit)();
            }}
          >
            Submit Application
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ApplicationPanel;
