import React, { createContext, useContext } from 'react';

interface SocketContextType {
  socket: null;
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

// Socket.io has been removed - this is now a no-op provider
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const value: SocketContextType = {
    socket: null,
    connected: false,
    joinProject: () => {
      // No-op: Socket.io removed for performance
    },
    leaveProject: () => {
      // No-op: Socket.io removed for performance
    },
    emitProjectUpdate: () => {
      // No-op: Socket.io removed for performance
    },
    emitActivityCreated: () => {
      // No-op: Socket.io removed for performance
    },
    emitNotification: () => {
      // No-op: Socket.io removed for performance
    },
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};