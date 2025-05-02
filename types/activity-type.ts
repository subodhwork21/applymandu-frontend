interface ActivityResponse {
    data: Activity[];
  }
  
 export interface Activity {
    id: number;
    type: 'job_saved' | 'application_status_update' | string;
    subject_id: number;
    description: string;
    user_id: number;
    created_at: string;
    created_at_formatted: string;
    updated_at: string;
  }