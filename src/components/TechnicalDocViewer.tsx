import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Shield, 
  Server, 
  Code, 
  Zap,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { 
  technicalDocumentation, 
  getDocumentationByCategory,
  getDocumentationCategories,
  type TechnicalDocContent 
} from '@/data/technicalDocumentation';
import { toast } from 'sonner';

interface TechnicalDocViewerProps {
  partnerId: string;
  onBack?: () => void;
}

const TechnicalDocViewer: React.FC<TechnicalDocViewerProps> = ({ partnerId, onBack }) => {
  const [selectedDoc, setSelectedDoc] = useState<TechnicalDocContent | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = getDocumentationCategories();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'process':
        return <FileText className="h-5 w-5" />;
      case 'security':
        return <Shield className="h-5 w-5" />;
      case 'hosting':
        return <Server className="h-5 w-5" />;
      case 'technology':
        return <Code className="h-5 w-5" />;
      case 'performance':
        return <Zap className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'process':
        return 'text-blue-500 bg-blue-50 border-blue-200';
      case 'security':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'hosting':
        return 'text-green-500 bg-green-50 border-green-200';
      case 'technology':
        return 'text-purple-500 bg-purple-50 border-purple-200';
      case 'performance':
        return 'text-orange-500 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const handleDownload = async (doc: TechnicalDocContent) => {
    try {
      // In a real implementation, this would generate and download a PDF
      toast.success(`Downloading ${doc.title}...`);
      
      // Track download analytics
      console.log('Download tracked for partner:', partnerId, 'doc:', doc.id);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  const filteredDocs = activeCategory === 'all' 
    ? technicalDocumentation 
    : getDocumentationByCategory(activeCategory as TechnicalDocContent['category']);

  // Document detail view
  if (selectedDoc) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedDoc(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Documentation
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(selectedDoc.category)}
                  <CardTitle className="text-2xl">{selectedDoc.title}</CardTitle>
                </div>
                <CardDescription className="text-base">
                  {selectedDoc.summary}
                </CardDescription>
              </div>
              <Button onClick={() => handleDownload(selectedDoc)}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Key Points */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Points</h3>
              <div className="grid gap-2">
                {selectedDoc.keyPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Documentation Content</h3>
              <div className="prose prose-sm max-w-none bg-muted/30 p-6 rounded-lg">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {selectedDoc.content}
                </pre>
              </div>
            </div>

            {/* Related Resources */}
            {selectedDoc.relatedResources && selectedDoc.relatedResources.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Related Resources</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDoc.relatedResources.map((resource, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer hover:bg-muted">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {resource}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Documentation list view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Technical Documentation</h2>
          <p className="text-muted-foreground">
            Comprehensive guides covering web development, security, hosting, and performance
          </p>
        </div>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
          </Button>
        )}
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">
            All ({technicalDocumentation.length})
          </TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id}>
              {cat.name.split(' ')[0]} ({cat.count})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocs.map((doc) => (
              <Card 
                key={doc.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedDoc(doc)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 rounded-lg border ${getCategoryColor(doc.category)}`}>
                      {getCategoryIcon(doc.category)}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {doc.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-base line-clamp-2">
                    {doc.title}
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-3">
                    {doc.summary}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Key Points Preview */}
                    <div className="space-y-1">
                      {doc.keyPoints.slice(0, 2).map((point, index) => (
                        <div key={index} className="flex items-start gap-1.5">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {point}
                          </span>
                        </div>
                      ))}
                      {doc.keyPoints.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{doc.keyPoints.length - 2} more points
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoc(doc);
                        }}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(doc);
                        }}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechnicalDocViewer;
