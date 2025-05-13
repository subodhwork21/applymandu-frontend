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
    window.Pusher = Pusher; // Still needed for Echo
    
    // Check if Reverb environment variables are available
    const reverbKey = process.env.NEXT_PUBLIC_REVERB_APP_KEY;
    const reverbHost = process.env.NEXT_PUBLIC_REVERB_HOST;

    
    if (!reverbKey || !reverbHost) {
      console.error('Reverb configuration is missing. Make sure NEXT_PUBLIC_REVERB_APP_KEY and NEXT_PUBLIC_REVERB_HOST are set in your environment.');
      return; // Don't initialize Echo if key is missing
    }
    
    try {
      window.Echo = new Echo({
        broadcaster: 'reverb',
        key: reverbKey,
        wsHost: reverbHost,
        wsPort: process.env.NEXT_PUBLIC_REVERB_PORT || '8080',
        wssPort: 443,
        encrypted: true,
        forceTLS: process.env.NEXT_PUBLIC_REVERB_TLS === 'true',
        enabledTransports: ['ws', 'wss'], // Use WebSockets only
        disableStats: true,
        authorizer: (channel: any) => {
          return {
            authorize: (socketId: string, callback: Function) => {
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
      
      console.log('Echo initialized successfully with Reverb');
    } catch (error) {
      console.error('Error initializing Echo:', error);
    }
  }
};
