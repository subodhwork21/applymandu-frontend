"use client";

import React from 'react';
import { Plus, X, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdditionalDetailsProps {
  additionalDetails: {
    skills: string[];
    languages: Array<{
      id: number;
      language: string;
      proficiency: string;
    }>;
    training: Array<{
      id: number;
      title: string;
      institution: string;
      description: string;
    }>;
    certificates: Array<{
      id: number;
      title: string;
      issuer: string;
      year: string;
    }>;
    socialLinks: {
      linkedin: string;
      github: string;
      portfolio: string;
    };
    references: Array<{
      id: number;
      name: string;
      position: string;
      company: string;
      email: string;
      phone: string;
    }>;
  };
  updateAdditionalDetails: (field: string, value: any) => void;
}

const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({
  additionalDetails,
  updateAdditionalDetails,
}) => {
  const addSkill = (skill: string) => {
    if (skill.trim()) {
      updateAdditionalDetails('skills', [...additionalDetails.skills, skill.trim()]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateAdditionalDetails('skills', additionalDetails.skills.filter(skill => skill !== skillToRemove));
  };

  const addLanguage = () => {
    const newLanguage = {
      id: additionalDetails.languages.length + 1,
      language: '',
      proficiency: '',
    };
    updateAdditionalDetails('languages', [...additionalDetails.languages, newLanguage]);
  };

  const removeLanguage = (id: number) => {
    updateAdditionalDetails('languages', additionalDetails.languages.filter(lang => lang.id !== id));
  };

  const updateLanguage = (id: number, field: string, value: string) => {
    updateAdditionalDetails('languages', additionalDetails.languages.map(lang =>
      lang.id === id ? { ...lang, [field]: value } : lang
    ));
  };

  const addTraining = () => {
    const newTraining = {
      id: additionalDetails.training.length + 1,
      title: '',
      institution: '',
      description: '',
    };
    updateAdditionalDetails('training', [...additionalDetails.training, newTraining]);
  };

  const removeTraining = (id: number) => {
    updateAdditionalDetails('training', additionalDetails.training.filter(train => train.id !== id));
  };

  const updateTraining = (id: number, field: string, value: string) => {
    updateAdditionalDetails('training', additionalDetails.training.map(train =>
      train.id === id ? { ...train, [field]: value } : train
    ));
  };

  const addCertificate = () => {
    const newCertificate = {
      id: additionalDetails.certificates.length + 1,
      title: '',
      issuer: '',
      year: '',
    };
    updateAdditionalDetails('certificates', [...additionalDetails.certificates, newCertificate]);
  };

  const removeCertificate = (id: number) => {
    updateAdditionalDetails('certificates', additionalDetails.certificates.filter(cert => cert.id !== id));
  };

  const updateCertificate = (id: number, field: string, value: string) => {
    updateAdditionalDetails('certificates', additionalDetails.certificates.map(cert =>
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const updateSocialLink = (platform: string, value: string) => {
    updateAdditionalDetails('socialLinks', {
      ...additionalDetails.socialLinks,
      [platform]: value,
    });
  };

  const addReference = () => {
    const newReference = {
      id: additionalDetails.references.length + 1,
      name: '',
      position: '',
      company: '',
      email: '',
      phone: '',
    };
    updateAdditionalDetails('references', [...additionalDetails.references, newReference]);
  };

  const removeReference = (id: number) => {
    updateAdditionalDetails('references', additionalDetails.references.filter(ref => ref.id !== id));
  };

  const updateReference = (id: number, field: string, value: string) => {
    updateAdditionalDetails('references', additionalDetails.references.map(ref =>
      ref.id === id ? { ...ref, [field]: value } : ref
    ));
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-neutral-200">
      <div className="space-y-8">
        {/* Skills */}
        <div>
          <h3 className="text-lg font-medium mb-4">Skills</h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addSkill((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Add a skill"]') as HTMLInputElement;
                  addSkill(input.value);
                  input.value = '';
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {additionalDetails.skills.map((skill) => (
                <div
                  key={skill}
                  className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => removeSkill(skill)}
                    className="hover:text-neutral-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Languages */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Languages</h3>
            <Button onClick={addLanguage} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Language
            </Button>
          </div>
          <div className="space-y-4">
            {additionalDetails.languages.map((lang) => (
              <div key={lang.id} className="flex gap-4 items-start">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Language"
                    value={lang.language}
                    onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                  />
                  <Select
                    value={lang.proficiency}
                    onValueChange={(value) => updateLanguage(lang.id, 'proficiency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select proficiency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="native">Native</SelectItem>
                      <SelectItem value="fluent">Fluent</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLanguage(lang.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Training */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Training & Courses</h3>
            <Button onClick={addTraining} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Training
            </Button>
          </div>
          <div className="space-y-6">
            {additionalDetails.training.map((train) => (
              <div key={train.id} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 space-y-4">
                    <Input
                      placeholder="Training Title"
                      value={train.title}
                      onChange={(e) => updateTraining(train.id, 'title', e.target.value)}
                    />
                    <Input
                      placeholder="Institution"
                      value={train.institution}
                      onChange={(e) => updateTraining(train.id, 'institution', e.target.value)}
                    />
                    <Textarea
                      placeholder="Description"
                      value={train.description}
                      onChange={(e) => updateTraining(train.id, 'description', e.target.value)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTraining(train.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Certificates</h3>
            <Button onClick={addCertificate} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Certificate
            </Button>
          </div>
          <div className="space-y-4">
            {additionalDetails.certificates.map((cert) => (
              <div key={cert.id} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <Input
                      placeholder="Certificate Title"
                      value={cert.title}
                      onChange={(e) => updateCertificate(cert.id, 'title', e.target.value)}
                      className="col-span-2"
                    />
                    <Input
                      placeholder="Year"
                      value={cert.year}
                      onChange={(e) => updateCertificate(cert.id, 'year', e.target.value)}
                    />
                    <Input
                      placeholder="Issuing Organization"
                      value={cert.issuer}
                      onChange={(e) => updateCertificate(cert.id, 'issuer', e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCertificate(cert.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-medium mb-4">Social Links</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <LinkIcon className="h-5 w-5 text-neutral-500" />
              <Input
                placeholder="LinkedIn URL"
                value={additionalDetails.socialLinks.linkedin}
                onChange={(e) => updateSocialLink('linkedin', e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <LinkIcon className="h-5 w-5 text-neutral-500" />
              <Input
                placeholder="GitHub URL"
                value={additionalDetails.socialLinks.github}
                onChange={(e) => updateSocialLink('github', e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <LinkIcon className="h-5 w-5 text-neutral-500" />
              <Input
                placeholder="Portfolio URL"
                value={additionalDetails.socialLinks.portfolio}
                onChange={(e) => updateSocialLink('portfolio', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* References */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">References</h3>
            <Button onClick={addReference} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Reference
            </Button>
          </div>
          <div className="space-y-6">
            {additionalDetails.references.map((ref) => (
              <div key={ref.id} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-sm font-medium">Reference {ref.id}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeReference(ref.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Full Name"
                    value={ref.name}
                    onChange={(e) => updateReference(ref.id, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Position"
                    value={ref.position}
                    onChange={(e) => updateReference(ref.id, 'position', e.target.value)}
                  />
                  <Input
                    placeholder="Company"
                    value={ref.company}
                    onChange={(e) => updateReference(ref.id, 'company', e.target.value)}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={ref.email}
                    onChange={(e) => updateReference(ref.id, 'email', e.target.value)}
                  />
                  <Input
                    placeholder="Phone"
                    value={ref.phone}
                    onChange={(e) => updateReference(ref.id, 'phone', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalDetails;