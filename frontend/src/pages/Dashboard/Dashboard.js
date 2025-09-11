import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiPlus, FiSearch, FiFilter, FiGrid, FiList, FiMoreVertical } from 'react-icons/fi';
import Button from '../../components/UI/Button';
import MindMapCard from '../../components/MindMap/MindMapCard';
import CreateMindMapModal from '../../components/MindMap/CreateMindMapModal';
import { useMindMap } from '../../contexts/MindMapContext';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing['2xl']};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
`;

const SearchContainer = styled.div`
  position: relative;
  min-width: 300px;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    min-width: 200px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.md} ${props => props.theme.spacing.md} 48px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: ${props => props.theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primaryLight};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textTertiary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${props => props.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textTertiary};
  pointer-events: none;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};

  &:hover {
    background-color: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.borderHover};
  }
`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
`;

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background};
  color: ${props => props.active ? props.theme.colors.textInverse : props.theme.colors.text};
  border: none;
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};

  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primaryHover : props.theme.colors.backgroundSecondary};
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const MindMapsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['3xl']} ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.textSecondary};

  h3 {
    font-size: ${props => props.theme.typography.fontSize.xl};
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    margin-bottom: ${props => props.theme.spacing.md};
    color: ${props => props.theme.colors.text};
  }

  p {
    font-size: ${props => props.theme.typography.fontSize.base};
    margin-bottom: ${props => props.theme.spacing.lg};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing['3xl']};
`;

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortBy, setSortBy] = useState('lastModified');
  
  const { 
    mindmaps, 
    loading, 
    fetchMindMaps, 
    createMindMap 
  } = useMindMap();

  useEffect(() => {
    fetchMindMaps({ search: searchTerm, sortBy });
  }, [searchTerm, sortBy]);

  // Load mind maps on component mount
  useEffect(() => {
    if (!mindmaps || mindmaps.length === 0) {
      fetchMindMaps();
    }
  }, []);

  const handleCreateMindMap = async (mindMapData) => {
    const result = await createMindMap(mindMapData);
    if (result.success) {
      setShowCreateModal(false);
      // Recargar la lista de mind maps para mostrar el nuevo
      await fetchMindMaps();
    }
  };

  const filteredMindMaps = (mindmaps || []).filter(mindmap =>
    mindmap && mindmap.title && mindmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mindmap && mindmap.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Debug: Log para ver qué está pasando
  console.log('Mind maps from context:', mindmaps);
  console.log('Mind maps type:', typeof mindmaps);
  console.log('Mind maps is array:', Array.isArray(mindmaps));
  console.log('Filtered mind maps:', filteredMindMaps);
  console.log('Loading state:', loading);

  if (loading) {
    return (
      <LoadingContainer>
        <div>Loading your mind maps...</div>
      </LoadingContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>My Mind Maps</Title>
        <Controls>
          <SearchContainer>
            <SearchIcon>
              <FiSearch size={20} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search mind maps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          
          <FilterButton>
            <FiFilter size={16} />
            Sort by: {sortBy === 'lastModified' ? 'Last Modified' : 'Title'}
          </FilterButton>
          
          <ViewToggle>
            <ViewButton
              active={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <FiGrid size={16} />
            </ViewButton>
            <ViewButton
              active={viewMode === 'list'}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <FiList size={16} />
            </ViewButton>
          </ViewToggle>
          
          <Button onClick={() => setShowCreateModal(true)}>
            <FiPlus size={16} />
            New Mind Map
          </Button>
        </Controls>
      </Header>

      <Content>
        {filteredMindMaps.length === 0 ? (
          <EmptyState>
            <h3>No mind maps found</h3>
            <p>
              {searchTerm 
                ? "No mind maps match your search criteria. Try adjusting your search terms."
                : "Create your first mind map to get started with organizing your thoughts and ideas."
              }
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <FiPlus size={16} />
              Create Your First Mind Map
            </Button>
          </EmptyState>
        ) : (
          <MindMapsGrid>
            {filteredMindMaps.map(mindmap => (
              <MindMapCard
                key={mindmap._id}
                mindmap={mindmap}
                viewMode={viewMode}
              />
            ))}
          </MindMapsGrid>
        )}
      </Content>

      {showCreateModal && (
        <CreateMindMapModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateMindMap}
        />
      )}
    </DashboardContainer>
  );
};

export default Dashboard;