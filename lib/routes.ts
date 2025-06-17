export const routes = {
    // Public routes
    home: '/',
    jobs: '/jobs/browse/all',
    companies: '/companies',
    resources: '/resources',
    about: '/about',
    notifications: '/notifications',
  
    // Authentication
    login: '/login',
    register: '/register',
  
    // Dashboard routes - Job Seeker
    jobseekerDashboard: {
      root: '/dashboard/jobseeker',
      applications: '/dashboard/jobseeker/applications',
      saved: '/dashboard/jobseeker/saved',
      settings: '/dashboard/jobseeker/settings',
      resume: '/dashboard/jobseeker/resume',
    },
  
    // Dashboard routes - Employer
    employerDashboard: {
      root: '/dashboard/employer',
      postJob: '/dashboard/employer/post-job',
      managePosts: '/dashboard/employer/manage-posts',
      applications: '/dashboard/employer/applications',
      settings: '/dashboard/employer/settings',
    }
  };

  export const navigationItems = [
    {
      path: routes.home,
      label: 'Home',
    },
    {
      path: routes.jobs,
      label: 'Browse Jobs',
    },
    {
      path: routes.companies,
      label: 'Companies',
    },
    {
      path: routes.resources,
      label: 'Resources',
    },
    {
      path: routes.about,
      label: 'About Us',
    },
  ];

  export const isActivePath = (currentPath: string, path: string, exact: boolean = false): boolean => {
    if (exact) {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };