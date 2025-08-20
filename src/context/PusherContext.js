import { createContext, useContext, useEffect, useState } from 'react';
import Pusher from 'pusher-js';

export const PusherContext = createContext();

export const PusherProvider = ({ children }) => {
  const [pusherClient, setPusherClient] = useState(null);

  useEffect(() => {
    // token saved by your login flow
    const user = JSON.parse(localStorage.getItem('clinicUser') || 'null');
    const token = user?.token || localStorage.getItem('token') || null;

    const key = (process.env.REACT_APP_PUSHER_KEY).replace(/(^"|"$)/g, '');
    const cluster = (process.env.REACT_APP_PUSHER_CLUSTER).replace(/(^"|"$)/g, '');
    const apiUrl = (process.env.BACKEND_URL).replace(/\/$/, '');

    if (!key || !cluster) {
      console.warn('Missing REACT_APP_PUSHER_KEY or REACT_APP_PUSHER_CLUSTER');
      return;
    }

    // build explicit backend auth endpoint to avoid proxy issues
    const authEndpoint = apiUrl
      ? `${apiUrl}/pusher/auth`
      : `${window.location.origin}/pusher/auth`;

    Pusher.logToConsole = true;

    const pusher = new Pusher(key, {
      cluster,
      forceTLS: true,
      authEndpoint,
      auth: {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      }
    });

    setPusherClient(pusher);
    return () => pusher.disconnect();
  }, []); // add token to deps if you want reconnect when auth changes

  return (
    <PusherContext.Provider value={pusherClient}>
      {children}
    </PusherContext.Provider>
  );
};

export const usePusher = () => useContext(PusherContext);
export default PusherProvider;