import { useState, useCallback, useRef } from 'react';

const useUndoRedo = (initialState) => {
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxHistorySize = useRef(50); // Limit history to 50 states

  const currentState = history[currentIndex];

  const pushState = useCallback((newState) => {
    console.log('📝 Pushing new state to history:', newState);
    setHistory(prevHistory => {
      const newHistory = prevHistory.slice(0, currentIndex + 1);
      newHistory.push(newState);
      
      // Limit history size
      if (newHistory.length > maxHistorySize.current) {
        newHistory.shift();
        return newHistory;
      }
      
      console.log('📚 History updated, length:', newHistory.length);
      return newHistory;
    });
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex + 1;
      console.log('📍 Current index updated to:', newIndex);
      return Math.min(newIndex, maxHistorySize.current - 1);
    });
  }, [currentIndex]);

  const undo = useCallback(() => {
    console.log('⏪ Undo called:', { currentIndex, historyLength: history.length });
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      console.log('✅ Undo successful, new index:', newIndex);
      return history[newIndex];
    }
    console.log('❌ Cannot undo - at beginning of history');
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    console.log('⏩ Redo called:', { currentIndex, historyLength: history.length });
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      console.log('✅ Redo successful, new index:', newIndex);
      return history[newIndex];
    }
    console.log('❌ Cannot redo - at end of history');
    return null;
  }, [currentIndex, history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;
  
  // Debug logs for canRedo
  console.log('🔍 canRedo check:', { 
    currentIndex, 
    historyLength: history.length, 
    canRedo,
    history: history.map((h, i) => ({ index: i, hasNodes: h?.nodes?.length || 0 }))
  });

  const reset = useCallback((newInitialState) => {
    setHistory([newInitialState]);
    setCurrentIndex(0);
  }, []);

  return {
    currentState,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    historyLength: history.length,
    currentIndex
  };
};

export default useUndoRedo;
