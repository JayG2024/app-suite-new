import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  joinProject: (projectId: string) => void;
  leaveProject: (projectId: string) => void;
  emitProjectUpdate: (projectId: string, update: Record<string, unknown>) => void;
  emitActivityCreated: (projectId: string, activity: Record<string, unknown>) => void;
  emitNotification: (targetUserId: number, notification: Record<string, unknown>) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
  joinProject: () => {},
  leaveProject: () => {},
  emitProjectUpdate: () => {},
  emitActivityCreated: () => {},
  emitNotification: () => {},
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Disable WebSocket in production (Vercel doesn't support persistent connections)
    if (process.env.NODE_ENV === 'production') {
      console.log('WebSocket disabled in production environment');
      return;
    }

    // Initialize socket connection for development only
    const socketUrl = 'http://localhost:5173';

    const newSocket = io(socketUrl, {
      path: '/api/socket',
      transports: ['websocket', 'polling'],
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setConnected(true);
      
      // Join user room if logged in
      const userStr = localStorage.getItem('adminUser') || localStorage.getItem('teamUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        newSocket.emit('join-user', user.id);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setConnected(false);
    });

    // Listen for notifications
    newSocket.on('notification', (notification) => {
      toast.info(notification.title, {
        description: notification.message,
      });
    });

    // Listen for project updates
    newSocket.on('project-updated', (data) => {
      // Trigger a custom event that components can listen to
      window.dispatchEvent(new CustomEvent('project-updated', { detail: data }));
    });

    // Listen for new activities
    newSocket.on('new-activity', (data) => {
      // Trigger a custom event that components can listen to
      window.dispatchEvent(new CustomEvent('new-activity', { detail: data }));
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  const joinProject = (projectId: string) => {
    if (socket && connected) {
      socket.emit('join-project', projectId);
    }
  };

  const leaveProject = (projectId: string) => {
    if (socket && connected) {
      socket.emit('leave-project', projectId);
    }
  };

  const emitProjectUpdate = (projectId: string, update: any) => {
    if (socket && connected) {
      const userStr = localStorage.getItem('adminUser') || localStorage.getItem('teamUser');
      const user = userStr ? JSON.parse(userStr) : null;
      
      socket.emit('project-update', {
        projectId,
        update,
        userId: user?.id
      });
    }
  };

  const emitActivityCreated = (projectId: string, activity: any) => {
    if (socket && connected) {
      const userStr = localStorage.getItem('adminUser') || localStorage.getItem('teamUser');
      const user = userStr ? JSON.parse(userStr) : null;
      
      socket.emit('activity-created', {
        projectId,
        activity,
        userId: user?.id
      });
    }
  };

  const emitNotification = (targetUserId: number, notification: any) => {
    if (socket && connected) {
      socket.emit('send-notification', {
        targetUserId,
        notification
      });
    }
  };

  return (
    <SocketContext.Provider value={{
      socket,
      connected,
      joinProject,
      leaveProject,
      emitProjectUpdate,
      emitActivityCreated,
      emitNotification,
    }}>
      {children}
    </SocketContext.Provider>
  );
};