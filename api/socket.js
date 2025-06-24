import { Server } from 'socket.io';

let io;

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO server...');
    
    io = new Server(res.socket.server, {
      path: '/api/socket',
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? ['https://www.app-suite.io', 'https://app-suite.io'] 
          : ['http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    res.socket.server.io = io;

    // Connection handling
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Join user to their personal room
      socket.on('join-user', (userId) => {
        socket.join(`user-${userId}`);
        console.log(`User ${userId} joined their room`);
      });

      // Join project rooms
      socket.on('join-project', (projectId) => {
        socket.join(`project-${projectId}`);
        console.log(`Socket ${socket.id} joined project ${projectId}`);
      });

      // Handle project updates
      socket.on('project-update', async (data) => {
        const { projectId, update, userId } = data;
        
        // Broadcast to all users in the project room
        socket.to(`project-${projectId}`).emit('project-updated', {
          projectId,
          update,
          userId,
          timestamp: new Date().toISOString()
        });
      });

      // Handle activity creation
      socket.on('activity-created', async (data) => {
        const { projectId, activity, userId } = data;
        
        // Broadcast to all users in the project room
        socket.to(`project-${projectId}`).emit('new-activity', {
          projectId,
          activity,
          userId,
          timestamp: new Date().toISOString()
        });
      });

      // Handle notifications
      socket.on('send-notification', async (data) => {
        const { targetUserId, notification } = data;
        
        // Send to specific user
        io.to(`user-${targetUserId}`).emit('notification', notification);
      });

      // Handle typing indicators
      socket.on('typing-start', (data) => {
        const { projectId, userId, userName } = data;
        socket.to(`project-${projectId}`).emit('user-typing', {
          userId,
          userName,
          isTyping: true
        });
      });

      socket.on('typing-stop', (data) => {
        const { projectId, userId } = data;
        socket.to(`project-${projectId}`).emit('user-typing', {
          userId,
          isTyping: false
        });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  res.end();
}

// Export function to emit events from other API routes
export function emitSocketEvent(event, data, room) {
  if (io) {
    if (room) {
      io.to(room).emit(event, data);
    } else {
      io.emit(event, data);
    }
  }
}