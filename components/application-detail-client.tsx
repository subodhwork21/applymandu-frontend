"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Send,
  Trash2,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import MessageModal from "@/components/message-modal";
import InterviewScheduleModal from "@/components/interview-schedule-modal";
import StatusUpdateModal from "@/components/status-update-modal";
import useSWR from "swr";
import { baseFetcher, defaultFetcher } from "@/lib/fetcher";
import { format, parseISO } from "date-fns";
import { employerToken } from "@/lib/tokens";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";

interface ApplicationStatus {
  id: number;
  application_id: number;
  status: string;
  remarks: string | null;
  changed_at: string;
  created_at: string;
  updated_at: string;
}

interface ApplicationData {
  id: number;
  job_id: number;
  user_id: number;
  year_of_experience: number;
  expected_salary: number;
  notice_period: number;
  cover_letter: string | null;
  applied_at: string;
  formatted_applied_at: string;
  updated_at: string;
  status: number;
  job_title: string;
  company_name: string;
  applied_user: string;
  skills: string[];
  status_history: ApplicationStatus[];
  image_path: string;
  location: string | null;
}

interface ApiResponse {
  success: boolean;
  data: ApplicationData[];
}

const ApplicationDetailClient = ({ id }: { id: string }) => {
  const [isMessageModalOpen, setIsMessageModalOpen] = React.useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = React.useState(false);
  const [isStatusUpdateModalOpen, setIsStatusUpdateModalOpen] = React.useState(false);
  const [newNote, setNewNote] = React.useState("");
  const [notes, setNotes] = React.useState<
    { id: number; note: string; created_at: string; user: { company_name: string } }[]
  >([]);

  const {user} = useAuth();

  const {
    data: notesList,
    isLoading: isNotesLoading,
    error: notesError,
    mutate: mutateNote,
  } = useSWR<Record<string, any>>("api/application-note/" + id, defaultFetcher);

  const {
    data: applicationData,
    isLoading,
    error,
    mutate,
  } = useSWR<ApiResponse>(`api/employer/job/application/${id}`, defaultFetcher);

  useEffect(() => {
    if (notesList) {
      setNotes(notesList.data);
    }
  }, [applicationData, notesList]);

  const application = applicationData?.data[0];

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    const { response, result, errors } = await baseFetcher(
      "api/application-note/" + application?.id,
      {
        method: "POST",
        body: JSON.stringify({
          note: newNote.trim(),
        }),
      }
    );

    if (response?.ok) {
      mutateNote();
      setNewNote("");
    } else {
      toast({
        title: "Error",
        description: errors,
      });
    }
  };

  const handleDeleteNote = async (id: number) => {
    const { response, result, errors } = await baseFetcher(
      "api/application-note/" + id,
      {
        method: "DELETE",
      }
    );

    if (response?.ok) {
      mutateNote();
    } else {
      toast({
        title: "Error",
        description: errors,
      });
    }
  };

  const handleStatusUpdate = () => {
    // Refresh application data after status update
    mutate();
  };

  const candidate = application
    && {
        id: application.user_id.toString(),
        name: application?.applied_user,
        position: application.job_title,
        avatar: application?.image_path,
      }
   

  if (isLoading) {
    return (
      <div className="py-8 text-center">Loading application details...</div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500">
        Error loading application: {error.message}
      </div>
    );
  }

  if (!application) {
    return <div className="py-8 text-center">Application not found</div>;
  }

  // Format the application date
  const appliedDate =
    application.formatted_applied_at ||
    format(parseISO(application.applied_at), "MMM dd, yyyy");

  // Get the current status from status history
  const currentStatus =
    application.status_history && application.status_history.length > 0
      ? application.status_history[0].status
      : "applied";

  // Capitalize the status for display
  const displayStatus =
    currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1);

  const downloadFile = async (id: number) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${baseUrl}api/employer/download-document/` + id, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${employerToken()}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch PDF");
      return;
    }

    const blob = await res.blob();
    const fileUrl = URL.createObjectURL(blob);

    window.open(fileUrl);
  };

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg border border-neutral-200">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center gap-4 mb-8">
                  <Link href="/dashboard/employer/applications">
                    <Button
                      variant="ghost"
                      className="text-neutral-600 p-2 h-auto"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  </Link>
                  <div>
                    <h1 className="text-2xl text-manduSecondary ">Application Details</h1>
                    <p className="text-grayColor">
                      Review candidate application
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-4">
                    <div className=" rounded-lg flex items-center justify-center flex-shrink-0">
                        <Image className="rounded-full w-[60px] h-[60px]" src={user?.image_path!} alt="User" width={60} height={60} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        {application.job_title}
                      </h3>
                      <p className="text-neutral-600 mb-2">
                        {application.company_name}
                      </p>
                      <div className="flex space-x-4 text-sm text-neutral-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Applied on {appliedDate}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {application?.location || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 ${
                        displayStatus === "Shortlisted"
                          ? "bg-green-100 text-green-800"
                          : displayStatus === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : displayStatus === "Under_review"
                          ? "bg-yellow-100 text-yellow-800"
                          : displayStatus === "Interview_scheduled"
                          ? "bg-purple-100 text-purple-800"
                          : displayStatus === "Interviewed"
                          ? "bg-indigo-100 text-indigo-800"
                          : displayStatus === "Selected"
                          ? "bg-emerald-100 text-emerald-800"
                          : displayStatus === "Withdrawn"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-blue-100 text-blue-800"
                      } rounded-full text-sm font-medium`}
                    >
                      {displayStatus.split("_").join(" ")}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsStatusUpdateModalOpen(true)}
                      className="flex items-center gap-2 hover:bg-neutral-50"
                    >
                      <Edit3 className="h-4 w-4" />
                      Update Status
                    </Button>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-medium mb-6">
                      Application Status Timeline
                    </h4>
                    <div className="relative">
                      <div className="absolute left-[17px] top-0 h-full w-[2px] bg-neutral-200"></div>
                      <div className="space-y-8">
                        {application.status_history.map((status, index) => (
                          <div key={index} className="relative flex gap-6">
                            <div className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center z-10">
                              <CheckCircle2 className="h-5 w-5 text-black" />
                            </div>
                            <div>
                              <p className="text-neutral-900 font-medium">
                                {status.status.charAt(0).toUpperCase() +
                                  status.status.slice(1).split("_").join(" ")}
                              </p>
                              <p className="text-neutral-500 text-sm">
                                {format(
                                  parseISO(status.changed_at),
                                  "MMM dd, yyyy - h:mm a"
                                )}
                              </p>
                              <p className="text-neutral-600 text-sm mt-1">
                                {status.remarks ||
                                  (status.status === "applied"
                                    ? "Application was successfully submitted"
                                    : `Application status changed to ${status.status.split("_").join(" ")}`)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-4">
                      Attached Documents
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-neutral-200 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-neutral-700" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Resume.pdf</p>
                            <p className="text-xs text-neutral-500">
                              238 KB • PDF
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-neutral-600 hover:text-neutral-900"
                        >
                          <Download
                            onClick={() => downloadFile(application?.id)}
                            className="h-4 w-4"
                          />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-neutral-200 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-neutral-700" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Cover_Letter.pdf
                            </p>
                            <p className="text-xs text-neutral-500">
                              156 KB • PDF
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-neutral-600 hover:text-neutral-900"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-neutral-200">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Candidate Details</h3>
                <div className="flex items-center gap-4 mb-6">
                  <Image
                    width={48}
                    height={48}
                    src={application?.image_path}
                    alt={application.applied_user}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="text-base font-medium">
                      {application.applied_user}
                    </h4>
                    <p className="text-sm text-neutral-600">
                      {application.job_title}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Experience</span>
                    <span className="text-sm">
                      {application.year_of_experience} years
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Location</span>
                    <span className="text-sm">Kathmandu</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">
                      Notice Period
                    </span>
                    <span className="text-sm">
                      {application.notice_period} days
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">
                      Expected Salary
                    </span>
                    <span className="text-sm">
                      ${application.expected_salary}
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-neutral-600 block mb-2">
                      Skills
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {application.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsMessageModalOpen(true)}
                  >
                    Message
                  </Button>
                  <Button
                    className="flex-1 bg-black text-white hover:bg-neutral-800"
                    onClick={() => setIsInterviewModalOpen(true)}
                  >
                    Schedule Interview
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Application Notes</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Add a note about this application..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      className="bg-black text-white hover:bg-neutral-800"
                      onClick={handleAddNote}
                      disabled={!newNote.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {notes?.length > 0 &&
                      notes.map((note, index) => (
                        <div
                          key={index}
                          className="p-4 bg-neutral-50 rounded-lg relative"
                        >
                          <div className="flex justify-between">
                            <p className="text-sm text-neutral-600">
                              {note.note}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-neutral-500 hover:text-red-500"
                              onClick={() => handleDeleteNote(note?.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-neutral-500 mt-2">
                            Added by {note.user?.company_name} •{" "}
                            {note.created_at}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        candidate={candidate!}
      />

      <InterviewScheduleModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        candidate={candidate!}
        application_id={id}
        mutate={mutate}
      />

      <StatusUpdateModal
        isOpen={isStatusUpdateModalOpen}
        onClose={() => setIsStatusUpdateModalOpen(false)}
        applicationId={id}
        currentStatus={currentStatus}
        candidateName={application.applied_user}
        onStatusUpdate={handleStatusUpdate}
      />
    </section>
  );
};

export default ApplicationDetailClient;
