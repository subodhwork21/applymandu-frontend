"use client";

import React, { useState, useMemo } from 'react';
import { Bell, Search, MoreVertical, Plus, X } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const alerts = [
  {
    id: 1,
    title: "Frontend Developer Jobs",
    keywords: ["React", "TypeScript", "Next.js"],
    frequency: "Daily",
    location: "Kathmandu",
    status: "Active",
    category: "Technology",
    salaryRange: "$60K - $90K",
    experienceLevel: "Mid Level"
  },
  {
    id: 2,
    title: "UI/UX Designer Positions",
    keywords: ["Figma", "UI Design", "User Research"],
    frequency: "Weekly",
    location: "Remote",
    status: "Active",
    category: "Design",
    salaryRange: "$50K - $80K",
    experienceLevel: "Entry Level"
  },
  {
    id: 3,
    title: "Product Manager Roles",
    keywords: ["Product Strategy", "Agile", "Leadership"],
    frequency: "Daily",
    location: "Lalitpur",
    status: "Paused",
    category: "Management",
    salaryRange: "$80K - $120K",
    experienceLevel: "Senior Level"
  }
];

const jobCategories = [
  "Technology",
  "Design",
  "Management",
  "Marketing",
  "Sales",
  "Finance",
  "Healthcare",
  "Education",
  "Engineering",
  "Customer Service"
];

const experienceLevels = [
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Lead",
  "Executive"
];

const AlertsPage = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isCreateAlertOpen, setIsCreateAlertOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAlertId, setEditingAlertId] = useState<number | null>(null);
  const [newAlert, setNewAlert] = useState({
    title: "",
    location: "",
    keywords: [] as string[],
    frequency: "daily",
    category: "",
    salaryMin: "",
    salaryMax: "",
    experienceLevel: ""
  });
  const [currentKeyword, setCurrentKeyword] = useState("");

  const filteredAlerts = useMemo(() => {
    return alerts
      .filter(alert => {
        if (filter === "all") return true;
        return alert.status.toLowerCase() === filter.toLowerCase();
      })
      .filter(alert => {
        if (!search) return true;
        const searchLower = search.toLowerCase();
        return (
          alert.title.toLowerCase().includes(searchLower) ||
          alert.keywords.some(keyword => keyword.toLowerCase().includes(searchLower)) ||
          alert.location.toLowerCase().includes(searchLower)
        );
      });
  }, [filter, search]);

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const handleAddKeyword = () => {
    if (currentKeyword.trim() && !newAlert.keywords.includes(currentKeyword.trim())) {
      setNewAlert({
        ...newAlert,
        keywords: [...newAlert.keywords, currentKeyword.trim()]
      });
      setCurrentKeyword("");
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setNewAlert({
      ...newAlert,
      keywords: newAlert.keywords.filter(keyword => keyword !== keywordToRemove)
    });
  };

  const handleEditAlert = (alert: any) => {
    // Parse salary range to get min and max values
    const salaryMatch = alert.salaryRange.match(/\$(\d+)K\s*-\s*\$(\d+)K/);
    const [, salaryMin, salaryMax] = salaryMatch || ['', '', ''];

    setNewAlert({
      title: alert.title,
      location: alert.location,
      keywords: [...alert.keywords],
      frequency: alert.frequency.toLowerCase(),
      category: alert.category.toLowerCase(),
      salaryMin: salaryMin,
      salaryMax: salaryMax,
      experienceLevel: alert.experienceLevel.toLowerCase()
    });
    setEditingAlertId(alert.id);
    setIsEditMode(true);
    setIsCreateAlertOpen(true);
  };

  const handleCreateOrUpdateAlert = () => {
    if (isEditMode) {
      console.log('Updating alert:', {
        id: editingAlertId,
        ...newAlert,
        salaryRange: newAlert.salaryMin && newAlert.salaryMax 
          ? `$${newAlert.salaryMin}K - $${newAlert.salaryMax}K`
          : undefined
      });
    } else {
      console.log('Creating new alert:', {
        ...newAlert,
        salaryRange: newAlert.salaryMin && newAlert.salaryMax 
          ? `$${newAlert.salaryMin}K - $${newAlert.salaryMax}K`
          : undefined
      });
    }

    setIsCreateAlertOpen(false);
    setIsEditMode(false);
    setEditingAlertId(null);
    setNewAlert({
      title: "",
      location: "",
      keywords: [],
      frequency: "daily",
      category: "",
      salaryMin: "",
      salaryMax: "",
      experienceLevel: ""
    });
  };

  const handleCloseModal = () => {
    setIsCreateAlertOpen(false);
    setIsEditMode(false);
    setEditingAlertId(null);
    setNewAlert({
      title: "",
      location: "",
      keywords: [],
      frequency: "daily",
      category: "",
      salaryMin: "",
      salaryMax: "",
      experienceLevel: ""
    });
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1">Job Alerts</h1>
          <p className="text-neutral-600">Stay updated with new opportunities matching your preferences</p>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl">My Alerts</h2>
              <div className="flex space-x-4">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Alerts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Alerts</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  placeholder="Search alerts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-[200px]"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlerts.map((alert) => (
                <div key={alert.id} className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                        <Bell className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{alert.title}</h3>
                        <p className="text-neutral-600 text-sm">{alert.location}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuItem onClick={() => handleEditAlert(alert)}>
                          Edit Alert
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {alert.status === 'Active' ? 'Pause Alert' : 'Resume Alert'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete Alert
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-neutral-600 mb-2">Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {alert.keywords.map((keyword, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">
                        {alert.frequency} updates
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyles(alert.status)}`}>
                        {alert.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-600">
                Showing {filteredAlerts.length} of {alerts.length} alerts
              </div>
              <Button 
                className="bg-black text-white hover:bg-neutral-800"
                onClick={() => {
                  setIsEditMode(false);
                  setIsCreateAlertOpen(true);
                }}
              >
                Create New Alert
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Alert Modal */}
      <Dialog open={isCreateAlertOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Job Alert' : 'Create New Job Alert'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Alert Title</Label>
              <Input
                placeholder="e.g., Frontend Developer Jobs"
                value={newAlert.title}
                onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Job Category</Label>
              <Select
                value={newAlert.category}
                onValueChange={(value) => setNewAlert({ ...newAlert, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job category" />
                </SelectTrigger>
                <SelectContent>
                  {jobCategories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Experience Level</Label>
              <Select
                value={newAlert.experienceLevel}
                onValueChange={(value) => setNewAlert({ ...newAlert, experienceLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level.toLowerCase()}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Salary Range (Annual)</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Min (K)"
                    value={newAlert.salaryMin}
                    onChange={(e) => setNewAlert({ ...newAlert, salaryMin: e.target.value })}
                  />
                </div>
                <span className="text-neutral-500">to</span>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Max (K)"
                    value={newAlert.salaryMax}
                    onChange={(e) => setNewAlert({ ...newAlert, salaryMax: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="e.g., Kathmandu, Remote"
                value={newAlert.location}
                onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Keywords</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add keywords"
                  value={currentKeyword}
                  onChange={(e) => setCurrentKeyword(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddKeyword();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleAddKeyword}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {newAlert.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {keyword}
                    <button
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="hover:text-neutral-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Alert Frequency</Label>
              <Select
                value={newAlert.frequency}
                onValueChange={(value) => setNewAlert({ ...newAlert, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button 
              className="bg-black text-white hover:bg-neutral-800"
              onClick={handleCreateOrUpdateAlert}
            >
              {isEditMode ? 'Update Alert' : 'Create Alert'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AlertsPage;