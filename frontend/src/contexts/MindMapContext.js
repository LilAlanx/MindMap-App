import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { mindMapAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const MindMapContext = createContext();

const initialState = {
  mindMaps: [],
  currentMindMap: null,
  nodes: [],
  selectedNode: null,
  loading: false,
  error: null
};

const mindMapReducer = (state, action) => {
  // Ensure mindMaps is always an array
  const currentMindMaps = Array.isArray(state.mindMaps) ? state.mindMaps : [];
  const currentNodes = Array.isArray(state.nodes) ? state.nodes : [];

  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_MINDMAPS':
      return { 
        ...state, 
        mindMaps: Array.isArray(action.payload) ? action.payload : [], 
        loading: false 
      };
    case 'ADD_MINDMAP':
      return { ...state, mindMaps: [...currentMindMaps, action.payload] };
    case 'UPDATE_MINDMAP':
      return {
        ...state,
        mindMaps: currentMindMaps.map(mindmap =>
          mindmap._id === action.payload._id ? action.payload : mindmap
        )
      };
    case 'DELETE_MINDMAP':
      return {
        ...state,
        mindMaps: currentMindMaps.filter(mindmap => mindmap._id !== action.payload)
      };
    case 'SET_CURRENT_MINDMAP':
      return { ...state, currentMindMap: action.payload, loading: false };
    case 'SET_NODES':
      return { ...state, nodes: Array.isArray(action.payload) ? action.payload : [], loading: false };
    case 'ADD_NODE':
      return { ...state, nodes: [...currentNodes, action.payload] };
    case 'UPDATE_NODE':
      return {
        ...state,
        nodes: currentNodes.map(node =>
          node._id === action.payload._id ? action.payload : node
        )
      };
    case 'DELETE_NODE':
      return {
        ...state,
        nodes: currentNodes.filter(node => node._id !== action.payload)
      };
    case 'SET_SELECTED_NODE':
      return { ...state, selectedNode: action.payload };
    case 'CLEAR_MINDMAP':
      return {
        ...state,
        currentMindMap: null,
        nodes: [],
        selectedNode: null
      };
    default:
      return state;
  }
};

export const MindMapProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mindMapReducer, initialState);
  const { user } = useAuth();

  // Load mind maps on component mount
  useEffect(() => {
    if (user) {
      loadMindMaps();
    }
  }, [user]);

  const loadMindMaps = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('Loading mind maps...');
      const response = await mindMapAPI.getMindMaps();
      console.log('Mind maps response:', response.data);
      
      const mindMaps = response.data.data.mindmaps || [];
      console.log('Extracted mind maps:', mindMaps);
      
      dispatch({ type: 'SET_MINDMAPS', payload: mindMaps });
    } catch (error) {
      console.error('Error loading mind maps:', error);
      const message = error.response?.data?.message || 'Failed to load mind maps';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
    }
  };

  const loadMindMap = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('Loading mind map with ID:', id);
      
      const response = await mindMapAPI.getMindMap(id);
      console.log('Mind map response:', response.data);
      
      const mindMap = response.data.data.mindmap;
      console.log('Extracted mind map:', mindMap);
      dispatch({ type: 'SET_CURRENT_MINDMAP', payload: mindMap });
      
      // Load nodes for this mind map
      console.log('Loading nodes for mind map:', id);
      const nodesResponse = await mindMapAPI.getNodesByMindMap(id);
      console.log('Nodes response:', nodesResponse.data);
      
      const nodes = nodesResponse.data.data.nodes || [];
      console.log('Extracted nodes:', nodes);
      dispatch({ type: 'SET_NODES', payload: nodes });
      
      return { success: true, data: mindMap };
    } catch (error) {
      console.error('Error loading mind map:', error);
      console.error('Error response:', error.response?.data);
      const message = error.response?.data?.message || 'Failed to load mind map';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const createMindMap = async (mindMapData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('Creating mind map with data:', mindMapData);
      const response = await mindMapAPI.createMindMap(mindMapData);
      console.log('Create mind map response:', response.data);
      
      const mindMap = response.data.data.mindmap;
      dispatch({ type: 'ADD_MINDMAP', payload: mindMap });
      return { success: true, data: mindMap };
    } catch (error) {
      console.error('Error creating mind map:', error);
      const message = error.response?.data?.message || 'Failed to create mind map';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateMindMap = async (id, mindMapData) => {
    try {
      const response = await mindMapAPI.updateMindMap(id, mindMapData);
      dispatch({ type: 'UPDATE_MINDMAP', payload: response.data.data.mindMap });
      return { success: true, data: response.data.data.mindMap };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update mind map';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const deleteMindMap = async (id) => {
    try {
      await mindMapAPI.deleteMindMap(id);
      dispatch({ type: 'DELETE_MINDMAP', payload: id });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete mind map';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const createNode = async (nodeData) => {
    try {
      console.log('Creating node with data:', nodeData);
      console.log('Auth token:', localStorage.getItem('token') ? 'Present' : 'Missing');
      
      const response = await mindMapAPI.createNode(nodeData);
      console.log('Node creation response:', response.data);
      
      dispatch({ type: 'ADD_NODE', payload: response.data.data.node });
      return { success: true, data: response.data.data.node };
    } catch (error) {
      console.error('Node creation error:', error);
      console.error('Error response:', error.response?.data);
      const message = error.response?.data?.message || 'Failed to create node';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateNode = async (id, nodeData) => {
    try {
      console.log('Updating node with data:', { id, nodeData });
      const response = await mindMapAPI.updateNode(id, nodeData);
      console.log('Node update response:', response.data);
      dispatch({ type: 'UPDATE_NODE', payload: response.data.data.node });
      return { success: true, data: response.data.data.node };
    } catch (error) {
      console.error('Error updating node:', error);
      const message = error.response?.data?.message || 'Failed to update node';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const deleteNode = async (id) => {
    try {
      await mindMapAPI.deleteNode(id);
      dispatch({ type: 'DELETE_NODE', payload: id });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete node';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const selectNode = (node) => {
    dispatch({ type: 'SET_SELECTED_NODE', payload: node });
  };

  const clearMindMap = () => {
    dispatch({ type: 'CLEAR_MINDMAP' });
  };

  const value = {
    ...state,
    mindmaps: state.mindMaps, // Alias para compatibilidad
    fetchMindMaps: loadMindMaps, // Alias para compatibilidad
    fetchMindMap: loadMindMap, // Alias para compatibilidad
    setSelectedNode: selectNode, // Alias para compatibilidad
    loadMindMaps,
    loadMindMap,
    createMindMap,
    updateMindMap,
    deleteMindMap,
    createNode,
    updateNode,
    deleteNode,
    selectNode,
    clearMindMap
  };

  return (
    <MindMapContext.Provider value={value}>
      {children}
    </MindMapContext.Provider>
  );
};

export const useMindMap = () => {
  const context = useContext(MindMapContext);
  if (!context) {
    throw new Error('useMindMap must be used within a MindMapProvider');
  }
  return context;
};