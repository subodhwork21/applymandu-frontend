"use client";

import React from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import MessageModal from "@/components/message-modal";
import InterviewScheduleModal from "@/components/interview-schedule-modal";

const ApplicationDetailClient = () => {
  const [isMessageModalOpen, setIsMessageModalOpen] = React.useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = React.useState(false);
  const [newNote, setNewNote] = React.useState("");
  const [notes, setNotes] = React.useState([
    {
      text: "Strong technical background with relevant experience in frontend development. Good communication skills demonstrated in cover letter.",
      author: "HR Manager",
      date: "Apr 19, 2025",
    },
  ]);

  const candidate = {
    name: "John Doe",
    position: "Frontend Developer",
    avatar: "789",
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([
        {
          text: newNote.trim(),
          author: "You",
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        },
        ...notes,
      ]);
      setNewNote("");
    }
  };

  return (
    <section className="py-8">
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
                    <h1 className="text-2xl">Application Details</h1>
                    <p className="text-neutral-600">
                      Review candidate application
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-white text-2xl">T</div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Senior Frontend Developer
                      </h3>
                      <p className="text-neutral-600 mb-2">TechCorp Nepal</p>
                      <div className="flex space-x-4 text-sm text-neutral-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Applied on Apr 18, 2025
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          Kathmandu
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Shortlisted
                  </span>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-medium mb-6">
                      Application Status Timeline
                    </h4>
                    <div className="relative">
                      <div className="absolute left-[17px] top-0 h-full w-[2px] bg-neutral-200"></div>
                      <div className="space-y-8">
                        <div className="relative flex gap-6">
                          <div className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center z-10">
                            <CheckCircle2 className="h-5 w-5 text-black" />
                          </div>
                          <div>
                            <p className="text-neutral-900 font-medium">
                              Application Submitted
                            </p>
                            <p className="text-neutral-500 text-sm">
                              Apr 18, 2025 - 10:30 AM
                            </p>
                            <p className="text-neutral-600 text-sm mt-1">
                              Your application was successfully submitted
                            </p>
                          </div>
                        </div>
                        <div className="relative flex gap-6">
                          <div className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center z-10">
                            <CheckCircle2 className="h-5 w-5 text-black" />
                          </div>
                          <div>
                            <p className="text-neutral-900 font-medium">
                              Application Reviewed
                            </p>
                            <p className="text-neutral-500 text-sm">
                              Apr 19, 2025 - 2:15 PM
                            </p>
                            <p className="text-neutral-600 text-sm mt-1">
                              Your application has been reviewed by the hiring
                              team
                            </p>
                          </div>
                        </div>
                        <div className="relative flex gap-6">
                          <div className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center z-10">
                            <CheckCircle2 className="h-5 w-5 text-black" />
                          </div>
                          <div>
                            <p className="text-neutral-900 font-medium">
                              Shortlisted
                            </p>
                            <p className="text-neutral-500 text-sm">
                              Apr 20, 2025 - 11:45 AM
                            </p>
                            <p className="text-neutral-600 text-sm mt-1">
                              Congratulations! You have been shortlisted for the
                              next round
                            </p>
                          </div>
                        </div>
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
                          <Download className="h-4 w-4" />
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
                  <img
                    src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${candidate.avatar}`}
                    alt={candidate.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="text-base font-medium">{candidate.name}</h4>
                    <p className="text-sm text-neutral-600">
                      {candidate.position}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Experience</span>
                    <span className="text-sm">5 years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Location</span>
                    <span className="text-sm">Kathmandu</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">
                      Notice Period
                    </span>
                    <span className="text-sm">30 days</span>
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
                    {notes.map((note, index) => (
                      <div key={index} className="p-4 bg-neutral-50 rounded-lg">
                        <p className="text-sm text-neutral-600">{note.text}</p>
                        <p className="text-xs text-neutral-500 mt-2">
                          Added by {note.author} • {note.date}
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
        candidate={candidate}
      />

      <InterviewScheduleModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        candidate={candidate}
      />
    </section>
  );
};

export default ApplicationDetailClient;
