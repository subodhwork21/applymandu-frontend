export interface JobSeekerProfileResponse {
    data: JobSeekerProfile;
  }
  
 export interface JobSeekerProfile {
    id: number;
    name: string | null;
    email: string;
    phone: string | null;
    jobseekerProfile: {
      id: number | null;
      user_id: number | null;
      first_name: string;
      middle_name: string;
      last_name: string;
      district: string;
      municipality: string;
      city_tole: string;
      date_of_birth: string;
      mobile: string;
      industry: string;
      preferred_job_type: string;
      gender: string;
      has_driving_license: boolean;
      has_vehicle: boolean;
      career_objectives: string;
      looking_for: string;
      salary_expectations: string;
      created_at: string;
      updated_at: string;
    };
    experiences: Experience[];
    educations: Education[];
    languages: Language[];
    trainings: Training[];
    certificates: Certificate[];
    social_links: SocialLink[];
    references: Reference[];
    skills: Skill[];
    created_at: string;
    updated_at: string;
  }
  
 export interface Experience {
    id: number ;
    user_id: number ;
    position_title: string;
    company_name: string;
    industry: string;
    job_level: string;
    roles_and_responsibilities: string;
    start_date: string;
    end_date: string ;
    currently_work_here: boolean;
    created_at: string;
    updated_at: string;
  }
  
 export interface Education {
    id: number;
    user_id: number;
    degree: string;
    subject_major: string;
    institution: string;
    university_board: string;
    grading_type: string;
    joined_year: string;
    passed_year: string | null;
    currently_studying: boolean;
    created_at: string;
    updated_at: string;
  }
  
export  interface Language {
    id: number;
    user_id: number;
    language: string;
    proficiency: string;
    created_at: string;
    updated_at: string;
  }
  
export  interface Training {
    id: number;
    user_id: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    institution: string;
  }
  
export interface Certificate {
    id: number;
    user_id: number;
    title: string;
    year: string;
    issuer: string;
    created_at: string;
    updated_at: string;
  }
  
 export interface SocialLink {
    id: number;
    user_id: number;
    url: string;
    platform: string;
    created_at: string;
    updated_at: string;
  }
  
 export interface Reference {
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
  
 export interface Skill {
    id: number;
    name: string;
  }