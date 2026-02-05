import React from 'react';
import { usePartnerAuth } from '@/contexts/PartnerAuthContext';
import ResourceLibrary from '@/components/ResourceLibrary';

const PartnerResources: React.FC = () => {
  const { partnerProfile } = usePartnerAuth();

  if (!partnerProfile) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">Please log in to access partner resources.</p>
        </div>
      </div>
    );
  }

  return <ResourceLibrary partnerId={partnerProfile.id} />;
};

export default PartnerResources;