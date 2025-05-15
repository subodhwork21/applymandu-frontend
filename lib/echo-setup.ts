import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { employerToken, jobSeekerToken } from './tokens';

declare global {
  interface Window {
    Echo: Echo;
    Pusher: typeof Pusher;
  }
}

export const initializeEcho = () => {
  if (typeof window !== 'undefined') {
    window.Pusher = Pusher; // Required for Echo
    
    // Check if Pusher environment variables are available
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!pusherKey || !pusherCluster) {
      console.error('Pusher configuration is missing. Make sure NEXT_PUBLIC_PUSHER_APP_KEY and NEXT_PUBLIC_PUSHER_APP_CLUSTER are set in your environment.');
      return; // Don't initialize Echo if config is missing
    }
    
    try {
      window.Echo = new Echo({
        broadcaster: 'pusher',
        key: pusherKey,
        cluster: pusherCluster,
        forceTLS: true,
        authorizer: (channel: any) => {
          return {
            authorize: (socketId: string, callback: Function) => {
              alert(socketId);
              const token = jobSeekerToken() || employerToken();
              
              console.log('Attempting to authorize channel:', channel.name);
              
              fetch(`${process.env.NEXT_PUBLIC_API_URL}api/broadcasting/auth`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json',
                  'X-Requested-With': 'XMLHttpRequest'
                
                },
                body: JSON.stringify({
                  socket_id: socketId,
                  channel_name: channel.name
                })
              })
              .then(response => {
                if (!response.ok) {
                  return response.json().then(err => {
                    console.error('Auth error response:', err);
                    throw new Error(JSON.stringify(err));
                  });
                }
                return response.json();
              })
              .then(data => {
                console.log('Auth successful for channel:', channel.name);
                callback(false, data);
              })
              .catch(error => {
                console.error('Auth error for channel:', channel.name, error);
                callback(true, error);
              });
            }
          };
        }
      });
      
      console.log('Echo initialized successfully with Pusher');
    } catch (error) {
      console.error('Error initializing Echo:', error);
    }
  }
};