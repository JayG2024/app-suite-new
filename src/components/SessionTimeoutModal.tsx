import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SessionTimeoutModalProps {
  open: boolean;
  onReload?: () => void;
}

const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({ open, onReload }) => {
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Session Expired</DialogTitle>
          <DialogDescription>
            Your session has expired or you have been logged out. Please log in again to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end pt-4">
          <Button onClick={onReload || (() => window.location.reload())}>
            Go to Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionTimeoutModal; 