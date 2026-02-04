import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  ArrowLeft, 
  Download, 
  Clock, 
  TrendingUp,
  Users,
  Target,
  Lightbulb,
  FileText,
  X,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  trainingMaterials,
  trainingGuides,
  salesWorkflows,
  bestPractices,
  getMaterialsByCategory,
  getMaterialCategories,
  type TrainingMaterial,
  type TrainingGuide,
  type SalesWorkflow,
  type BestPractice
} from '@/data/partnerTrainingMaterials';

export function PartnerTrainingViewer() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<TrainingMaterial | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<TrainingGuide | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<SalesWorkflow | null>(null);
  const [selectedPractice, setSelectedPractice] = useState<BestPractice | null>(null);

  const categories = getMaterialCategories();

  const handleDownload = (title: string) => {
    toast.success(`Downloading: ${title}`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'training-guide':
        return <BookOpen className="h-4 w-4" />;
      case 'best-practices':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'sales-workflow':
        return <TrendingUp className="h-4 w-4" />;
      case 'technical-guide':
        return <FileText className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedMaterial) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setSelectedMaterial(null)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Training Materials
          </Button>
          <Button
            onClick={() => handleDownload(selectedMaterial.title)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{selectedMaterial.title}</CardTitle>
                <CardDescription>{selectedMaterial.summary}</CardDescription>
              </div>
              <Badge className="gap-1">
                {getCategoryIcon(selectedMaterial.category)}
                {selectedMaterial.category.replace('-', ' ')}
              </Badge>
            </div>
            <div className="flex gap-4 pt-2">
              {selectedMaterial.estimatedTime && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {selectedMaterial.estimatedTime}
                </div>
              )}
              {selectedMaterial.difficulty && (
                <Badge className={getDifficultyColor(selectedMaterial.difficulty)}>
                  {selectedMaterial.difficulty}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: selectedMaterial.content.replace(/\n/g, '<br />') }} />
            </div>

            {selectedMaterial.keyPoints.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Key Takeaways</h3>
                <ul className="space-y-2">
                  {selectedMaterial.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedMaterial.relatedResources && selectedMaterial.relatedResources.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Related Resources</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMaterial.relatedResources.map((resource, index) => (
                    <Badge key={index} variant="outline">
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

  if (selectedGuide) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setSelectedGuide(null)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Training Materials
          </Button>
          <Button
            onClick={() => handleDownload(selectedGuide.name)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{selectedGuide.name}</CardTitle>
            <CardDescription>
              {selectedGuide.modules.length} modules • {selectedGuide.modules.reduce((acc, m) => acc + parseInt(m.duration), 0)} total minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="0" className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto">
                {selectedGuide.modules.map((module, index) => (
                  <TabsTrigger key={index} value={index.toString()}>
                    Module {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
              {selectedGuide.modules.map((module, index) => (
                <TabsContent key={index} value={index.toString()} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">{module.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-4 w-4" />
                      {module.duration}
                    </p>
                  </div>

                  <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: module.content.replace(/\n/g, '<br />') }} />
                  </div>

                  {module.learningObjectives.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Learning Objectives
                      </h4>
                      <ul className="space-y-1">
                        {module.learningObjectives.map((objective, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {module.activities && module.activities.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Practice Activities
                      </h4>
                      <ul className="space-y-1">
                        {module.activities.map((activity, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-sm">• {activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedWorkflow) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setSelectedWorkflow(null)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Training Materials
          </Button>
          <Button
            onClick={() => handleDownload(selectedWorkflow.name)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{selectedWorkflow.name}</CardTitle>
            <CardDescription>{selectedWorkflow.stages.length} stages in the sales process</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedWorkflow.stages.map((stage, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{stage.stage}</h3>
                  <p className="text-sm text-muted-foreground">{stage.description}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Actions</h4>
                  <ul className="space-y-1">
                    {stage.actions.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Resources</h4>
                  <div className="flex flex-wrap gap-2">
                    {stage.resources.map((resource, idx) => (
                      <Badge key={idx} variant="outline">
                        {resource}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-1">
                    <Lightbulb className="h-4 w-4" />
                    Tips
                  </h4>
                  <ul className="space-y-1">
                    {stage.tips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedPractice) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setSelectedPractice(null)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Training Materials
          </Button>
          <Button
            onClick={() => handleDownload(selectedPractice.title)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{selectedPractice.title}</CardTitle>
                <CardDescription>{selectedPractice.description}</CardDescription>
              </div>
              <Badge>{selectedPractice.category}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-green-700">
                  <Check className="h-5 w-5" />
                  Do's
                </h3>
                <ul className="space-y-2">
                  {selectedPractice.dos.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-red-700">
                  <X className="h-5 w-5" />
                  Don'ts
                </h3>
                <ul className="space-y-2">
                  {selectedPractice.donts.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <X className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {selectedPractice.examples.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Examples</h3>
                <div className="space-y-2">
                  {selectedPractice.examples.map((example, index) => (
                    <div key={index} className="bg-muted p-3 rounded-lg">
                      <p className="text-sm">{example}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main list view
  const filteredMaterials = selectedCategory === 'all' 
    ? trainingMaterials 
    : getMaterialsByCategory(selectedCategory as TrainingMaterial['category']);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Partner Training & Onboarding</h2>
        <p className="text-muted-foreground">
          Comprehensive training guides, best practices, sales workflows, and technical implementation guides
        </p>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList>
          <TabsTrigger value="all">All Materials</TabsTrigger>
          <TabsTrigger value="training-guide">Training Guides</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
          <TabsTrigger value="sales-workflow">Sales Workflows</TabsTrigger>
          <TabsTrigger value="technical-guide">Technical Guides</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4 mt-6">
          {/* Training Materials */}
          {filteredMaterials.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMaterials.map((material) => (
                <Card 
                  key={material.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedMaterial(material)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{material.title}</CardTitle>
                      <Badge variant="outline" className="gap-1 flex-shrink-0">
                        {getCategoryIcon(material.category)}
                      </Badge>
                    </div>
                    <CardDescription>{material.summary}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {material.estimatedTime && (
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {material.estimatedTime}
                        </Badge>
                      )}
                      {material.difficulty && (
                        <Badge className={getDifficultyColor(material.difficulty)}>
                          {material.difficulty}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Key Points:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {material.keyPoints.slice(0, 3).map((point, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span>•</span>
                            <span className="line-clamp-1">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Training Guides */}
          {(selectedCategory === 'all' || selectedCategory === 'training-guide') && trainingGuides.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Interactive Training Guides</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {trainingGuides.map((guide) => (
                  <Card 
                    key={guide.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedGuide(guide)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        {guide.name}
                      </CardTitle>
                      <CardDescription>
                        {guide.modules.length} modules
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {guide.modules.map((module, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{module.title}</span>
                            <Badge variant="outline">{module.duration}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Sales Workflows */}
          {(selectedCategory === 'all' || selectedCategory === 'sales-workflow') && salesWorkflows.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Sales Process Workflows</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {salesWorkflows.map((workflow) => (
                  <Card 
                    key={workflow.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedWorkflow(workflow)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        {workflow.name}
                      </CardTitle>
                      <CardDescription>
                        {workflow.stages.length}-stage sales process
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        {workflow.stages.map((stage, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>{stage.stage}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Best Practices */}
          {(selectedCategory === 'all' || selectedCategory === 'best-practices') && bestPractices.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Best Practices</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {bestPractices.map((practice) => (
                  <Card 
                    key={practice.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedPractice(practice)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg">{practice.title}</CardTitle>
                        <Badge variant="outline">{practice.category}</Badge>
                      </div>
                      <CardDescription>{practice.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-green-700 mb-1">Do's</p>
                          <p className="text-muted-foreground">{practice.dos.length} guidelines</p>
                        </div>
                        <div>
                          <p className="font-medium text-red-700 mb-1">Don'ts</p>
                          <p className="text-muted-foreground">{practice.donts.length} warnings</p>
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
}
