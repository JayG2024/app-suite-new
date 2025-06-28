import { useState } from 'react';
import { toast } from 'sonner';

interface CodeGenerationResult {
  code: string;
  explanation: string;
  model?: string;
}

interface UseASCCodeGenOptions {
  projectType?: 'react' | 'nextjs' | 'vue' | 'vanilla';
  context?: string;
}

export const useASCCodeGen = (options: UseASCCodeGenOptions = {}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<CodeGenerationResult | null>(null);

  const generateCode = async (prompt: string): Promise<CodeGenerationResult | null> => {
    if (!prompt.trim()) {
      toast.error('Please provide a prompt for ASC.AI');
      return null;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/.netlify/functions/asc-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...(options.context ? [{ role: 'user', content: `Context: ${options.context}` }] : []),
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate code');
      }

      const data = await response.json();
      
      // Extract code from the response content
      const content = data.content || '';
      const codeMatch = content.match(/```(\w+)?\n([\s\S]*?)```/);
      
      const result: CodeGenerationResult = {
        code: codeMatch ? codeMatch[2].trim() : content,
        explanation: content,
        model: 'claude-3-opus'
      };
      
      setLastResult(result);
      
      // Show success message with ASC branding
      toast.success('ASC.AI generated code successfully!');

      return result;
    } catch (error) {
      console.error('ASC.AI generation error:', error);
      toast.error(error instanceof Error ? error.message : 'ASC.AI failed to generate code');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const applyCodeToFile = (code: string, filePath: string) => {
    // This would integrate with your file system
    // For now, just return the code
    toast.success(`ASC.AI code ready to apply to ${filePath}`);
    return code;
  };

  const improveCode = async (existingCode: string, improvementRequest: string) => {
    const prompt = `asc improve: ${improvementRequest}\n\nExisting code:\n${existingCode}`;
    return generateCode(prompt);
  };

  const explainCode = async (code: string) => {
    const prompt = `asc explain this code:\n${code}`;
    return generateCode(prompt);
  };

  const fixErrors = async (code: string, errorMessage: string) => {
    const prompt = `asc fix error: ${errorMessage}\n\nCode:\n${code}`;
    return generateCode(prompt);
  };

  const generateTests = async (code: string) => {
    const prompt = `asc generate tests for:\n${code}`;
    return generateCode(prompt);
  };

  const analyzeCodebase = async (files: string[]) => {
    const prompt = `asc analyze codebase:\nFiles: ${files.join(', ')}`;
    return generateCode(prompt);
  };

  return {
    generateCode,
    applyCodeToFile,
    improveCode,
    explainCode,
    fixErrors,
    generateTests,
    analyzeCodebase,
    isGenerating,
    lastResult
  };
};

// ASC Command Templates
export const ascTemplates = {
  // Create commands
  'create-crm': (options?: any) => 
    `asc create crm${options?.withAnalytics ? ' --with-analytics' : ''}${options?.withAuth ? ' --with-auth' : ''}`,
  'create-inventory': (options?: any) => 
    `asc create inventory${options?.multiWarehouse ? ' --multi-warehouse' : ''}`,
  'create-dashboard': (options?: any) => 
    `asc create dashboard${options?.realtime ? ' --realtime' : ''}`,
  'create-ecommerce': (options?: any) => 
    `asc create ecommerce${options?.payment ? ` --payment ${options.payment}` : ''}`,
  
  // Add features
  'add-auth': (providers: string[]) => 
    `asc add authentication ${providers.join(' ')}`,
  'add-payment': (gateway: string) => 
    `asc add payment-gateway ${gateway}`,
  'add-charts': (dataType: string) => 
    `asc add charts ${dataType}`,
  'add-export': (format: string) => 
    `asc add export-${format}`,
  
  // Fix and optimize
  'fix-performance': () => 'asc fix performance issues',
  'fix-mobile': () => 'asc fix mobile responsiveness',
  'fix-typescript': () => 'asc fix typescript errors',
  'optimize-bundle': () => 'asc optimize bundle-size',
  
  // Analyze
  'analyze-all': () => 'asc analyze codebase',
  'analyze-security': () => 'asc analyze security',
  'analyze-performance': () => 'asc analyze performance',
  
  // Natural language
  'natural': (request: string) => `asc ${request}`
};