'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Search, Filter, Download, Eye, Heart, Mail, Phone, MapPin, Calendar, Star, Users, Briefcase } from 'lucide-react';
import { JobseekerProfile, ResumeSearchFilters, ResumeSearchResponse } from '@/types/resume-search';
import { baseFetcher } from '@/lib/fetcher';
import ResumeFilters from './components/resume-filter';
import ResumeCard from './components/resume-card';
import DataNavigation from '@/components/ui/data-navigation';
import ResumeDetailsModal from './components/resume-details';
import SavedCandidatesModal from './components/saved-candidates';

const ResumeSearchPage: React.FC = () => {
  const [profiles, setProfiles] = useState<JobseekerProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<JobseekerProfile | null>(null);
  const [savedCandidates, setSavedCandidates] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [meta, setMeta] = useState<ResumeSearchResponse['meta'] | null>(null);

  const [filters, setFilters] = useState<ResumeSearchFilters>({
    keywords: '',
    location: '',
    experience_level: [],
    skills: [],
    availability_status: [],
    salary_range: { min: null, max: null },
    experience_years: { min: null, max: null },
    education_level: [],
    last_active: 'all',
    job_id: ''
  });

  // Fetch resumes with filters
  // Inside the fetchResumes function, modify the part where the response is processed:

const fetchResumes = useCallback(async (url?: string) => {
  try {
    setLoading(true);
    
    const searchParams = new URLSearchParams();
    
    // Add search query
    if (searchQuery.trim()) {
      searchParams.append('search', searchQuery.trim());
    }
    
    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== '' && value !== 'all') {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            searchParams.append(key, value.join(','));
          }
        } else if (typeof value === 'object' && value.min !== null && value.max !== null) {
          searchParams.append(`${key}_min`, value.min.toString());
          searchParams.append(`${key}_max`, value.max.toString());
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    const endpoint = url || `api/advance/resume-search?${searchParams.toString()}`;
    
    const { response, result } = await baseFetcher(endpoint, {
      method: 'GET',
    });

    if (response?.ok && result?.success) {
      // Transform the API response to match the expected JobseekerProfile format
      const transformedProfiles = result.data.map((item: any) => {
        // Handle cases where jobseekerProfile might be null
        if (!item.jobseekerProfile) {
          return {
            id: item.id,
            first_name: 'Unknown',
            last_name: '',
            email: item.email,
            phone: item.phone || '',
            location: '',
            skills: item.skills || [],
            experience_years: 0,
            last_active: 'Unknown',
            education_level: '',
            resume_url: null,
            availability: 'Unknown',
            profile_completeness: 0,
            experiences: [],
            educations: []
          };
        }

        // Calculate experience years
        const totalExperienceYears = item.experiences.reduce((total: number, exp: any) => {
          const startDate = new Date(exp.start_date);
          const endDate = exp.currently_work_here ? new Date() : (exp.end_date ? new Date(exp.end_date) : new Date());
          const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
          return total + years;
        }, 0);

        // Get highest education
        const highestEducation = item.educations.length > 0 ? item.educations[0].degree : '';

        // Format location
        const locationParts = [
          item.jobseekerProfile.district,
          item.jobseekerProfile.municipality,
          item.jobseekerProfile.city_tole
        ].filter(Boolean);
        const location = locationParts.join(', ');

        // Calculate profile completeness
        const hasProfile = !!item.jobseekerProfile;
        const hasExperience = item.experiences.length > 0;
        const hasEducation = item.educations.length > 0;
        const hasSkills = item.skills.length > 0;
        const profileCompleteness = [hasProfile, hasExperience, hasEducation, hasSkills]
          .filter(Boolean).length / 4 * 100;

        return {
          id: item.id,
          first_name: item.jobseekerProfile.first_name || '',
          last_name: item.jobseekerProfile.last_name || '',
          email: item.email,
          phone: item.phone || item.jobseekerProfile.mobile || '',
          location: location,
          skills: item.skills || [],
          experience_years: Math.round(totalExperienceYears * 10) / 10, // Round to 1 decimal place
          last_active: item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'Unknown',
          education_level: highestEducation,
          resume_url: null, // Assuming resume URL is not provided in the response
          availability: item.jobseekerProfile.preferred_job_type || 'Unknown',
          profile_completeness: Math.round(profileCompleteness),
          experiences: item?.experiences.map((exp: any) => ({
            id: exp?.id,
            position_title: exp?.position_title,
            company_name: exp?.company_name,
            start_date: new Date(exp?.start_date),
            end_date: exp?.end_date ? new Date(exp?.end_date) : null,
            currently_work_here: exp?.currently_work_here,
            job_level: exp?.job_level,
            industry: exp?.industry,
            roles_and_responsibilities: exp?.roles_and_responsibilities
          })),
          educations: item.educations.map((edu: any) => ({
            id: edu.id,
            degree: edu.degree,
            subject_major: edu.subject_major,
            institution: edu.institution,
            university_board: edu.university_board,
            joined_year: new Date(edu.joined_year),
            passed_year: edu.passed_year ? new Date(edu.passed_year) : null,
            currently_studying: edu.currently_studying
          }))
        };
      });

      setProfiles(transformedProfiles);
      setMeta(result.meta);
    } else {
      throw new Error('Failed to fetch resumes');
    }
  } catch (error) {
    console.error('Error fetching resumes:', error);
    toast({
      title: "Error",
      description: "Failed to load resumes",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
}, [searchQuery, filters]);


  // Fetch saved candidates
  const fetchSavedCandidates = useCallback(async () => {
    try {
      const { response, result } = await baseFetcher('api/advance/resume-search/saved-candidates', {
        method: 'GET',
      });

      if (response?.ok && result?.success) {
        setSavedCandidates(result.data.map((candidate: any) => candidate.jobseeker_id));
      }
    } catch (error) {
      console.error('Error fetching saved candidates:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchResumes();
    fetchSavedCandidates();
  }, []);

  // Handle search
  const handleSearch = () => {
    fetchResumes();
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: ResumeSearchFilters) => {
    setFilters(newFilters);
  };

  // Apply filters
  const applyFilters = () => {
    fetchResumes();
    setShowFilters(false);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      keywords: '',
      location: '',
      experience_level: [],
      skills: [],
      availability_status: [],
      salary_range: { min: null, max: null },
      experience_years: { min: null, max: null },
      education_level: [],
      last_active: 'all',
      job_id: ''
    });
    setSearchQuery('');
  };

  const handleSaveCandidate = async (profileId: number) => {
    try {
      const isSaved = savedCandidates.includes(profileId);
      const endpoint = isSaved ? 'api/advance/resume-search/unsave-candidate' : 'api/advance/resume-search/save-candidate';
      
      const { response, result } = await baseFetcher(endpoint, {
        method: 'POST',
        body: JSON.stringify({ jobseeker_id: profileId, job_id: filters.job_id }),
      });

      if (response?.ok && result?.success) {
        if (isSaved) {
          setSavedCandidates(prev => prev.filter(id => id !== profileId));
          toast({
            title: "Success",
            description: "Candidate removed from saved list",
          });
        } else {
          setSavedCandidates(prev => [...prev, profileId]);
          toast({
            title: "Success",
            description: "Candidate saved successfully",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save candidate",
        variant: "destructive",
      });
    }
  };

  // View profile details
  const handleViewProfile = (profile: JobseekerProfile) => {
    setSelectedProfile(profile);
    setShowDetailsModal(true);
  };

  // Download resume
  const handleDownloadResume = async (profile: JobseekerProfile) => {
    if (!profile.resume_url) {
      toast({
        title: "Error",
        description: "Resume not available for download",
        variant: "destructive",
      });
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = profile.resume_url;
      link.download = `${profile.first_name}_${profile.last_name}_Resume.pdf`;
      link.click();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download resume",
        variant: "destructive",
      });
    }
  };

  const hasActiveFilters = 
    filters.experience_level.length > 0 ||
    filters.skills.length > 0 ||
    filters.availability_status.length > 0 ||
    filters.salary_range.min !== null ||
    filters.salary_range.max !== null ||
    filters.experience_years.min !== null ||
    filters.experience_years.max !== null ||
    filters.education_level.length > 0 ||
    filters.last_active !== 'all' ||
    filters.location !== '' ||
    filters.job_id !== '';

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Resume Search</h1>
            <p className="text-gray-600">Find the perfect candidates for your open positions</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSavedModal(true)}
              className="flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Saved Candidates ({savedCandidates.length})
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by skills, job title, company, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            Search
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1">
                Active
              </Badge>
            )}
          </Button>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.experience_level.map(level => (
              <Badge key={level} variant="secondary">{level}</Badge>
            ))}
            {filters.skills.slice(0, 3).map(skill => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
            {filters.skills.length > 3 && (
              <Badge variant="secondary">+{filters.skills.length - 3} more</Badge>
            )}
            {filters.location && (
              <Badge variant="secondary">📍 {filters.location}</Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-800"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <ResumeFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onApply={applyFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Results Summary */}
      {meta && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            Showing {meta.from}-{meta.to} of {meta.total} candidates
          </p>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {meta.total} profiles found
            </span>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : profiles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {profiles.map((profile) => (
              <ResumeCard
                key={profile.id}
                profile={profile}
                isSaved={savedCandidates.includes(profile.id)}
                onSave={() => handleSaveCandidate(profile.id)}
                onView={() => handleViewProfile(profile)}
                onDownload={() => handleDownloadResume(profile)}
              />
            ))}
          </div>

          {/* Pagination */}
          {meta && (
            <DataNavigation
              meta={meta}
              onPageChange={fetchResumes}
              className="mt-6"
            />
          )}
        </>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No candidates found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters to find more candidates.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      {showDetailsModal && selectedProfile && (
        <ResumeDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          profile={selectedProfile}
          isSaved={savedCandidates.includes(selectedProfile.id)}
          onSave={() => handleSaveCandidate(selectedProfile.id)}
          onDownload={() => handleDownloadResume(selectedProfile)}
        />
      )}

      {showSavedModal && (
        <SavedCandidatesModal
          isOpen={showSavedModal}
          onClose={() => setShowSavedModal(false)}
          savedCandidateIds={savedCandidates}
          onRemove={handleSaveCandidate}
        />
      )}
    </div>
  );
};

export default ResumeSearchPage;
