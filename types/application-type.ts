export interface ApplicationResponse {
    success: boolean;
    message: string;
    data: Application[];
  }
  
  export interface Application {
    id: number;
    job_id: number;
    user_id: number;
    year_of_experience: number;
    expected_salary: number;
    notice_period: number;
    cover_letter: string | null;
    applied_at: string | null;
    updated_at: string;
    status: number;
    job_title: string;
    company_name: string;
    applied_user: string;
    formatted_applied_at: string;
  }