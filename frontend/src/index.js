import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'styled-components';

import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { MindMapProvider } from './contexts/MindMapContext';
import { SocketProvider } from './contexts/SocketContext';
import theme from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <DndProvider backend={HTML5Backend}>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <MindMapProvider>
              <SocketProvider>
                <GlobalStyles />
                <App />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                  }}
                />
              </SocketProvider>
            </MindMapProvider>
          </AuthProvider>
        </ThemeProvider>
      </DndProvider>
    </BrowserRouter>
  </React.StrictMode>
);