'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  Eye, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Star,
  Briefcase,
  GraduationCap,
  Clock,
  DollarSign
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ResumeCardProps {
  profile: any; // Using any for now to match the API response
  isSaved: boolean;
  onSave: () => void;
  onView: () => void;
  onDownload: () => void;
}

const ResumeCard: React.FC<ResumeCardProps> = ({
  profile,
  isSaved,
  onSave,
  onView,
  onDownload
}) => {
  // Extract relevant data from the profile
  const firstName = profile?.first_name || 'Unknown';
  const lastName = profile?.last_name || '';
  const email = profile.email || '';
  const phone = profile.phone || profile.jobseekerProfile?.mobile || '';
  
  // Format location
  const locationParts = profile.jobseekerProfile ? [
    profile.jobseekerProfile.district,
    profile.jobseekerProfile.municipality,
    profile.jobseekerProfile.city_tole
  ].filter(Boolean) : [];
  const location = locationParts.length > 0 ? locationParts.join(', ') : 'Location not specified';
  
  // Calculate experience years
  const totalExperienceYears = profile.experiences?.reduce((total: number, exp: any) => {
    const startDate = new Date(exp.start_date);
    const endDate = exp.currently_work_here ? new Date() : (exp.end_date ? new Date(exp.end_date) : new Date());
    const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return total + years;
  }, 0) || 0;
  
  // Get highest education
  const highestEducation = profile.educations?.length > 0 ? profile.educations[0].degree : 'Not specified';
  
  // Calculate profile completion
  const hasProfile = !!profile.jobseekerProfile;
  const hasExperience = profile.experiences?.length > 0;
  const hasEducation = profile.educations?.length > 0;
  const hasSkills = profile.skills?.length > 0;
  const profileCompletion = Math.round(([hasProfile, hasExperience, hasEducation, hasSkills]
    .filter(Boolean).length / 4) * 100);
  
  // Get headline from job title or industry
  const headline = profile.experiences?.length > 0 
    ? profile.experiences[0].position_title 
    : (profile.jobseekerProfile?.industry || 'Job Seeker');
  
  // Determine availability status
  const availabilityStatus = profile.jobseekerProfile?.preferred_job_type === 'internship' 
    ? 'open_to_offers' 
    : (profile.jobseekerProfile?.preferred_job_type ? 'available' : 'not_available');
  
  // Get expected salary
  const expectedSalary = profile.jobseekerProfile?.salary_expectations || 'Not specified';
  
  // Get notice period (not directly available in the data)
  const noticePeriod = 'Not specified';
  
  // Get experience level from the most recent job
  const experienceLevel = profile.experiences?.length > 0 
    ? (profile.experiences[0].job_level === 'mid' ? 'Mid Level' : 
       profile.experiences[0].job_level === 'senior' ? 'Senior Level' : 
       profile.experiences[0].job_level === 'executive' ? 'Executive Level' : 'Entry Level')
    : 'Entry Level';
  
  // Get last active time
  const lastActive = profile.updated_at ? new Date(profile.updated_at) : new Date();
  
  // Get summary/career objectives
  const summary = profile.jobseekerProfile?.career_objectives || 'No summary provided';
  
  // Check if profile is verified (assuming all profiles in the system are verified)
  const isVerified = true;
  
  // Get profile image (not available in the data)
  const profileImage = '';
  
  // Get match score (not available in the data)
  const matchScore = null;

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'not_available':
        return 'bg-red-100 text-red-800';
      case 'open_to_offers':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getExperienceColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'entry level':
        return 'bg-blue-100 text-blue-800';
      case 'mid level':
        return 'bg-purple-100 text-purple-800';
      case 'senior level':
        return 'bg-orange-100 text-orange-800';
      case 'executive level':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 relative">
      {/* Match Score Badge */}
      {matchScore && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Star className="w-3 h-3 mr-1" />
            {matchScore}% match
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={profileImage} />
            <AvatarFallback>
              {getInitials(firstName, lastName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">
                {firstName} {lastName}
              </h3>
              {isVerified && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                  Verified
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-2 line-clamp-1">
              {headline}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {location}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(lastActive, { addSuffix: true })}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary */}
        <p className="text-sm text-gray-700 line-clamp-2">
          {summary}
        </p>

        {/* Key Info */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-gray-400" />
            <span>{Math.round(totalExperienceYears * 10) / 10} years exp.</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-gray-400" />
            <span>{expectedSalary}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span>{noticePeriod}</span>
          </div>
          <div className="flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-gray-400" />
            <span>{highestEducation || 'N/A'}</span>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={getExperienceColor(experienceLevel)}>
            {experienceLevel}
          </Badge>
          <Badge className={getAvailabilityColor(availabilityStatus)}>
            {availabilityStatus.replace('_', ' ')}
          </Badge>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {profile.skills?.slice(0, 4).map((skill: any) => (
              <Badge key={skill.id} variant="outline" className="text-xs">
                {skill.name}
              </Badge>
            ))}
            {profile.skills?.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{profile.skills.length - 4} more
              </Badge>
            )}
            {(!profile.skills || profile.skills.length === 0) && (
              <span className="text-xs text-gray-500">No skills listed</span>
            )}
          </div>
        </div>

        {/* Profile Completion */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Profile Completion</span>
            <span className="font-medium">{profileCompletion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={onView}
            className="flex-1 flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            View
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            className={`flex items-center gap-1 ${
              isSaved ? 'text-red-600 border-red-200' : ''
            }`}
          >
            <Heart className={`w-3 h-3 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'Saved' : 'Save'}
          </Button>
          
          {/* Only show download button if resume URL is available */}
          {profile.resume_url && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              CV
            </Button>
          )}
        </div>

        {/* Contact Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 flex items-center gap-1"
            onClick={() => window.open(`mailto:${email}`)}
          >
            <Mail className="w-3 h-3" />
            Email
          </Button>
          
          {phone && (
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 flex items-center gap-1"
              onClick={() => window.open(`tel:${phone}`)}
            >
              <Phone className="w-3 h-3" />
              Call
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeCard;
