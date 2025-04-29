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


