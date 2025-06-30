import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CacheClearer } from '@/components/CacheClearer';
import SEO from '@/components/SEO';

export default function CacheTest() {
  const [testData, setTestData] = useState('');
  const [storedData, setStoredData] = useState<string[]>([]);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = () => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !key.includes('auth')) {
        keys.push(key);
      }
    }
    setStoredData(keys);
  };

  const handleStore = () => {
    if (testData) {
      const key = `test_${Date.now()}`;
      localStorage.setItem(key, testData);
      sessionStorage.setItem(key, testData);
      setTestData('');
      loadStoredData();
    }
  };

  const handleCacheCleared = () => {
    // Reload stored data after cache is cleared
    setTimeout(loadStoredData, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Cache Test - App Suite"
        description="Test page for cache clearing functionality"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Cache Test Page</h1>
            <p className="text-muted-foreground">
              Test the cache clearing functionality by storing data and then clearing it
            </p>
          </div>

          {/* Cache Clearer */}
          <Card>
            <CardHeader>
              <CardTitle>Cache Management</CardTitle>
              <CardDescription>
                Use the button below or press Ctrl/Cmd + Shift + R to clear cache
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CacheClearer onCacheCleared={handleCacheCleared} />
            </CardContent>
          </Card>

          {/* Test Data Storage */}
          <Card>
            <CardHeader>
              <CardTitle>Test Data Storage</CardTitle>
              <CardDescription>
                Store test data in localStorage and sessionStorage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter test data to store..."
                  value={testData}
                  onChange={(e) => setTestData(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleStore()}
                />
                <Button onClick={handleStore} disabled={!testData}>
                  Store Data
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>Currently stored keys (non-auth):</Label>
                <div className="flex flex-wrap gap-2">
                  {storedData.length > 0 ? (
                    storedData.map((key) => (
                      <Badge key={key} variant="secondary">
                        {key}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No data stored</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Storage Status */}
          <Card>
            <CardHeader>
              <CardTitle>Storage Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>localStorage items:</Label>
                  <p className="text-2xl font-bold">{localStorage.length}</p>
                </div>
                <div>
                  <Label>sessionStorage items:</Label>
                  <p className="text-2xl font-bold">{sessionStorage.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Testing Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Store some test data using the form above</li>
                <li>Notice how the stored keys appear</li>
                <li>Click "Clear Cache" or use Ctrl/Cmd + Shift + R</li>
                <li>Observe that all test data is cleared but auth tokens are preserved</li>
                <li>Check the console for detailed clearing logs</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}