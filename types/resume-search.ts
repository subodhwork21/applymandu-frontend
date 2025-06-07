export interface JobseekerProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  profile_image: string | null;
  headline: string;
  summary: string;
  experience_level: string;
  expected_salary: string;
  notice_period: string;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  portfolio_links: string[];
  resume_url: string | null;
  availability_status: 'available' | 'not_available' | 'open_to_offers';
  last_active: string;
  profile_completion: number;
  total_experience_years: number;
  is_verified: boolean;
  match_score?: number;
}

export interface Experience {
  id: number;
  company_name: string;
  position: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
  location: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  grade: string | null;
}

export interface Certification {
  id: number;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id: string | null;
}

export interface Skill {
  id: number;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface ResumeSearchFilters {
  keywords: string;
  location: string;
  experience_level: string[];
  skills: string[];
  availability_status: string[];
  salary_range: {
    min: number | null;
    max: number | null;
  };
  experience_years: {
    min: number | null;
    max: number | null;
  };
  education_level: string[];
  last_active: string; // 'week', 'month', '3months', 'all'
  job_id: string; // For matching against specific job
}

export interface ResumeSearchResponse {
  data: JobseekerProfile[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}
