import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useMindMap } from './MindMapContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const { token, isAuthenticated } = useAuth();
  const { updateNode, addNode, deleteNode } = useMindMap();

  useEffect(() => {
    if (isAuthenticated && token) {
      // Initialize socket connection
      socketRef.current = io(process.env.REACT_APP_SOCKET_URL, {
        auth: {
          token
        },
        transports: ['websocket']
      });

      // Connection event handlers
      socketRef.current.on('connect', () => {
        console.log('Connected to server');
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });

      // Real-time collaboration event handlers
      socketRef.current.on('node-updated', (data) => {
        console.log('Node updated:', data);
        updateNode(data.node._id, data.node);
      });

      socketRef.current.on('node-created', (data) => {
        console.log('Node created:', data);
        addNode(data.node);
      });

      socketRef.current.on('node-deleted', (data) => {
        console.log('Node deleted:', data);
        deleteNode(data.nodeId);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [isAuthenticated, token, updateNode, addNode, deleteNode]);

  const joinMindMap = (mindMapId) => {
    if (socketRef.current) {
      socketRef.current.emit('join-mindmap', mindMapId);
    }
  };

  const leaveMindMap = (mindMapId) => {
    if (socketRef.current) {
      socketRef.current.emit('leave-mindmap', mindMapId);
    }
  };

  const emitNodeUpdate = (mindMapId, node) => {
    if (socketRef.current) {
      socketRef.current.emit('node-update', { mindMapId, node });
    }
  };

  const emitNodeCreate = (mindMapId, node) => {
    if (socketRef.current) {
      socketRef.current.emit('node-create', { mindMapId, node });
    }
  };

  const emitNodeDelete = (mindMapId, nodeId) => {
    if (socketRef.current) {
      socketRef.current.emit('node-delete', { mindMapId, nodeId });
    }
  };

  const value = {
    socket: socketRef.current,
    joinMindMap,
    leaveMindMap,
    emitNodeUpdate,
    emitNodeCreate,
    emitNodeDelete
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};




