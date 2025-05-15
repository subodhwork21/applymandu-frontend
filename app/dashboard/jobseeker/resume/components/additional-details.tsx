"use client";

import React from 'react';
import { Plus, X, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormInput from "@/components/fields/input-field";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Skill {
  id: number;
  name: string;
}

interface Language {
  id: number;
  user_id: number;
  language: string;
  proficiency: string;
  created_at: string;
  updated_at: string;
}

interface Training {
  id: number;
  user_id: number;
  title: string;
  institution: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface Certificate {
  id: number;
  user_id: number;
  title: string;
  issuer: string;
  year: string;
  created_at: string;
  updated_at: string;
}

interface SocialLink {
  id: number;
  user_id: number;
  platform: string;
  url: string;
  created_at: string;
  updated_at: string;
}

interface Reference {
  id: number;
  user_id: number;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

interface AdditionalDetailsProps {
  additionalDetails: {
    skills: Skill[];
    languages: Language[];
    trainings: Training[];
    certificates: Certificate[];
    social_links: SocialLink[];
    references: Reference[];
  };
  updateAdditionalDetails: (field: string, value: any) => void;
  errors?: Record<string, string>; // Add errors prop
}

const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({
  additionalDetails,
  updateAdditionalDetails,
  errors = {}, // Default to empty object
}) => {
  const addSkill = (skillName: string) => {
    if (skillName.trim()) {
      const newSkill: Skill = {
        id: additionalDetails.skills.length ? Math.max(...additionalDetails.skills.map(s => s.id)) + 1 : 1,
        name: skillName.trim()
      };
      updateAdditionalDetails('skills', [...additionalDetails.skills, newSkill]);
    }
  };

  const removeSkill = (skillId: number) => {
    updateAdditionalDetails('skills', additionalDetails.skills.filter(skill => skill.id !== skillId));
  };

  const addLanguage = () => {
    const newLanguage: Language = {
      id: additionalDetails.languages.length ? Math.max(...additionalDetails.languages.map(l => l.id)) + 1 : 1,
      user_id: 0, // This will be set by the backend
      language: '',
      proficiency: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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
    const newTraining: Training = {
      id: additionalDetails.trainings.length ? Math.max(...additionalDetails.trainings.map(t => t.id)) + 1 : 1,
      user_id: 0, // This will be set by the backend
      title: '',
      institution: '',
      description: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    updateAdditionalDetails('trainings', [...additionalDetails.trainings, newTraining]);
  };

  const removeTraining = (id: number) => {
    updateAdditionalDetails('trainings', additionalDetails.trainings.filter(train => train.id !== id));
  };

  const updateTraining = (id: number, field: string, value: string) => {
    updateAdditionalDetails('trainings', additionalDetails.trainings.map(train =>
      train.id === id ? { ...train, [field]: value } : train
    ));
  };

  const addCertificate = () => {
    const newCertificate: Certificate = {
      id: additionalDetails.certificates.length ? Math.max(...additionalDetails.certificates.map(c => c.id)) + 1 : 1,
      user_id: 0, // This will be set by the backend
      title: '',
      issuer: '',
      year: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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

  const updateSocialLink = (platform: string, url: string) => {
    // Find if this platform already exists
    const existingIndex = additionalDetails.social_links.findIndex(link => link.platform === platform);
    
    if (existingIndex >= 0) {
      // Update existing link
      const updatedLinks = [...additionalDetails.social_links];
      updatedLinks[existingIndex] = {
        ...updatedLinks[existingIndex],
        url: url,
        updated_at: new Date().toISOString()
      };
      updateAdditionalDetails('social_links', updatedLinks);
    } else {
      // Add new link
      const newLink: SocialLink = {
        id: additionalDetails.social_links.length ? Math.max(...additionalDetails.social_links.map(l => l.id)) + 1 : 1,
        user_id: 0, // This will be set by the backend
        platform: platform,
        url: url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      updateAdditionalDetails('social_links', [...additionalDetails.social_links, newLink]);
    }
  };

  const addReference = () => {
    const newReference: Reference = {
      id: additionalDetails.references.length ? Math.max(...additionalDetails.references.map(r => r.id)) + 1 : 1,
      user_id: 0, // This will be set by the backend
      name: '',
      position: '',
      company: '',
      email: '',
      phone: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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

  // Helper function to get social link URL by platform
  const getSocialLinkUrl = (platform: string): string => {
    const link = additionalDetails.social_links.find(link => link.platform === platform);
    return link ? link.url : '';
  };

  // Helper function to get error for a specific field
  const getError = (field: string): string => {
    return errors[field] || '';
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-neutral-200">
      <div className="space-y-8">
        {/* Skills */}
        <div>
          <h3 className="text-lg font-medium mb-4">Skills </h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <FormInput
                placeholder="Add a skill"
                error={getError('skills')}
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
                  key={skill.id}
                  className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <span>{skill.name}</span>
                  <button
                    onClick={() => removeSkill(skill.id)}
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
            <h3 className="text-lg font-medium">Languages <span className="text-red-500">*</span></h3>
            <Button onClick={addLanguage} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Language
            </Button>
          </div>
          <div className="space-y-4">
            {additionalDetails.languages.map((lang) => (
              <div key={lang.id} className="flex gap-4 items-start">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <FormInput
                  required={true}
                    placeholder="Language"
                    value={lang.language}
                    error={getError(`languages.${lang.id}.language`)}
                    onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                  />
                  <Select
                    value={lang.proficiency}
                    onValueChange={(value) => updateLanguage(lang.id, 'proficiency', value)}
                  >
                    <SelectTrigger className={errors[`languages.${lang.id}.proficiency`] ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select proficiency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Native">Native</SelectItem>
                      <SelectItem value="Fluent">Fluent</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Basic">Basic</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors[`languages.${lang.id}.proficiency`] && (
                    <p className="text-sm text-red-500 mt-1 col-span-2">
                      {errors[`languages.${lang.id}.proficiency`]}
                    </p>
                  )}
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
            <h3 className="text-lg font-medium">Training & Courses </h3>
            <Button onClick={addTraining} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Training
            </Button>
          </div>
          <div className="space-y-6">
            {additionalDetails.trainings.map((train) => (
              <div key={train.id} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 space-y-4">
                    <FormInput
                    required={true}
                      placeholder="Training Title"
                      value={train.title}
                      error={getError(`trainings.${train.id}.title`)}
                      onChange={(e) => updateTraining(train.id, 'title', e.target.value)}
                    />
                    <FormInput
                      placeholder="Institution"
                      value={train.institution}
                      error={getError(`trainings.${train.id}.institution`)}
                      onChange={(e) => updateTraining(train.id, 'institution', e.target.value)}
                    />
                    <Textarea
                      placeholder="Description"
                      value={train.description}
                      onChange={(e) => updateTraining(train.id, 'description', e.target.value)}
                      className={errors[`trainings.${train.id}.description`] ? 'border-red-500' : ''}
                    />
                    {errors[`trainings.${train.id}.description`] && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors[`trainings.${train.id}.description`]}
                      </p>
                    )}
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
            <h3 className="text-lg font-medium">Certificates </h3>
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
                    <FormInput
                      placeholder="Certificate Title"
                      value={cert.title}
                      error={getError(`certificates.${cert.id}.title`)}
                      onChange={(e) => updateCertificate(cert.id, 'title', e.target.value)}
                      className="col-span-2"
                    />
                    <FormInput
                      placeholder="Year"
                      value={cert.year}
                      error={getError(`certificates.${cert.id}.year`)}
                      onChange={(e) => updateCertificate(cert.id, 'year', e.target.value)}
                    />
                    <FormInput
                      placeholder="Issuing Organization"
                      value={cert.issuer}
                      error={getError(`certificates.${cert.id}.issuer`)}
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
              <FormInput
                placeholder="LinkedIn URL"
                value={getSocialLinkUrl('linkedin')}
                error={getError('social_links.linkedin')}
                onChange={(e) => updateSocialLink('linkedin', e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <LinkIcon className="h-5 w-5 text-neutral-500" />
              <FormInput
                placeholder="GitHub URL"
                value={getSocialLinkUrl('github')}
                error={getError('social_links.github')}
                onChange={(e) => updateSocialLink('github', e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <LinkIcon className="h-5 w-5 text-neutral-500" />
              <FormInput
                placeholder="Portfolio URL"
                value={getSocialLinkUrl('portfolio')}
                error={getError('social_links.portfolio')}
                onChange={(e) => updateSocialLink('portfolio', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* References */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">References </h3>
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
                  <FormInput
                    required={true}
                    placeholder="Full Name"
                    value={ref.name}
                    error={getError(`references.${ref.id}.name`)}
                    onChange={(e) => updateReference(ref.id, 'name', e.target.value)}
                  />
                  <FormInput
                    placeholder="Position"
                    value={ref.position}
                    error={getError(`references.${ref.id}.position`)}
                    onChange={(e) => updateReference(ref.id, 'position', e.target.value)}
                  />
                  <FormInput
                    placeholder="Company"
                    value={ref.company}
                    error={getError(`references.${ref.id}.company`)}
                    onChange={(e) => updateReference(ref.id, 'company', e.target.value)}
                  />
                  <FormInput
                    placeholder="Email"
                    type="email"
                    value={ref.email}
                    error={getError(`references.${ref.id}.email`)}
                    onChange={(e) => updateReference(ref.id, 'email', e.target.value)}
                  />
                  <FormInput
                    placeholder="Phone"
                    value={ref.phone}
                    error={getError(`references.${ref.id}.phone`)}
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
