import React from 'react';
import { RotateCcw } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import Button from './ui/Button';
import { toast } from '../hooks/useToast';

const DemoResetButton = () => {
  const resetDemoData = useAppStore((state) => state.resetDemoData);

  if (!import.meta.env.DEV && !window.location.search.includes('demo=1')) return null;

  return (
    <Button
      size="sm"
      variant="secondary"
      icon={RotateCcw}
      onClick={() => {
        resetDemoData();
        toast.success('Demo data reset. The walkthrough is back to a clean state.');
      }}
    >
      Reset demo data
    </Button>
  );
};

export default DemoResetButton;
