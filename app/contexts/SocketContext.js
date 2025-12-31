"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { fetchFromStrapi } from '@/secure/strapi'; // ✅ Import secure wrapper

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const { user } = useKindeBrowserClient();
    const [strapiUserId, setStrapiUserId] = useState(null);

    // Get Strapi user ID from email
    useEffect(() => {
        const fetchUserId = async () => {
            if (!user?.email) return;

            try {
           

                // ✅ Use secure wrapper instead of direct fetch
                const data = await fetchFromStrapi(
                    `user-profiles?filters[email][$eq]=${encodeURIComponent(user.email)}`
                );

                if (data.data?.[0]) {
                    const userId = data.data[0].id;
                    setStrapiUserId(userId);
                 
                }
            } catch (error) {
                console.error('❌ Error fetching user ID:', error);
            }
        };

        fetchUserId();
    }, [user]);

    // Initialize socket connection
    useEffect(() => {
        if (!strapiUserId) return;

      

        // ✅ Use environment variable for socket URL in production
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:1337';

        const newSocket = io(socketUrl, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        newSocket.on('connect', () => {
          
            setIsConnected(true);

            // Emit that this user is online
            newSocket.emit('user:online', strapiUserId);
       
        });

        newSocket.on('disconnect', () => {
         
            setIsConnected(false);
        });

        newSocket.on('users:online', (users) => {
            setOnlineUsers(users);
       
        });

        newSocket.on('connect_error', (error) => {
       
        });

        setSocket(newSocket);

        // Cleanup on unmount
        return () => {
            if (newSocket) {
            
                newSocket.disconnect();
            }
        };
    }, [strapiUserId]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
};