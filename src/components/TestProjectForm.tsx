import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TestProjectForm = () => {
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { projectName, clientName });
    alert(`Project: ${projectName}, Client: ${clientName}`);
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Test Project Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="test-project-name">Project Name</Label>
            <Input
              id="test-project-name"
              type="text"
              value={projectName}
              onChange={(e) => {
                console.log('Project name changing to:', e.target.value);
                setProjectName(e.target.value);
              }}
              placeholder="Enter project name"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Current value: {projectName || '(empty)'}
            </p>
          </div>

          <div>
            <Label htmlFor="test-client-name">Client Name</Label>
            <Input
              id="test-client-name"
              type="text"
              value={clientName}
              onChange={(e) => {
                console.log('Client name changing to:', e.target.value);
                setClientName(e.target.value);
              }}
              placeholder="Enter client name"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Current value: {clientName || '(empty)'}
            </p>
          </div>

          <Button type="submit" className="w-full">
            Submit Test Form
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TestProjectForm;