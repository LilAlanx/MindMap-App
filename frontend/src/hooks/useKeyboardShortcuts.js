import { useEffect, useCallback } from 'react';

const useKeyboardShortcuts = (shortcuts) => {
  const handleKeyDown = useCallback((event) => {
    const { ctrlKey, metaKey, key, shiftKey } = event;
    const isCtrlOrCmd = ctrlKey || metaKey; // Support both Ctrl (Windows/Linux) and Cmd (Mac)
    
    // Create a key combination string
    const keyCombo = [
      isCtrlOrCmd ? 'ctrl' : '',
      shiftKey ? 'shift' : '',
      key.toLowerCase()
    ].filter(Boolean).join('+');

    // Debug log for all key presses
    if (isCtrlOrCmd) {
      console.log('⌨️ Key pressed:', { key, ctrlKey, metaKey, shiftKey, keyCombo });
    }

    // Find matching shortcut
    const shortcut = shortcuts[keyCombo];
    if (shortcut) {
      console.log('🎯 Shortcut matched:', keyCombo);
      event.preventDefault();
      shortcut.handler(event);
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

export default useKeyboardShortcuts;
