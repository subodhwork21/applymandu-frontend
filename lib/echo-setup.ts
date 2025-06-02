import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { employerToken, jobSeekerToken } from './tokens';

declare global {
  interface Window {
    Echo: Echo<any>;
    Pusher: typeof Pusher;
  }
}

// Create a singleton instance of Echo
let echo: Echo<any> | null = null;

export const initializeEcho = () => {
  // If Echo is already initialized, return the existing instance
  if (echo) return echo;
  
  if (typeof window !== 'undefined') {
    window.Pusher = Pusher as any; // Required for Echo
    
    // Check if Pusher environment variables are available
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!pusherKey || !pusherCluster) {
      console.error('Pusher configuration is missing. Make sure NEXT_PUBLIC_PUSHER_APP_KEY and NEXT_PUBLIC_PUSHER_APP_CLUSTER are set in your environment.');
      return null; // Don't initialize Echo if config is missing
    }
    
    try {
      // Get authentication token
      const token = jobSeekerToken() || employerToken();
      
      if (!token) {
        console.error('No authentication token available');
        return null; // Don't initialize Echo if no token is available
      }
      
      // Ensure proper URL formatting
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
      
      echo = new Echo({
        broadcaster: 'pusher',
        key: pusherKey,
        cluster: pusherCluster,
        forceTLS: true,
        // Add auth credentials
        auth: {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        },
        authEndpoint: `${baseUrl}api/broadcasting/auth`
      });
      
      window.Echo = echo;
      console.log('Echo initialized successfully with Pusher');
      return echo;
    } catch (error) {
      console.error('Error initializing Echo:', error);
      return null;
    }
  }
  return null;
};

// Export the echo instance
export { echo };
