import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  CheckSquare,
  Calendar,
  FileSignature,
  ClipboardList,
  Settings
} from 'lucide-react';
import { 
  clientReadyMaterials,
  proposalTemplates,
  requirementForms,
  getMaterialCategories,
  getMaterialsByCategory,
  getProposalTemplateById,
  getRequirementFormById
} from '@/data/clientReadyMaterials';

interface ClientMaterialsViewerProps {
  partnerId: string;
  onBack: () => void;
}

const ClientMaterialsViewer: React.FC<ClientMaterialsViewerProps> = ({ partnerId, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewingMaterial, setViewingMaterial] = useState<any>(null);
  const [viewingProposal, setViewingProposal] = useState<any>(null);
  const [viewingForm, setViewingForm] = useState<any>(null);

  const categories = getMaterialCategories();

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'proposal':
        return <FileText className="h-4 w-4" />;
      case 'sow':
        return <FileSignature className="h-4 w-4" />;
      case 'requirements':
        return <ClipboardList className="h-4 w-4" />;
      case 'timeline':
        return <Calendar className="h-4 w-4" />;
      case 'maintenance-agreement':
        return <Settings className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleDownload = (material: any) => {
    // Simulate download - in real implementation, this would generate and download the document
    console.log('Downloading:', material.title);
  };

  const handleCustomize = (material: any) => {
    setViewingMaterial(material);
  };

  // If viewing a specific material
  if (viewingMaterial) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setViewingMaterial(null)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Materials
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{viewingMaterial.title}</CardTitle>
                <CardDescription>{viewingMaterial.summary}</CardDescription>
              </div>
              <Badge variant="secondary">{viewingMaterial.category}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="bg-muted p-4 rounded-lg mb-4">
                <h4 className="text-sm font-semibold mb-2">Fillable Fields:</h4>
                <div className="flex flex-wrap gap-2">
                  {viewingMaterial.fillableFields.map((field: string) => (
                    <Badge key={field} variant="outline" className="text-xs">
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="whitespace-pre-wrap text-sm">
                {viewingMaterial.content}
              </div>

              <div className="mt-6 flex gap-2">
                <Button onClick={() => handleDownload(viewingMaterial)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Customize with Branding
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If viewing a proposal template
  if (viewingProposal) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setViewingProposal(null)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Materials
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{viewingProposal.name}</CardTitle>
            <CardDescription>Project Type: {viewingProposal.projectType}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="0">
              <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${viewingProposal.sections.length}, 1fr)` }}>
                {viewingProposal.sections.map((section: any, index: number) => (
                  <TabsTrigger key={index} value={index.toString()}>
                    {section.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {viewingProposal.sections.map((section: any, index: number) => (
                <TabsContent key={index} value={index.toString()} className="space-y-4">
                  <div className="prose max-w-none">
                    {section.fillableFields.length > 0 && (
                      <div className="bg-muted p-4 rounded-lg mb-4">
                        <h4 className="text-sm font-semibold mb-2">Fillable Fields in this section:</h4>
                        <div className="flex flex-wrap gap-2">
                          {section.fillableFields.map((field: string) => (
                            <Badge key={field} variant="outline" className="text-xs">
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="whitespace-pre-wrap text-sm">
                      {section.content}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-6 flex gap-2">
              <Button onClick={() => handleDownload(viewingProposal)}>
                <Download className="h-4 w-4 mr-2" />
                Download Proposal Template
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Customize with Branding
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If viewing a requirements form
  if (viewingForm) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setViewingForm(null)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Materials
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{viewingForm.name}</CardTitle>
            <CardDescription>Project Type: {viewingForm.projectType}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {viewingForm.sections.map((section: any, sectionIndex: number) => (
                <div key={sectionIndex} className="border-b pb-6 last:border-b-0">
                  <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                  <div className="space-y-4">
                    {section.questions.map((question: any, questionIndex: number) => (
                      <div key={questionIndex} className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          {question.question}
                          {question.required && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                        </label>
                        <div className="text-xs text-muted-foreground">
                          Type: {question.type}
                          {question.options && ` | Options: ${question.options.length}`}
                        </div>
                        {question.options && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {question.options.map((option: string, optionIndex: number) => (
                              <Badge key={optionIndex} variant="outline" className="text-xs">
                                {option}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              <Button onClick={() => handleDownload(viewingForm)}>
                <Download className="h-4 w-4 mr-2" />
                Download Form Template
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Customize with Branding
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main view - list of materials
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resource Library
          </Button>
          <h2 className="text-2xl font-bold">Client-Ready Materials</h2>
          <p className="text-muted-foreground">
            Professional templates for proposals, contracts, and client communications
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Materials</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name} ({category.count})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {/* Proposal Templates */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Project Proposal Templates
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {proposalTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <CardDescription>
                      Project Type: {template.projectType} | {template.sections.length} sections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setViewingProposal(template)}>
                        View Template
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownload(template)}>
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* SOW Templates */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileSignature className="h-5 w-5" />
              Statement of Work Templates
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {getMaterialsByCategory('sow').map((material) => (
                <Card key={material.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-base">{material.title}</CardTitle>
                    <CardDescription>{material.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      {material.keyPoints.slice(0, 3).map((point, index) => (
                        <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                          <CheckSquare className="h-3 w-3" />
                          {point}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleCustomize(material)}>
                        View Template
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownload(material)}>
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Requirements Forms */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Technical Requirements Forms
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {requirementForms.map((form) => (
                <Card key={form.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-base">{form.name}</CardTitle>
                    <CardDescription>
                      Project Type: {form.projectType} | {form.sections.length} sections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3 text-xs text-muted-foreground">
                      Total Questions: {form.sections.reduce((acc, section) => acc + section.questions.length, 0)}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setViewingForm(form)}>
                        View Form
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownload(form)}>
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Timeline Templates */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Project Timeline Templates
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {getMaterialsByCategory('timeline').map((material) => (
                <Card key={material.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-base">{material.title}</CardTitle>
                    <CardDescription>{material.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      {material.keyPoints.slice(0, 3).map((point, index) => (
                        <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                          <CheckSquare className="h-3 w-3" />
                          {point}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleCustomize(material)}>
                        View Template
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownload(material)}>
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Maintenance Agreements */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Maintenance Agreement Templates
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {getMaterialsByCategory('maintenance-agreement').map((material) => (
                <Card key={material.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-base">{material.title}</CardTitle>
                    <CardDescription>{material.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      {material.keyPoints.slice(0, 3).map((point, index) => (
                        <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                          <CheckSquare className="h-3 w-3" />
                          {point}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleCustomize(material)}>
                        View Template
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownload(material)}>
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Individual category tabs */}
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {category.id === 'proposal' && proposalTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <CardDescription>
                      Project Type: {template.projectType} | {template.sections.length} sections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setViewingProposal(template)}>
                        View Template
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownload(template)}>
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {category.id === 'requirements' && requirementForms.map((form) => (
                <Card key={form.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-base">{form.name}</CardTitle>
                    <CardDescription>
                      Project Type: {form.projectType} | {form.sections.length} sections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setViewingForm(form)}>
                        View Form
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownload(form)}>
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {category.id !== 'proposal' && category.id !== 'requirements' && 
                getMaterialsByCategory(category.id as any).map((material) => (
                  <Card key={material.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-base">{material.title}</CardTitle>
                      <CardDescription>{material.summary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-3">
                        {material.keyPoints.slice(0, 3).map((point, index) => (
                          <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                            <CheckSquare className="h-3 w-3" />
                            {point}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleCustomize(material)}>
                          View Template
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDownload(material)}>
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              }
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ClientMaterialsViewer;
