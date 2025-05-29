interface SalaryRange {
  min: string;
  max: string;
  formatted: string;
}

export interface Job {
  id: number;
  title: string;
  experience_level: string | null;
  location: string;
  description: string;
  is_remote: boolean;
  employment_type: string;
  salary_range: SalaryRange;
  requirements: [] | null;
  responsibilities: [] | null;
  benefits: [] | null;
  posted_date: string;
  posted_date_formatted: string;
  employer_id: number;
  employer_name: string;
  image: string;
  skills: any[];
  created_at: string | null;
  updated_at: string | null;
  viewed: boolean | null;
  saved: boolean | null;
  is_applied: boolean | null;
  slug: string;
  
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface Links {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
  isAuthenticated: boolean;
}

export interface JobResponse {
  data: Job[];
  links: Links;
  meta: Meta;
}

interface Skill {
  id: number;
  name: string;
}

export interface JobDescription {
  data: JobDescriptionData | null;
}

export interface JobDescriptionData {
id: number ;
    title: string ;
    experience_level: string ;
    year_of_experience: string ;
    expected_salary: string ;
    location: string ;
    description: string ;
    is_remote: boolean ;
    employment_type: string ;
    salary_range: SalaryRange ;
    requirements: string[] ;
    responsibilities: string[] ;
    benefits: string[] ;
    posted_date: string ;
    posted_date_formatted: string ;
    employer_id: number ;
    employer_name: string ;
    image: string ;
    skills: Skill[] ;
    created_at: string ;
    updated_at: string ;
    viewed: boolean ;
    saved: boolean ;
    notice_period: string;
    cover_letter:string ;
    is_applied: boolean ;
}
