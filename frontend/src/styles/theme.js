const theme = {
  colors: {
    // Primary colors
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    primaryLight: '#dbeafe',
    
    // Secondary colors
    secondary: '#6b7280',
    secondaryHover: '#4b5563',
    secondaryLight: '#f3f4f6',
    
    // Success colors
    success: '#10b981',
    successHover: '#059669',
    successLight: '#d1fae5',
    
    // Warning colors
    warning: '#f59e0b',
    warningHover: '#d97706',
    warningLight: '#fef3c7',
    
    // Error colors
    error: '#ef4444',
    errorHover: '#dc2626',
    errorLight: '#fee2e2',
    
    // Neutral colors
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    backgroundTertiary: '#f1f5f9',
    
    text: '#1f2937',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    textInverse: '#ffffff',
    
    border: '#e5e7eb',
    borderHover: '#d1d5db',
    borderFocus: '#3b82f6',
    
    // Mind map specific colors
    nodeBackground: '#ffffff',
    nodeBorder: '#d1d5db',
    nodeText: '#1f2937',
    nodeSelected: '#3b82f6',
    nodeHover: '#f3f4f6',
    
    connection: '#6b7280',
    connectionHover: '#4b5563',
    
    // Dark theme colors
    dark: {
      background: '#0f172a',
      backgroundSecondary: '#1e293b',
      backgroundTertiary: '#334155',
      
      text: '#f1f5f9',
      textSecondary: '#cbd5e1',
      textTertiary: '#94a3b8',
      
      border: '#475569',
      borderHover: '#64748b',
      
      nodeBackground: '#1e293b',
      nodeBorder: '#475569',
      nodeText: '#f1f5f9',
      nodeSelected: '#3b82f6',
      nodeHover: '#334155',
      
      connection: '#64748b',
      connectionHover: '#94a3b8',
    }
  },
  
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },
  
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
  
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
};

export default theme;



