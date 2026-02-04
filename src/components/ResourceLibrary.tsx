import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Search, 
  FileText, 
  Shield, 
  Settings, 
  BookOpen,
  Filter,
  Star,
  Calendar,
  Eye
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ResourceCustomizer } from './ResourceCustomizer';
import TechnicalDocViewer from './TechnicalDocViewer';
import SalesMarketingViewer from './SalesMarketingViewer';
import { mockResources, mockResourceCategories, USE_MOCK_DATA } from '@/lib/mockPartnerData';

interface ResourceCategory {
  id: string;
  name: string;
  description: string;
  parent_category_id?: string;
}

interface Resource {
  id: string;
  title: string;
  category_id: string;
  content_type: string;
  file_path?: string;
  customizable: boolean;
  white_labelable: boolean;
  version: number;
  created_at: string;
  updated_at: string;
  category?: ResourceCategory;
}

interface ResourceLibraryProps {
  partnerId: string;
}

const ResourceLibrary: React.FC<ResourceLibraryProps> = ({ partnerId }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [customizingResource, setCustomizingResource] = useState<Resource | null>(null);
  const [viewingTechnicalDocs, setViewingTechnicalDocs] = useState(false);
  const [viewingSalesMarketing, setViewingSalesMarketing] = useState(false);

  useEffect(() => {
    fetchResourcesAndCategories();
  }, []);

  const fetchResourcesAndCategories = async () => {
    try {
      setLoading(true);

      // Use mock data if database tables aren't available
      if (USE_MOCK_DATA) {
        setCategories(mockResourceCategories);
        setResources(mockResources);
        setLoading(false);
        return;
      }

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('resource_categories')
        .select('*')
        .order('name');

      if (categoriesError) {
        console.warn('Database tables not available, using mock data:', categoriesError);
        setCategories(mockResourceCategories);
        setResources(mockResources);
        setLoading(false);
        return;
      }

      // Fetch resources with category information
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select(`
          *,
          category:resource_categories(*)
        `)
        .order('title');

      if (resourcesError) {
        console.warn('Error fetching resources, using mock data:', resourcesError);
        setCategories(mockResourceCategories);
        setResources(mockResources);
        setLoading(false);
        return;
      }

      setCategories(categoriesData || []);
      setResources(resourcesData || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      // Fallback to mock data on error
      setCategories(mockResourceCategories);
      setResources(mockResources);
      toast.info('Using sample resources for demonstration');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resource: Resource) => {
    try {
      // For now, simulate download - in real implementation, this would download from Supabase Storage
      toast.success(`Downloading ${resource.title}...`);
      
      // Track download analytics (skip if using mock data)
      if (!USE_MOCK_DATA) {
        await supabase
          .from('partner_analytics')
          .insert({
            partner_id: partnerId,
            metric_type: 'resource_download',
            metric_value: 1,
            metadata: {
              resource_id: resource.id,
              resource_title: resource.title,
              content_type: resource.content_type
            }
          });
      }
    } catch (error) {
      console.error('Error downloading resource:', error);
      toast.error('Failed to download resource');
    }
  };

  const handleCustomize = (resource: Resource) => {
    setCustomizingResource(resource);
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.category?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || resource.category_id === selectedCategory;
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'customizable' && resource.customizable) ||
                      (activeTab === 'white-label' && resource.white_labelable) ||
                      (activeTab === resource.category?.name.toLowerCase().replace(/\s+/g, '-'));
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const getResourceIcon = (contentType: string) => {
    switch (contentType.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'excel':
      case 'xlsx':
        return <FileText className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'technical documentation':
        return <Settings className="h-4 w-4" />;
      case 'sales materials':
        return <Star className="h-4 w-4" />;
      case 'client resources':
        return <Eye className="h-4 w-4" />;
      case 'training materials':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show customizer if a resource is being customized
  if (customizingResource) {
    return (
      <ResourceCustomizer
        resource={customizingResource}
        partnerId={partnerId}
        onBack={() => setCustomizingResource(null)}
      />
    );
  }

  // Show technical documentation viewer
  if (viewingTechnicalDocs) {
    return (
      <TechnicalDocViewer
        partnerId={partnerId}
        onBack={() => setViewingTechnicalDocs(false)}
      />
    );
  }

  // Show sales and marketing materials viewer
  if (viewingSalesMarketing) {
    return (
      <SalesMarketingViewer
        partnerId={partnerId}
        onBack={() => setViewingSalesMarketing(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Resource Library</h2>
          <p className="text-muted-foreground">
            Access technical documentation, sales materials, and client resources
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setViewingTechnicalDocs(true)}
            className="flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Technical Docs
          </Button>
          <Button
            variant="outline"
            onClick={() => setViewingSalesMarketing(true)}
            className="flex items-center gap-2"
          >
            <Star className="h-4 w-4" />
            Sales Materials
          </Button>
          <Badge variant="secondary" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {resources.length} Resources
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="customizable">Customizable</TabsTrigger>
          <TabsTrigger value="white-label">White-Label</TabsTrigger>
          <TabsTrigger value="technical-documentation">Technical</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredResources.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No resources found</h3>
                <p className="text-muted-foreground text-center">
                  Try adjusting your search terms or filters
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getResourceIcon(resource.content_type)}
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-medium truncate">
                            {resource.title}
                          </CardTitle>
                          <CardDescription className="text-xs flex items-center gap-1 mt-1">
                            {getCategoryIcon(resource.category?.name || '')}
                            {resource.category?.name}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        v{resource.version}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {resource.customizable && (
                        <Badge variant="secondary" className="text-xs">
                          Customizable
                        </Badge>
                      )}
                      {resource.white_labelable && (
                        <Badge variant="secondary" className="text-xs">
                          White-Label
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {resource.content_type.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                      <Calendar className="h-3 w-3" />
                      Updated {new Date(resource.updated_at).toLocaleDateString()}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleDownload(resource)}
                        className="flex-1"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      {resource.customizable && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCustomize(resource)}
                          className="flex-1"
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Customize
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourceLibrary;