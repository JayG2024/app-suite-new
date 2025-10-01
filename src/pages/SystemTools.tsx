import React from 'react';
import { CacheClearer, useCacheClearer } from '@/components/CacheClearer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Info, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

export default function SystemTools() {
  const { clearCache, isClearing, error } = useCacheClearer();
  const [lastCleared, setLastCleared] = React.useState<Date | null>(null);
  const [result, setResult] = React.useState<any>(null);

  const handleProgrammaticClear = async () => {
    try {
      const res = await clearCache(['theme', 'preferences']);
      setResult(res);
      setLastCleared(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      console.error('Failed to clear cache:', err);
      toast.error(`Failed to clear cache: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="System Tools - App Suite"
        description="System maintenance and debugging tools for App Suite"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">System Tools</h1>
            <p className="text-muted-foreground">
              Maintenance and debugging utilities for optimal performance
            </p>
          </div>

          {/* Cache Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Cache Management
              </CardTitle>
              <CardDescription>
                Clear browser caches to ensure you're seeing the latest version of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Keyboard Shortcut:</strong> Press <kbd className="px-2 py-1 text-sm bg-muted rounded">Ctrl/Cmd + Shift + R</kbd> to quickly clear cache
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg">UI Method</CardTitle>
                    <CardDescription>
                      Use the visual interface with options and feedback
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CacheClearer className="w-full" />
                  </CardContent>
                </Card>

                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg">Programmatic Method</CardTitle>
                    <CardDescription>
                      Clear cache programmatically with custom options
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={handleProgrammaticClear}
                      disabled={isClearing}
                      className="w-full"
                      variant="secondary"
                    >
                      {isClearing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Clearing...
                        </>
                      ) : (
                        'Clear Cache (Preserve Theme)'
                      )}
                    </Button>
                    
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    {lastCleared && (
                      <p className="text-sm text-muted-foreground">
                        Last cleared: {lastCleared.toLocaleTimeString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {result && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Terminal className="h-4 w-4" />
                      Last Operation Result
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm overflow-auto p-3 bg-background rounded-md">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">What gets cleared:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <div>
                      <strong>localStorage:</strong> All stored data except authentication tokens
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <div>
                      <strong>sessionStorage:</strong> All temporary session data
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <div>
                      <strong>Service Worker Caches:</strong> All cached API responses and assets
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <div>
                      <strong>IndexedDB:</strong> All offline databases
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <div>
                      <strong>Cookies:</strong> Non-essential cookies (auth cookies preserved)
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <div>
                      <strong>Asset Cache:</strong> Forces reload of CSS and JavaScript files
                    </div>
                  </li>
                </ul>
              </div>

              <Alert variant="default" className="border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-900 dark:text-blue-100">
                  <strong>Note:</strong> Your authentication tokens are always preserved. You won't be logged out when clearing cache.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Console Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Developer Console Access
              </CardTitle>
              <CardDescription>
                Advanced cache management functions are available in the browser console
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-md font-mono text-sm space-y-2">
                <p className="text-green-500"># Clear all caches</p>
                <p>window.clearAllCaches()</p>
                <br />
                <p className="text-green-500"># Clear with preserved items</p>
                <p>window.clearAllCaches(null, ['theme', 'preferences'])</p>
                <br />
                <p className="text-green-500"># Force hard reload</p>
                <p>window.forceHardReload()</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}