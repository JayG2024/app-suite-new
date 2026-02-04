import React from 'react';
import { usePartnerAuth } from '@/contexts/PartnerAuthContext';
import PartnerLayout from '@/components/PartnerLayout';
import ResourceLibrary from '@/components/ResourceLibrary';

const PartnerResources: React.FC = () => {
  const { partnerProfile } = usePartnerAuth();

  if (!partnerProfile) {
    return (
      <PartnerLayout>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">Please log in to access partner resources.</p>
          </div>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout>
      <div className="container mx-auto px-4 py-8">
        <ResourceLibrary partnerId={partnerProfile.id} />
      </div>
    </PartnerLayout>
  );
};

export default PartnerResources;