import { useState } from "react";

const EmailTracker = () => {
  const [loading] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1>Email Tracker</h1>
    </div>
  );
};

export default EmailTracker;