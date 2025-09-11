import React from 'react';
import styled from 'styled-components';
import { FiUser, FiMail, FiCalendar, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  padding: ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${props => props.theme.borderRadius.full};
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
`;

const UserEmail = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const ProfileContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.lg};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ProfileSection = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.md};
`;

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md} 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const InfoIcon = styled.div`
  color: ${props => props.theme.colors.textTertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const InfoValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;


const Profile = () => {
  const { user } = useAuth();

  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Avatar>
          {getUserInitials(user?.username || 'U')}
        </Avatar>
        <UserInfo>
          <UserName>{user?.username}</UserName>
          <UserEmail>{user?.email}</UserEmail>
        </UserInfo>
      </ProfileHeader>

      <ProfileContent>
        <ProfileSection>
          <SectionTitle>
            <FiUser size={20} />
            Account Information
          </SectionTitle>
          
          <InfoItem>
            <InfoIcon>
              <FiUser size={16} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Username</InfoLabel>
              <InfoValue>{user?.username}</InfoValue>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <InfoIcon>
              <FiMail size={16} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>{user?.email}</InfoValue>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <InfoIcon>
              <FiCalendar size={16} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Member Since</InfoLabel>
              <InfoValue>{formatDate(user?.createdAt)}</InfoValue>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <InfoIcon>
              <FiCalendar size={16} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Last Login</InfoLabel>
              <InfoValue>{formatDate(user?.lastLogin)}</InfoValue>
            </InfoContent>
          </InfoItem>
        </ProfileSection>

        <ProfileSection>
          <SectionTitle>
            <FiSettings size={20} />
            Preferences
          </SectionTitle>
          
          <InfoItem>
            <InfoIcon>
              <FiSettings size={16} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Theme</InfoLabel>
              <InfoValue>Light</InfoValue>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <InfoIcon>
              <FiSettings size={16} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Language</InfoLabel>
              <InfoValue>{user?.preferences?.language || 'English'}</InfoValue>
            </InfoContent>
          </InfoItem>
        </ProfileSection>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default Profile;

