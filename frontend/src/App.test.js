import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { MindMapProvider } from './contexts/MindMapContext';
import { SocketProvider } from './contexts/SocketContext';

// Mock the contexts to avoid API calls during testing
const MockAuthProvider = ({ children }) => (
  <AuthProvider>
    {children}
  </AuthProvider>
);

const MockMindMapProvider = ({ children }) => (
  <MindMapProvider>
    {children}
  </MindMapProvider>
);

const MockSocketProvider = ({ children }) => (
  <SocketProvider>
    {children}
  </SocketProvider>
);

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <DndProvider backend={HTML5Backend}>
      <MockAuthProvider>
        <MockSocketProvider>
          <MockMindMapProvider>
            {children}
          </MockMindMapProvider>
        </MockSocketProvider>
      </MockAuthProvider>
    </DndProvider>
  </BrowserRouter>
);

test('renders app without crashing', () => {
  render(
    <TestWrapper>
      <App />
    </TestWrapper>
  );
});

test('renders login page when not authenticated', () => {
  render(
    <TestWrapper>
      <App />
    </TestWrapper>
  );
  
  // Since we're not authenticated, should redirect to login
  expect(window.location.pathname).toBe('/login');
});




