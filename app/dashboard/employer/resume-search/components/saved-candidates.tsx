'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Heart, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  Trash2,
  Users
} from 'lucide-react';
import { JobseekerProfile } from '@/types/resume-search';
import { toast } from '@/hooks/use-toast';
import { baseFetcher } from '@/lib/fetcher';

interface SavedCandidatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedCandidateIds: number[];
  onRemove: (candidateId: number) => void;
}

const SavedCandidatesModal: React.FC<SavedCandidatesModalProps> = ({
  isOpen,
  onClose,
  savedCandidateIds,
  onRemove
}) => {
  const [savedCandidates, setSavedCandidates] = useState<JobseekerProfile[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<JobseekerProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch saved candidates details
  useEffect(() => {
    if (isOpen && savedCandidateIds.length > 0) {
      fetchSavedCandidates();
    }
  }, [isOpen, savedCandidateIds]);

  // Filter candidates based on search
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = savedCandidates.filter(candidate =>
        `${candidate.first_name} ${candidate.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some(skill => skill.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredCandidates(filtered);
    } else {
      setFilteredCandidates(savedCandidates);
    }
  }, [searchQuery, savedCandidates]);

  const fetchSavedCandidates = async () => {
    try {
      setLoading(true);
      const { response, result } = await baseFetcher('api/advance/resume-search/saved-candidates', {
        method: 'get',
      });

      if (response?.ok && result?.success) {
        setSavedCandidates(result.data);
      }
    } catch (error) {
      console.error('Error fetching saved candidates:', error);
      toast({
        title: "Error",
        description: "Failed to load saved candidates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (candidateId: number) => {
    try {
      await onRemove(candidateId);
      setSavedCandidates(prev => prev.filter(c => c.id !== candidateId));
    } catch (error) {
      console.error('Error removing candidate:', error);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0)}${lastName?.charAt(0)}`.toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600" />
            Saved Candidates ({savedCandidateIds.length})
          </DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search saved candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCandidates.length > 0 ? (
            <div className="space-y-4">
              {filteredCandidates.map((candidate) => (
                <Card key={candidate.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={candidate.profile_image || ''} />
                        <AvatarFallback>
                          {getInitials(candidate.first_name, candidate.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">
                            {candidate.first_name} {candidate.last_name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(candidate.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <p className="text-gray-600 mb-2 line-clamp-1">
                          {candidate.headline}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {candidate.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {candidate.total_experience_years} years
                          </div>
                        </div>
                        
                        {/* Skills */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {candidate?.skills?.slice(0, 3).map((skill) => (
                            <Badge key={skill?.id} variant="outline" className="text-xs">
                              {skill?.name}
                            </Badge>
                          ))}
                          {candidate?.skills?.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{candidate?.skills?.length - 3} more
                            </Badge>
                          )}
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => window.open(`mailto:${candidate.email}`)}
                          >
                            <Mail className="w-3 h-3" />
                            Email
                          </Button>
                          
                          {candidate.phone && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => window.open(`tel:${candidate.phone}`)}
                            >
                              <Phone className="w-3 h-3" />
                              Call
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : savedCandidateIds.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Saved Candidates
              </h3>
              <p className="text-gray-600">
                Start saving candidates from the resume search to build your talent pool.
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Results Found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search terms to find saved candidates.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SavedCandidatesModal;
