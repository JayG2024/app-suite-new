import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Download, 
  TrendingUp, 
  Users, 
  Calculator,
  Target,
  DollarSign,
  CheckCircle,
  BarChart3,
  Award
} from 'lucide-react';
import { 
  salesMarketingMaterials,
  caseStudies,
  serviceComparisons,
  roiCalculators,
  getSalesResourcesByCategory,
  getSalesResourceCategories,
  type SalesResource,
  type CaseStudy
} from '@/data/salesMarketingMaterials';
import { toast } from 'sonner';

interface SalesMarketingViewerProps {
  partnerId: string;
  onBack?: () => void;
}

const SalesMarketingViewer: React.FC<SalesMarketingViewerProps> = ({ partnerId, onBack }) => {
  const [selectedResource, setSelectedResource] = useState<SalesResource | null>(null);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = getSalesResourceCategories();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'comparison':
        return <BarChart3 className="h-5 w-5" />;
      case 'case-study':
        return <Award className="h-5 w-5" />;
      case 'roi-calculator':
        return <Calculator className="h-5 w-5" />;
      case 'competitive-analysis':
        return <Target className="h-5 w-5" />;
      case 'pricing-justification':
        return <DollarSign className="h-5 w-5" />;
      default:
        return <TrendingUp className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'comparison':
        return 'text-blue-500 bg-blue-50 border-blue-200';
      case 'case-study':
        return 'text-green-500 bg-green-50 border-green-200';
      case 'roi-calculator':
        return 'text-purple-500 bg-purple-50 border-purple-200';
      case 'competitive-analysis':
        return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'pricing-justification':
        return 'text-emerald-500 bg-emerald-50 border-emerald-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const handleDownload = async (resource: SalesResource | CaseStudy) => {
    try {
      const name = 'title' in resource ? resource.title : resource.clientName;
      toast.success(`Downloading ${name}...`);
      console.log('Download tracked for partner:', partnerId);
    } catch (error) {
      console.error('Error downloading resource:', error);
      toast.error('Failed to download resource');
    }
  };

  // Case Study Detail View
  if (selectedCaseStudy) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedCaseStudy(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sales Materials
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-green-500" />
                  <CardTitle className="text-2xl">{selectedCaseStudy.clientName}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedCaseStudy.industry}</Badge>
                  <Badge variant="outline">{selectedCaseStudy.projectType}</Badge>
                  <Badge variant="secondary">{selectedCaseStudy.timeline}</Badge>
                </div>
              </div>
              <Button onClick={() => handleDownload(selectedCaseStudy)}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Challenge */}
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-500" />
                Challenge
              </h3>
              <p className="text-muted-foreground">{selectedCaseStudy.challenge}</p>
            </div>

            {/* Solution */}
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                Solution
              </h3>
              <p className="text-muted-foreground">{selectedCaseStudy.solution}</p>
            </div>

            {/* Results */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Results
              </h3>
              <div className="grid gap-2">
                {selectedCaseStudy.results.map((result, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{result}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Metrics</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {selectedCaseStudy.metrics.map((metric, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {metric.value}
                        </div>
                        <div className="text-sm font-medium mb-1">{metric.label}</div>
                        <div className="text-xs text-muted-foreground">{metric.improvement}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {selectedCaseStudy.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            {selectedCaseStudy.testimonial && (
              <div className="bg-muted/50 p-6 rounded-lg border-l-4 border-primary">
                <p className="italic text-muted-foreground">"{selectedCaseStudy.testimonial}"</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Resource Detail View
  if (selectedResource) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedResource(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sales Materials
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(selectedResource.category)}
                  <CardTitle className="text-2xl">{selectedResource.title}</CardTitle>
                </div>
                <CardDescription className="text-base">
                  {selectedResource.summary}
                </CardDescription>
              </div>
              <Button onClick={() => handleDownload(selectedResource)}>
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
                {selectedResource.keyPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Content</h3>
              <div className="prose prose-sm max-w-none bg-muted/30 p-6 rounded-lg">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {selectedResource.content}
                </pre>
              </div>
            </div>

            {/* Interactive Elements Badge */}
            {selectedResource.interactiveElements && (
              <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Calculator className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">
                  This resource includes interactive calculators and tools
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main List View
  const filteredResources = activeCategory === 'all' 
    ? salesMarketingMaterials 
    : getSalesResourcesByCategory(activeCategory as SalesResource['category']);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Sales & Marketing Materials</h2>
          <p className="text-muted-foreground">
            Service comparisons, case studies, ROI calculators, and pricing justification materials
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
            All ({salesMarketingMaterials.length + caseStudies.length})
          </TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id}>
              {cat.name.split(' ')[0]} ({cat.count})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          {/* Service Comparison Table */}
          {activeCategory === 'comparison' && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Service Comparison Matrix
                </CardTitle>
                <CardDescription>
                  Compare our services against traditional agencies, freelancers, and DIY platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Feature</th>
                        <th className="text-left p-3 font-semibold bg-primary/10">Our Service</th>
                        <th className="text-left p-3 font-semibold">Traditional Agency</th>
                        <th className="text-left p-3 font-semibold">Freelancer</th>
                        <th className="text-left p-3 font-semibold">DIY Platform</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceComparisons.map((comparison, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-medium">{comparison.feature}</td>
                          <td className="p-3 bg-primary/5 font-medium text-primary">{comparison.ourService}</td>
                          <td className="p-3 text-muted-foreground">{comparison.traditionalAgency}</td>
                          <td className="p-3 text-muted-foreground">{comparison.freelancer}</td>
                          <td className="p-3 text-muted-foreground">{comparison.diyPlatform}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Case Studies Grid */}
          {(activeCategory === 'all' || activeCategory === 'case-study') && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Case Studies
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {caseStudies.map((caseStudy) => (
                  <Card 
                    key={caseStudy.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedCaseStudy(caseStudy)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="p-2 rounded-lg border bg-green-50 border-green-200">
                          <Award className="h-5 w-5 text-green-500" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {caseStudy.industry}
                        </Badge>
                      </div>
                      <CardTitle className="text-base">
                        {caseStudy.clientName}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {caseStudy.challenge}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Top Metrics */}
                        <div className="grid grid-cols-2 gap-2">
                          {caseStudy.metrics.slice(0, 2).map((metric, index) => (
                            <div key={index} className="text-center p-2 bg-muted/50 rounded">
                              <div className="text-lg font-bold text-primary">{metric.value}</div>
                              <div className="text-xs text-muted-foreground">{metric.label}</div>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCaseStudy(caseStudy);
                            }}
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(caseStudy);
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
            </div>
          )}

          {/* Sales Resources Grid */}
          {filteredResources.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources & Guides</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredResources.map((resource) => (
                  <Card 
                    key={resource.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedResource(resource)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className={`p-2 rounded-lg border ${getCategoryColor(resource.category)}`}>
                          {getCategoryIcon(resource.category)}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {resource.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-base line-clamp-2">
                        {resource.title}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-3">
                        {resource.summary}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Key Points Preview */}
                        <div className="space-y-1">
                          {resource.keyPoints.slice(0, 2).map((point, index) => (
                            <div key={index} className="flex items-start gap-1.5">
                              <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-xs text-muted-foreground line-clamp-1">
                                {point}
                              </span>
                            </div>
                          ))}
                          {resource.keyPoints.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{resource.keyPoints.length - 2} more points
                            </span>
                          )}
                        </div>

                        {resource.interactiveElements && (
                          <Badge variant="outline" className="text-xs">
                            <Calculator className="h-3 w-3 mr-1" />
                            Interactive
                          </Badge>
                        )}

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedResource(resource);
                            }}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(resource);
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
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesMarketingViewer;
