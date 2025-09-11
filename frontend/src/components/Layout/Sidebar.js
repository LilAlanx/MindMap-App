import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FiHome, FiPlus, FiSettings, FiX } from 'react-icons/fi';

const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background-color: ${props => props.theme.colors.background};
  border-right: 1px solid ${props => props.theme.colors.border};
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: ${props => props.theme.transitions.normal};
  z-index: ${props => props.theme.zIndex.fixed};
  display: flex;
  flex-direction: column;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    position: relative;
    transform: translateX(0);
    width: 280px;
  }
`;


const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary};
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: transparent;
  color: ${props => props.theme.colors.textSecondary};
  transition: ${props => props.theme.transitions.fast};

  &:hover {
    background-color: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const Navigation = styled.nav`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const NavItem = styled.li``;

const NavLinkStyled = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  transition: ${props => props.theme.transitions.fast};
  font-weight: ${props => props.theme.typography.fontWeight.medium};

  &:hover {
    background-color: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }

  &.active {
    background-color: ${props => props.theme.colors.primaryLight};
    color: ${props => props.theme.colors.primary};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const SidebarFooter = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const CreateButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  transition: ${props => props.theme.transitions.fast};

  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <SidebarContainer isOpen={isOpen}>
        <SidebarHeader>
          <Logo>
            🧠 MindMap
          </Logo>
          <CloseButton onClick={onClose} aria-label="Close sidebar">
            <FiX size={20} />
          </CloseButton>
        </SidebarHeader>

        <Navigation>
          <NavList>
            <NavItem>
              <NavLinkStyled to="/dashboard" onClick={onClose}>
                <FiHome />
                Dashboard
              </NavLinkStyled>
            </NavItem>
            <NavItem>
              <NavLinkStyled to="/profile" onClick={onClose}>
                <FiSettings />
                Profile
              </NavLinkStyled>
            </NavItem>
          </NavList>
        </Navigation>

        <SidebarFooter>
          <CreateButton onClick={onClose}>
            <FiPlus />
            New Mind Map
          </CreateButton>
        </SidebarFooter>
      </SidebarContainer>
  );
};

export default Sidebar;

