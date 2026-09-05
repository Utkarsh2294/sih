import { useState, useEffect, useCallback } from 'react';

// Simple module-level store for toasts
let listeners = [];
let toasts = [];
let nextId = 0;

const notifyListeners = () => {
  for (let listener of listeners) {
    listener(toasts);
  }
};

export const toast = {
  add: ({ message, type = 'info', duration = 4000 }) => {
    const id = nextId++;
    const newToast = { id, message, type, duration };
    toasts = [...toasts, newToast];
    notifyListeners();

    if (duration !== Infinity) {
      setTimeout(() => {
        toast.remove(id);
      }, duration);
    }
    
    return id;
  },
  remove: (id) => {
    toasts = toasts.filter((t) => t.id !== id);
    notifyListeners();
  },
  success: (message, duration) => toast.add({ message, type: 'success', duration }),
  error: (message, duration) => toast.add({ message, type: 'error', duration }),
  info: (message, duration) => toast.add({ message, type: 'info', duration }),
};

export const useToast = () => {
  const [currentToasts, setCurrentToasts] = useState(toasts);

  useEffect(() => {
    const listener = (newToasts) => {
      setCurrentToasts(newToasts);
    };
    
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const addToast = useCallback((props) => toast.add(props), []);
  const removeToast = useCallback((id) => toast.remove(id), []);

  return { toasts: currentToasts, addToast, removeToast };
};
