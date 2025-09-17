import React from 'react';
import styled from 'styled-components';
import { FiMenu, FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
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

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary};
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const NotificationButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: transparent;
  color: ${props => props.theme.colors.textSecondary};
  transition: ${props => props.theme.transitions.fast};

  &:hover {
    background-color: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    display: none;
  }
`;

const UserName = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text};
`;

const UserEmail = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.textSecondary};
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.full};
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: transparent;
  color: ${props => props.theme.colors.textSecondary};
  transition: ${props => props.theme.transitions.fast};

  &:hover {
    background-color: ${props => props.theme.colors.errorLight};
    color: ${props => props.theme.colors.error};
  }
`;

const Header = ({ onMenuClick, user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton onClick={onMenuClick} aria-label="Toggle menu">
          <FiMenu size={20} />
        </MenuButton>
        <Logo>
          🧠 MindMap
        </Logo>
      </LeftSection>

      <RightSection>
        <NotificationButton aria-label="Notifications">
          <FiBell size={20} />
        </NotificationButton>

        <UserMenu>
          <UserInfo>
            <UserName>{user?.username}</UserName>
            <UserEmail>{user?.email}</UserEmail>
          </UserInfo>
          <UserAvatar>
            {getUserInitials(user?.username || 'U')}
          </UserAvatar>
          <LogoutButton onClick={handleLogout} aria-label="Logout">
            <FiLogOut size={20} />
          </LogoutButton>
        </UserMenu>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;




