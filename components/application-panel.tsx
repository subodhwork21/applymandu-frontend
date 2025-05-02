"use client";

import React, { useEffect, useState } from "react";
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
import useSWR from "swr";
import { baseFetcher, defaultFetcher } from "@/lib/fetcher";
import { notFound } from "next/navigation";
import { UserProfile } from "@/types/user-profile-type";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";

const ApplicationPanel = () => {
  const { isApplyOpen, selectedJob, closeApplicationPanel } = useApplication();
  const { isAuthenticated } = useAuth();
  const [apiError, setApiError] = useState<{
    message: string;
    errors?: Record<string, string[]>;
  } | null>(null);
  // const profile = mockUserProfile;

  const { data: jobseekerData, isLoading, mutate, error } = useSWR<UserProfile>(
    "api/jobseeker/user-profile",
    defaultFetcher
  );


  if(error){
    // notFound();
  }

  // Initialize form with empty values first
  const form = useForm({
    defaultValues: {
      first_name: "",
      lastName: "",
      email: "",
      phone: "+977",
      year_of_experience: "",
      expected_salary: "",
      notice_period: "",
      coverLetter: "",
    },
  });

  // Update form values when data is loaded
  useEffect(() => {
    if (jobseekerData?.data && !isLoading) {
      form.reset({
        first_name: jobseekerData.data.first_name || "",
        lastName: jobseekerData.data.last_name || "",
        email: jobseekerData.data.email || "",
        phone: jobseekerData.data.phone || "+977",
        year_of_experience:  "",
        expected_salary: "",
        notice_period: "",
        coverLetter: "",
      });
      
      // Log the updated form values
    }
  }, [jobseekerData, isLoading, form]);



  const onSubmit = async(data: any) => {
    console.log(data);
    const {first_name, lastName, email, phone, ...selectedData } = data;
    const {response, result} = await baseFetcher("api/jobseeker/application/apply/"+selectedJob?.id, {
      method: "POST",
      body: JSON.stringify(selectedData),
    });
    if(response?.ok){
      toast({
        title: "Application submitted successfully",
        description: "Your application has been submitted successfully",
        variant:"default"
      });
      closeApplicationPanel();
    }
      else {
        if (result?.error && result?.errors) {
          setApiError({
            message: result.message || "Validation failed",
            errors: result.errors
          });
          
          // Set form errors for each field
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              form.setError(field as any, {
                type: "server",
                message: messages[0]
              });
            }
          });
        } else {
          // Handle general error
          setApiError({
            message: result?.message || "Failed to submit application"
          });
          
          toast({
            title: "Error",
            description: result?.message || "Failed to submit application",
            variant: "destructive"
          });
        }
      
    }
    // closeApplicationPanel();
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
              Submit your application to {selectedJob?.employer_name}
            </SheetDescription>
          </SheetHeader>
          {apiError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {apiError.message}
                {apiError.errors && (
                  <ul className="mt-2 list-disc pl-5">
                    {Object.entries(apiError.errors).map(([field, messages]) => (
                      messages.map((message, i) => (
                        <li key={`${field}-${i}`}>{message}</li>
                      ))
                    ))}
                  </ul>
                )}
              </AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input  {...field} disabled/>
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
                        <Input placeholder="Doe" {...field} disabled={true} />
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
                        disabled
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
                      <Input type="tel" {...field} disabled={true} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year_of_experience"
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
                name="expected_salary"
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
                name="notice_period"
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
