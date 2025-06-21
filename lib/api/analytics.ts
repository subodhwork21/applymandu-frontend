import { defaultFetcher } from '@/lib/fetcher';

export interface AnalyticsParams {
  year?: number;
  timeframe?: 'monthly' | 'quarterly' | 'yearly';
  jobId?: number;
}

export interface ExportParams {
  format: 'csv' | 'pdf' | 'json';
  year?: number;
  timeframe?: 'monthly' | 'quarterly' | 'yearly';
  sections?: string[];
}

export const analyticsApi = {
  // Get main analytics data
  getAnalytics: (params: AnalyticsParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.year) searchParams.append('year', params.year.toString());
    if (params.timeframe) searchParams.append('timeframe', params.timeframe);
    
    return defaultFetcher(`api/analytics?${searchParams.toString()}`);
  },

  // Get individual job analytics
  getJobAnalytics: (jobId: number, params: AnalyticsParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.year) searchParams.append('year', params.year.toString());
    if (params.timeframe) searchParams.append('timeframe', params.timeframe);
    
    return defaultFetcher(`api/analytics/job/${jobId}?${searchParams.toString()}`);
  },

  // Get applicant funnel data
  getApplicantFunnel: (params: AnalyticsParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.year) searchParams.append('year', params.year.toString());
    if (params.timeframe) searchParams.append('timeframe', params.timeframe);
    
    return defaultFetcher(`api/analytics/funnel?${searchParams.toString()}`);
  },

  // Get competitor analysis
  getCompetitorAnalysis: (params: AnalyticsParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.year) searchParams.append('year', params.year.toString());
    if (params.timeframe) searchParams.append('timeframe', params.timeframe);
    
    return defaultFetcher(`api/analytics/competitor?${searchParams.toString()}`);
  },

  // Get real-time analytics
  getRealTimeAnalytics: () => {
    return defaultFetcher('api/analytics/realtime');
  },

  // Get application quality metrics
  getQualityMetrics: (params: AnalyticsParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.year) searchParams.append('year', params.year.toString());
    if (params.timeframe) searchParams.append('timeframe', params.timeframe);
    
    return defaultFetcher(`api/analytics/quality?${searchParams.toString()}`);
  },

  // Get hiring pipeline analytics
  getPipelineAnalytics: (params: AnalyticsParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.year) searchParams.append('year', params.year.toString());
    if (params.timeframe) searchParams.append('timeframe', params.timeframe);
    
    return defaultFetcher(`api/analytics/pipeline?${searchParams.toString()}`);
  },

  // Export analytics data
  exportAnalytics: async (params: ExportParams) => {
    const response = await fetch('api/analytics/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    // Handle different response types
    if (params.format === 'pdf') {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      const data = await response.json();
      return data;
    }
  },

  // Clear analytics cache
  clearCache: () => {
    return fetch('api/analytics/cache', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },

  // Schedule report generation
  scheduleReport: (reportType: 'weekly' | 'monthly' | 'quarterly', preferences: any) => {
    return fetch('api/analytics/schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        report_type: reportType,
        preferences,
      }),
    });
  },
};

