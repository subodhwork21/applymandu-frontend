"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Calendar, MapPin, MoreVertical } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApplication } from "@/lib/application-context";

const applications = [
  {
    id: 1,
    position: "Senior Frontend Developer",
    company: "TechCorp Nepal",
    appliedDate: "Apr 18, 2025",
    location: "Kathmandu",
    status: "Shortlisted",
  },
  {
    id: 2,
    position: "UI/UX Designer",
    company: "Design Studio Nepal",
    appliedDate: "Apr 15, 2025",
    location: "Lalitpur",
    status: "Pending",
  },
  {
    id: 3,
    position: "Full Stack Developer",
    company: "WebSolutions Ltd",
    appliedDate: "Apr 10, 2025",
    location: "Bhaktapur",
    status: "Rejected",
  },
];

const ApplicationsPage = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { openApplicationPanel } = useApplication();

  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        if (filter === "all") return true;
        return app.status.toLowerCase() === filter.toLowerCase();
      })
      .filter((app) => {
        if (!search) return true;
        const searchLower = search.toLowerCase();
        return (
          app.position.toLowerCase().includes(searchLower) ||
          app.company.toLowerCase().includes(searchLower) ||
          app.location.toLowerCase().includes(searchLower)
        );
      });
  }, [filter, search]);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Shortlisted":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  const handleReapply = (e: React.MouseEvent, application: any) => {
    e.preventDefault();
    // openApplicationPanel({
    //   id: application.id,
    //   title: application.position,
    //   employer_name: application.company,
    //   location: application.location,
    //   employment_type: "Full-time",
    //   salary_range: "Competitive",
    //   shortDescription: "",
    //   fullDescription: "",
    //   skills: [],
    //   postedTime: application.appliedDate,
    //   featured: false,
    //   closingDate: "",
    //   views: 0,
    //   applications: 0,
    //   requirements: [],
    //   responsibilities: [],
    //   benefits: [],
    // });
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1">My Applications</h1>
          <p className="text-neutral-600">
            Track and manage your job applications
          </p>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl">Applications</h2>
              <div className="flex space-x-4">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Applications" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Applications</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  placeholder="Search applications..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-[200px]"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredApplications.length === 0 ? (
              <div className="text-center text-neutral-600">
                No applications found matching your criteria
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredApplications.map((application) => (
                  <div
                    key={application.id}
                    className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg mb-2">{application.position}</h3>
                        <p className="text-neutral-600 mb-2">
                          {application.company}
                        </p>
                        <div className="flex space-x-4 text-sm text-neutral-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Applied on {application.appliedDate}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {application.location}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${getStatusStyles(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[200px]"
                          >
                            <Link
                              href={`/dashboard/applications/${application.id}`}
                            >
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                              onClick={(e) => handleReapply(e, application)}
                            >
                              Reapply
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Withdraw Application
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-600">
                Showing {filteredApplications.length} of {applications.length}{" "}
                applications
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button size="sm">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationsPage;
