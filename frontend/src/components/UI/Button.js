import React from 'react';
import styled from 'styled-components';

const ButtonStyled = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => {
    switch (props.size) {
      case 'sm': return `${props.theme.spacing.sm} ${props.theme.spacing.md}`;
      case 'lg': return `${props.theme.spacing.md} ${props.theme.spacing.xl}`;
      default: return `${props.theme.spacing.sm} ${props.theme.spacing.lg}`;
    }
  }};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return props.theme.typography.fontSize.sm;
      case 'lg': return props.theme.typography.fontSize.lg;
      default: return props.theme.typography.fontSize.base;
    }
  }};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  transition: ${props => props.theme.transitions.fast};
  cursor: pointer;
  border: none;
  outline: none;
  text-decoration: none;
  min-height: 40px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.textInverse};
          
          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.primaryHover};
          }
        `;
      case 'secondary':
        return `
          background-color: ${props.theme.colors.backgroundSecondary};
          color: ${props.theme.colors.text};
          border: 1px solid ${props.theme.colors.border};
          
          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.backgroundTertiary};
            border-color: ${props.theme.colors.borderHover};
          }
        `;
      case 'danger':
        return `
          background-color: ${props.theme.colors.error};
          color: ${props.theme.colors.textInverse};
          
          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.errorHover};
          }
        `;
      case 'ghost':
        return `
          background-color: transparent;
          color: ${props.theme.colors.textSecondary};
          
          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.backgroundSecondary};
            color: ${props.theme.colors.text};
          }
        `;
      default:
        return `
          background-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.textInverse};
          
          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.primaryHover};
          }
        `;
    }
  }}

  ${props => props.fullWidth && `
    width: 100%;
  `}

  ${props => props.loading && `
    position: relative;
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  `}
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  disabled = false,
  ...props 
}) => {
  return (
    <ButtonStyled
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      loading={loading}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </ButtonStyled>
  );
};

export default Button;




