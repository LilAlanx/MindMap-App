import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { FiX, FiSave, FiTrash2, FiSliders, FiType, FiImage, FiLink } from 'react-icons/fi';
import { ChromePicker } from 'react-color';
import Button from '../UI/Button';

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #ffffff;
  overflow-y: auto;
  z-index: 1100;
`;

const EditorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
`;

const EditorTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const CloseButton = styled.button`
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
`;

const EditorContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  min-height: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.error ? props.theme.colors.error : props.theme.colors.border};
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

const TextArea = styled.textarea`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.error ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: ${props => props.theme.transitions.fast};
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primaryLight};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textTertiary};
  }
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.error ? props.theme.colors.error : props.theme.colors.border};
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
`;

const ErrorMessage = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.error};
`;

const SectionTitle = styled.h4`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const ColorPickerContainer = styled.div`
  position: relative;
`;

const ColorButton = styled.button`
  width: 100%;
  height: 40px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.color};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};

  &:hover {
    border-color: ${props => props.theme.colors.borderHover};
  }
`;

const ColorPicker = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1200;
  margin-top: ${props => props.theme.spacing.sm};
`;

const EditorFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  gap: 8px;
  flex-shrink: 0;
  background-color: #ffffff;
  flex-wrap: wrap;
`;

const NodeEditor = ({ node, onUpdate, onClose }) => {
  const [showColorPicker, setShowColorPicker] = useState(null);
  const [nodeData, setNodeData] = useState(node);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    defaultValues: node || {}
  });

  useEffect(() => {
    if (node) {
      setNodeData(node);
      // Reset form with new node data
      Object.keys(node).forEach(key => {
        if (key === 'style' && node.style) {
          Object.keys(node.style).forEach(styleKey => {
            setValue(`style.${styleKey}`, node.style[styleKey]);
          });
        } else {
          setValue(key, node[key]);
        }
      });
    }
  }, [node, setValue]);

  const watchedValues = watch();

  // Removed the problematic useEffect that was causing infinite requests

  // Debounced update function to prevent too many requests
  const debouncedUpdate = useCallback(
    (() => {
      let timeoutId;
      return (data) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (onUpdate && !isSaving) {
            setIsSaving(true);
            onUpdate(data).finally(() => {
              setIsSaving(false);
            });
          }
        }, 500); // 500ms delay
      };
    })(),
    [onUpdate, isSaving]
  );

  const onSubmit = (data) => {
    if (onUpdate && !isSaving) {
      setIsSaving(true);
      onUpdate(data).finally(() => {
        setIsSaving(false);
      });
    }
  };

  const handleColorChange = (colorType, color) => {
    setValue(`style.${colorType}`, color.hex);
    setNodeData(prev => ({
      ...prev,
      style: {
        ...prev.style,
        [colorType]: color.hex
      }
    }));
    
    // Only update for visual feedback, don't save immediately
    // The user will save manually with the Save button
  };

  const handleStyleChange = (styleType, value) => {
    setValue(`style.${styleType}`, value);
    setNodeData(prev => ({
      ...prev,
      style: {
        ...prev.style,
        [styleType]: value
      }
    }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this node?')) {
      // TODO: Implement delete functionality
      console.log('Delete node:', node._id);
    }
  };

  if (!node) {
    return (
      <EditorContainer>
        <EditorHeader>
          <EditorTitle>No Node Selected</EditorTitle>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </EditorHeader>
        <EditorContent>
          <p>Select a node to edit its properties.</p>
        </EditorContent>
      </EditorContainer>
    );
  }

  return (
    <EditorContainer>
      <EditorHeader>
        <EditorTitle>Edit Node</EditorTitle>
        <CloseButton onClick={onClose}>
          <FiX size={20} />
        </CloseButton>
      </EditorHeader>

      <EditorContent>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter node title"
              error={errors.title}
              {...register('title', {
                required: 'Title is required',
                maxLength: {
                  value: 200,
                  message: 'Title must be less than 200 characters'
                }
              })}
            />
            {errors.title && (
              <ErrorMessage>{errors.title.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="content">Content</Label>
            <TextArea
              id="content"
              placeholder="Enter node content (optional)"
              error={errors.content}
              {...register('content', {
                maxLength: {
                  value: 2000,
                  message: 'Content must be less than 2000 characters'
                }
              })}
            />
            {errors.content && (
              <ErrorMessage>{errors.content.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="type">Type</Label>
            <Select id="type" {...register('type')}>
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="link">Link</option>
              <option value="note">Note</option>
            </Select>
          </FormGroup>

          <SectionTitle>
            <FiSliders size={16} />
            Appearance
          </SectionTitle>

          <FormGroup>
            <Label>Background Color</Label>
            <ColorPickerContainer>
              <ColorButton
                type="button"
                color={nodeData?.style?.backgroundColor || '#ffffff'}
                onClick={() => setShowColorPicker(showColorPicker === 'backgroundColor' ? null : 'backgroundColor')}
              />
              {showColorPicker === 'backgroundColor' && (
                <ColorPicker>
                  <ChromePicker
                    color={nodeData?.style?.backgroundColor || '#ffffff'}
                    onChange={(color) => handleColorChange('backgroundColor', color)}
                  />
                </ColorPicker>
              )}
            </ColorPickerContainer>
          </FormGroup>

          <FormGroup>
            <Label>Text Color</Label>
            <ColorPickerContainer>
              <ColorButton
                type="button"
                color={nodeData?.style?.textColor || '#1f2937'}
                onClick={() => setShowColorPicker(showColorPicker === 'textColor' ? null : 'textColor')}
              />
              {showColorPicker === 'textColor' && (
                <ColorPicker>
                  <ChromePicker
                    color={nodeData?.style?.textColor || '#1f2937'}
                    onChange={(color) => handleColorChange('textColor', color)}
                  />
                </ColorPicker>
              )}
            </ColorPickerContainer>
          </FormGroup>

          <FormGroup>
            <Label>Border Color</Label>
            <ColorPickerContainer>
              <ColorButton
                type="button"
                color={nodeData?.style?.borderColor || '#d1d5db'}
                onClick={() => setShowColorPicker(showColorPicker === 'borderColor' ? null : 'borderColor')}
              />
              {showColorPicker === 'borderColor' && (
                <ColorPicker>
                  <ChromePicker
                    color={nodeData?.style?.borderColor || '#d1d5db'}
                    onChange={(color) => handleColorChange('borderColor', color)}
                  />
                </ColorPicker>
              )}
            </ColorPickerContainer>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="fontSize">Font Size</Label>
            <Input
              id="fontSize"
              type="number"
              min="8"
              max="24"
              value={nodeData?.style?.fontSize || 14}
              onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value) || 14)}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="fontWeight">Font Weight</Label>
            <Select 
              id="fontWeight" 
              value={nodeData?.style?.fontWeight || 'normal'}
              onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </Select>
          </FormGroup>
        </Form>
      </EditorContent>

      <EditorFooter>
        <Button
          variant="danger"
          onClick={handleDelete}
        >
          <FiTrash2 size={16} />
          Delete
        </Button>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSaving}>
            <FiSave size={16} />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </EditorFooter>
    </EditorContainer>
  );
};

export default NodeEditor;