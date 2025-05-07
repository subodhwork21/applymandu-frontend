import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Echo: Echo;
    Pusher: typeof Pusher;
  }
}

export const initializeEcho = () => {
  if (typeof window !== 'undefined') {
    window.Pusher = Pusher;
    
    // Check if environment variables are available
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;
    
    if (!pusherKey) {
      console.error('Pusher app key is missing. Make sure NEXT_PUBLIC_PUSHER_APP_KEY is set in your environment.');
      return; // Don't initialize Echo if key is missing
    }
    
    try {
        window.Echo = new Echo({
            broadcaster: 'reverb',
            key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
            wsPort: process.env.NEXT_PUBLIC_REVERB_PORT,
            forceTLS: (process.env.NEXT_PUBLIC_REVERB_TLS === 'true'),
        authorizer: (channel: any) => {
          return {
            authorize: (socketId: string, callback: Function) => {
              const token = localStorage.getItem('token');
              
              fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/broadcasting/auth`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  socket_id: socketId,
                  channel_name: channel.name
                })
              })
              .then(response => response.json())
              .then(data => {
                callback(false, data);
              })
              .catch(error => {
                callback(true, error);
              });
            }
          };
        }
      });
      
      console.log('Echo initialized successfully');
    } catch (error) {
      console.error('Error initializing Echo:', error);
    }
  }
};
