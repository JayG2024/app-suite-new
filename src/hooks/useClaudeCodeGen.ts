import { useState } from 'react';
import { toast } from 'sonner';

interface CodeGenerationResult {
  code: string;
  explanation: string;
  model?: string;
}

interface UseClaudeCodeGenOptions {
  projectType?: 'react' | 'nextjs' | 'vue' | 'vanilla';
  context?: string;
}

export const useClaudeCodeGen = (options: UseClaudeCodeGenOptions = {}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<CodeGenerationResult | null>(null);

  const generateCode = async (prompt: string): Promise<CodeGenerationResult | null> => {
    if (!prompt.trim()) {
      toast.error('Please provide a prompt for code generation');
      return null;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/.netlify/functions/claude-code-gen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          context: options.context,
          projectType: options.projectType || 'react'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate code');
      }

      const result = await response.json();
      setLastResult(result);
      
      // Show success message with model info
      toast.success(
        result.model 
          ? `Code generated using ${result.model}` 
          : 'Code generated successfully!'
      );

      return result;
    } catch (error) {
      console.error('Code generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate code');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const applyCodeToFile = (code: string, filePath: string) => {
    // This would integrate with your file system
    // For now, just return the code
    toast.success(`Code ready to apply to ${filePath}`);
    return code;
  };

  const improveCode = async (existingCode: string, improvementRequest: string) => {
    const prompt = `Improve this code based on the following request: ${improvementRequest}\n\nExisting code:\n${existingCode}`;
    return generateCode(prompt);
  };

  const explainCode = async (code: string) => {
    const prompt = `Explain this code in detail:\n${code}`;
    return generateCode(prompt);
  };

  const fixErrors = async (code: string, errorMessage: string) => {
    const prompt = `Fix this error in the code:\nError: ${errorMessage}\n\nCode:\n${code}`;
    return generateCode(prompt);
  };

  const generateTests = async (code: string) => {
    const prompt = `Generate comprehensive tests for this code:\n${code}`;
    return generateCode(prompt);
  };

  return {
    generateCode,
    applyCodeToFile,
    improveCode,
    explainCode,
    fixErrors,
    generateTests,
    isGenerating,
    lastResult
  };
};

// Common code generation templates
export const codeTemplates = {
  component: (name: string) => `Create a React component called ${name}`,
  api: (endpoint: string) => `Create an API service for ${endpoint} endpoint`,
  form: (fields: string[]) => `Create a form with these fields: ${fields.join(', ')}`,
  hook: (name: string) => `Create a custom React hook called ${name}`,
  page: (name: string) => `Create a page component for ${name}`,
  auth: () => 'Create a complete authentication system with login and registration',
  crud: (entity: string) => `Create full CRUD operations for ${entity}`,
  dashboard: () => 'Create a dashboard component with charts and statistics',
  table: (columns: string[]) => `Create a data table with these columns: ${columns.join(', ')}`,
  modal: (purpose: string) => `Create a modal component for ${purpose}`
};