'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Heart,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Briefcase,
  GraduationCap,
  Award,
  ExternalLink,
  Clock,
  DollarSign,
  User
} from 'lucide-react';
import { JobseekerProfile } from '@/types/resume-search';
import { format } from 'date-fns';

interface ResumeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: JobseekerProfile;
  isSaved: boolean;
  onSave: () => void;
  onDownload: () => void;
}

const ResumeDetailsModal: React.FC<ResumeDetailsModalProps> = ({
  isOpen,
  onClose,
  profile,
  isSaved,
  onSave,
  onDownload
}) => {
  const [activeTab, setActiveTab] = useState('overview');

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

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'bg-red-100 text-red-800';
      case 'advanced':
        return 'bg-orange-100 text-orange-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'beginner':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  console.log(profile)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Candidate Profile</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onSave}
                className={`flex items-center gap-1 ${
                  isSaved ? 'text-red-600 border-red-200' : ''
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              
              {profile.resume_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDownload}
                  className="flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  Download CV
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.profile_image || ''} />
                  <AvatarFallback className="text-lg">
                    {getInitials(profile.first_name, profile.last_name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold">
                      {profile.first_name} {profile.last_name}
                    </h2>
                    {profile.is_verified && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Verified
                      </Badge>
                    )}
                    {profile.match_score && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Star className="w-3 h-3 mr-1" />
                        {profile.match_score}% match
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-lg text-gray-700 mb-3">{profile.headline}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span>{profile.total_experience_years} years</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span>{profile.expected_salary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{profile.notice_period}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <Badge className="bg-blue-100 text-blue-800">
                      {profile.experience_level}
                    </Badge>
                    <Badge className={getAvailabilityColor(profile?.availability_status)}>
                      {profile?.availability_status?.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Contact Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <Button
                  className="flex items-center gap-2"
                  onClick={() => window.open(`mailto:${profile.email}`)}
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </Button>
                
                {profile.phone && (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => window.open(`tel:${profile.phone}`)}
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Professional Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{profile.summary}</p>
                </CardContent>
              </Card>

              {/* Profile Completion */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Overall Completion</span>
                      <span className="font-medium">{profile.profile_completion}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${profile.profile_completion}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio Links */}
              {profile?.portfolio_links?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="w-5 h-5" />
                      Portfolio & Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {profile.portfolio_links.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {link}
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-4">
              {profile?.experience?.length > 0 ? (
                profile?.experience?.map((exp) => (
                  <Card key={exp.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{exp.position}</h3>
                          <p className="text-blue-600 font-medium">{exp.company_name}</p>
                          <p className="text-sm text-gray-600">{exp.location}</p>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p>
                            {format(new Date(exp.start_date), 'MMM yyyy')} - {' '}
                            {exp.is_current ? 'Present' : format(new Date(exp.end_date!), 'MMM yyyy')}
                          </p>
                          {exp.is_current && (
                            <Badge variant="secondary" className="mt-1">Current</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    No work experience information available.
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="space-y-4">
              {profile?.education?.length > 0 ? (
                profile?.education?.map((edu) => (
                  <Card key={edu.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{edu.degree}</h3>
                          <p className="text-blue-600 font-medium">{edu.institution}</p>
                          <p className="text-gray-600">{edu.field_of_study}</p>
                          {edu.grade && (
                            <p className="text-sm text-gray-600">Grade: {edu.grade}</p>
                          )}
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p>
                            {format(new Date(edu.start_date), 'yyyy')} - {' '}
                            {format(new Date(edu.end_date), 'yyyy')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    No education information available.
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Technical Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.skills.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.skills.map((skill) => (
                        <div key={skill.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="font-medium">{skill.name}</span>
                          <Badge className={getSkillLevelColor(skill.level)}>
                            {skill.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center">No skills information available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Certifications Tab */}
            <TabsContent value="certifications" className="space-y-4">
              {profile?.certifications?.length > 0 ? (
                profile?.certifications?.map((cert) => (
                  <Card key={cert.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Award className="w-5 h-5 text-yellow-600" />
                            {cert.name}
                          </h3>
                          <p className="text-blue-600 font-medium">{cert.issuing_organization}</p>
                          {cert.credential_id && (
                            <p className="text-sm text-gray-600">ID: {cert.credential_id}</p>
                          )}
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p>Issued: {format(new Date(cert.issue_date), 'MMM yyyy')}</p>
                          {cert.expiry_date && (
                            <p>Expires: {format(new Date(cert.expiry_date), 'MMM yyyy')}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    No certifications available.
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeDetailsModal;
