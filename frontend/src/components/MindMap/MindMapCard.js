import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiMoreVertical, FiEdit, FiTrash2, FiShare, FiEye } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import Button from '../UI/Button';
import { useMindMap } from '../../contexts/MindMapContext';

const Card = styled.div`
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  transition: ${props => props.theme.transitions.fast};
  cursor: pointer;
  position: relative;
  group: hover;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Title = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
  margin: 0;
  flex: 1;
  margin-right: ${props => props.theme.spacing.sm};
  line-height: ${props => props.theme.typography.lineHeight.tight};
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: transparent;
  color: ${props => props.theme.colors.textTertiary};
  transition: ${props => props.theme.transitions.fast};
  opacity: 0;

  ${Card}:hover & {
    opacity: 1;
  }

  &:hover {
    background-color: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

const Description = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  line-height: ${props => props.theme.typography.lineHeight.normal};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.xs};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Tag = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.primaryLight};
  color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const MetaItem = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.textTertiary};
`;

const Actions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
  opacity: 0;
  transition: ${props => props.theme.transitions.fast};

  ${Card}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: transparent;
  color: ${props => props.theme.colors.textTertiary};
  transition: ${props => props.theme.transitions.fast};

  &:hover {
    background-color: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }

  &.danger:hover {
    background-color: ${props => props.theme.colors.errorLight};
    color: ${props => props.theme.colors.error};
  }
`;

const MindMapCard = ({ mindmap, viewMode }) => {
  const navigate = useNavigate();
  const { deleteMindMap } = useMindMap();

  const handleClick = () => {
    navigate(`/mindmap/${mindmap._id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/mindmap/${mindmap._id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this mind map? This action cannot be undone.')) {
      await deleteMindMap(mindmap._id);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    // TODO: Implement share functionality
    console.log('Share mind map:', mindmap._id);
  };

  return (
    <Card onClick={handleClick}>
      <CardHeader>
        <Title>{mindmap.title}</Title>
        <MenuButton onClick={(e) => e.stopPropagation()}>
          <FiMoreVertical size={16} />
        </MenuButton>
      </CardHeader>

      {mindmap.description && (
        <Description>{mindmap.description}</Description>
      )}

      {mindmap.tags && mindmap.tags.length > 0 && (
        <Tags>
          {mindmap.tags.slice(0, 3).map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
          {mindmap.tags.length > 3 && (
            <Tag>+{mindmap.tags.length - 3}</Tag>
          )}
        </Tags>
      )}

      <CardFooter>
        <Meta>
          <MetaItem>
            Created {formatDistanceToNow(new Date(mindmap.createdAt), { addSuffix: true })}
          </MetaItem>
          <MetaItem>
            Modified {formatDistanceToNow(new Date(mindmap.lastModified), { addSuffix: true })}
          </MetaItem>
          {mindmap.collaborators && mindmap.collaborators.length > 0 && (
            <MetaItem>
              {mindmap.collaborators.length} collaborator{mindmap.collaborators.length !== 1 ? 's' : ''}
            </MetaItem>
          )}
        </Meta>

        <Actions>
          <ActionButton onClick={handleEdit} title="Edit">
            <FiEdit size={14} />
          </ActionButton>
          <ActionButton onClick={handleShare} title="Share">
            <FiShare size={14} />
          </ActionButton>
          <ActionButton onClick={handleDelete} title="Delete" className="danger">
            <FiTrash2 size={14} />
          </ActionButton>
        </Actions>
      </CardFooter>
    </Card>
  );
};

export default MindMapCard;




