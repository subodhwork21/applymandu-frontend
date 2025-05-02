export interface UserProfile {
    data: {
        id: number;
        first_name: string;
        last_name: string;
        company_name: string | null;
        email: string;
        phone: string | null;
        image_path: string;
        profile: {
          id: number;
          user_id: number;
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
          created_at: string;
          updated_at: string;
        };
        experiences: {
          id: number;
          user_id: number;
          company_name: string;
          position_title: string;
          start_date: string;
          end_date: string;
          job_level: string;
          created_at: string;
          updated_at: string;
        }[];
    }
  
  }