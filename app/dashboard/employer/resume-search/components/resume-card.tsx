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
import { JobseekerProfile } from '@/types/resume-search';
import { formatDistanceToNow } from 'date-fns';

interface ResumeCardProps {
  profile: JobseekerProfile;
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
      {profile.match_score && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Star className="w-3 h-3 mr-1" />
            {profile.match_score}% match
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={profile.profile_image || ''} />
            <AvatarFallback>
              {getInitials(profile.first_name, profile.last_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">
                {profile.first_name} {profile.last_name}
              </h3>
              {profile.is_verified && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                  Verified
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-2 line-clamp-1">
              {profile.headline}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {profile.location}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(profile.last_active), { addSuffix: true })}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary */}
        <p className="text-sm text-gray-700 line-clamp-2">
          {profile.summary}
        </p>

        {/* Key Info */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-gray-400" />
            <span>{profile.total_experience_years} years exp.</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-gray-400" />
            <span>{profile.expected_salary}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span>{profile.notice_period}</span>
          </div>
          <div className="flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-gray-400" />
            <span>{profile.education[0]?.degree || 'N/A'}</span>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={getExperienceColor(profile.experience_level)}>
            {profile.experience_level}
          </Badge>
          <Badge className={getAvailabilityColor(profile.availability_status)}>
            {profile.availability_status.replace('_', ' ')}
          </Badge>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {profile.skills.slice(0, 4).map((skill) => (
              <Badge key={skill.id} variant="outline" className="text-xs">
                {skill.name}
              </Badge>
            ))}
            {profile.skills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{profile.skills.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Profile Completion */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Profile Completion</span>
            <span className="font-medium">{profile.profile_completion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${profile.profile_completion}%` }}
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
            onClick={() => window.open(`mailto:${profile.email}`)}
          >
            <Mail className="w-3 h-3" />
            Email
          </Button>
          
          {profile.phone && (
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 flex items-center gap-1"
              onClick={() => window.open(`tel:${profile.phone}`)}
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
