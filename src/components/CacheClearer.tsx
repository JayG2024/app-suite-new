import React, { useState, useEffect } from 'react';
import { Trash2, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { clearAllCaches, forceHardReload, setupCacheKeyboardShortcut } from '@/utils/clearCache';
import { hardcoreCachePurge, purgeAndReload } from '@/utils/hardcoreCachePurge';
import { cn } from '@/lib/utils';

interface CacheClearerProps {
  className?: string;
  showButton?: boolean;
  onCacheCleared?: () => void;
}

export function CacheClearer({ 
  className, 
  showButton = true,
  onCacheCleared 
}: CacheClearerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [result, setResult] = useState<any>(null);
  const [preserveSettings, setPreserveSettings] = useState(false);
  const [autoReload, setAutoReload] = useState(false);

  useEffect(() => {
    // Setup keyboard shortcut
    const cleanup = setupCacheKeyboardShortcut((result) => {
      setResult(result);
      setIsOpen(true);
      
      // Auto close after 3 seconds if successful
      if (result.success && result.errors.length === 0) {
        setTimeout(() => {
          setIsOpen(false);
          if (autoReload) {
            forceHardReload();
          }
        }, 3000);
      }
    });

    return cleanup;
  }, [autoReload]);

  const handleClearCache = async () => {
    setIsClearing(true);
    setProgress(0);
    setResult(null);
    setProgressMessage('Initializing cache purge...');

    const additionalPreserve = preserveSettings ? ['theme', 'preferences', 'settings'] : [];
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const result = await clearAllCaches((message) => {
        setProgressMessage(message);
      }, additionalPreserve);

      clearInterval(progressInterval);
      setProgress(100);
      setResult(result);
      
      onCacheCleared?.();

      // Auto reload if selected and successful
      if (result.success && result.errors.length === 0 && autoReload) {
        setTimeout(() => {
          forceHardReload();
        }, 2000);
      }
    } catch (error) {
      clearInterval(progressInterval);
      setResult({
        success: false,
        errors: [`Unexpected error: ${error}`],
        clearedItems: [],
        preservedItems: []
      });
    } finally {
      setIsClearing(false);
    }
  };

  const getResultIcon = () => {
    if (!result) return null;
    
    if (result.success && result.errors.length === 0) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (!result.success) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getResultColor = () => {
    if (!result) return '';
    
    if (result.success && result.errors.length === 0) {
      return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    } else if (!result.success) {
      return 'border-red-500 bg-red-50 dark:bg-red-900/20';
    } else {
      return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    }
  };

  return (
    <>
      {showButton && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn("gap-2", className)}
            >
              <Trash2 className="h-4 w-4" />
              Clear Cache
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Clear Browser Cache</DialogTitle>
              <DialogDescription>
                Remove all cached data to ensure you're seeing the latest version of the application.
                Your authentication will be preserved.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="preserve-settings"
                    checked={preserveSettings}
                    onCheckedChange={(checked) => setPreserveSettings(checked as boolean)}
                    disabled={isClearing}
                  />
                  <Label htmlFor="preserve-settings" className="cursor-pointer">
                    Preserve user preferences (theme, settings)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="auto-reload"
                    checked={autoReload}
                    onCheckedChange={(checked) => setAutoReload(checked as boolean)}
                    disabled={isClearing}
                  />
                  <Label htmlFor="auto-reload" className="cursor-pointer">
                    Automatically reload page after clearing
                  </Label>
                </div>
              </div>

              {isClearing && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground">{progressMessage}</p>
                </div>
              )}

              {result && !isClearing && (
                <Alert className={cn("", getResultColor())}>
                  <div className="flex items-start gap-2">
                    {getResultIcon()}
                    <AlertDescription className="space-y-2">
                      <div>
                        <strong>
                          {result.success && result.errors.length === 0
                            ? 'Cache cleared successfully!'
                            : result.success
                            ? 'Cache partially cleared'
                            : 'Cache clearing failed'}
                        </strong>
                      </div>
                      
                      {result.clearedItems.length > 0 && (
                        <div>
                          <p className="font-medium">Cleared:</p>
                          <ul className="text-xs space-y-1 mt-1">
                            {result.clearedItems.map((item: string, i: number) => (
                              <li key={i} className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {result.preservedItems.length > 0 && (
                        <div>
                          <p className="font-medium">Preserved:</p>
                          <ul className="text-xs space-y-1 mt-1">
                            {result.preservedItems.map((item: string, i: number) => (
                              <li key={i} className="flex items-center gap-1">
                                <AlertCircle className="h-3 w-3 text-blue-500" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {result.errors.length > 0 && (
                        <div>
                          <p className="font-medium text-red-600">Errors:</p>
                          <ul className="text-xs space-y-1 mt-1">
                            {result.errors.map((error: string, i: number) => (
                              <li key={i} className="text-red-600">{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              <div className="flex justify-between items-center pt-2">
                <p className="text-xs text-muted-foreground">
                  Shortcut: <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Ctrl/Cmd + Shift + R</kbd>
                </p>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    disabled={isClearing}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={handleClearCache}
                    disabled={isClearing}
                    className="gap-2"
                  >
                    {isClearing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Clearing...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Clear Cache
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// Export a hook for programmatic usage
export function useCacheClearer() {
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearCache = async (preserveAdditional?: string[]) => {
    setIsClearing(true);
    setError(null);
    
    try {
      const result = await clearAllCaches(undefined, preserveAdditional);
      if (!result.success) {
        setError(result.errors.join(', '));
      }
      return result;
    } catch (e) {
      setError(`Failed to clear cache: ${e}`);
      throw e;
    } finally {
      setIsClearing(false);
    }
  };

  return { clearCache, isClearing, error };
}