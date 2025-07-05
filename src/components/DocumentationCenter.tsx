import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { 
  FileText, 
  Plus, 
  Search, 
  Folder,
  Tag,
  Clock,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  Users,
  Settings,
  Code,
  Database,
  Shield,
  Zap,
  GitBranch,
  Terminal,
  AlertCircle,
  CheckCircle,
  Info,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Star,
  History,
  Loader2
} from "lucide-react";
import { format } from "date-fns";

interface Document {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  type: 'process' | 'system' | 'guide' | 'policy' | 'template';
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'team' | 'private';
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  version: number;
  parent_id?: string;
  children?: Document[];
  is_starred: boolean;
  view_count: number;
}

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  count: number;
}

const DocumentationCenter = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const [documentForm, setDocumentForm] = useState({
    title: "",
    content: "",
    category: "general",
    tags: "",
    type: "process" as Document['type'],
    visibility: "team" as Document['visibility']
  });

  const categories: Category[] = [
    { id: 'general', name: 'General', icon: FileText, color: 'text-gray-600', count: 0 },
    { id: 'development', name: 'Development', icon: Code, color: 'text-blue-600', count: 0 },
    { id: 'operations', name: 'Operations', icon: Settings, color: 'text-green-600', count: 0 },
    { id: 'sales', name: 'Sales', icon: Users, color: 'text-purple-600', count: 0 },
    { id: 'security', name: 'Security', icon: Shield, color: 'text-red-600', count: 0 },
    { id: 'deployment', name: 'Deployment', icon: Zap, color: 'text-yellow-600', count: 0 }
  ];

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      // Mock data for demo
      const mockDocs: Document[] = [
        {
          id: "1",
          title: "Client Onboarding Process",
          content: `# Client Onboarding Process

## Overview
This document outlines our standard process for onboarding new clients.

## Steps
1. **Initial Contact**
   - Schedule discovery call
   - Send welcome email
   - Share initial questionnaire

2. **Discovery & Requirements**
   - Conduct discovery meeting
   - Document requirements
   - Create project scope

3. **Proposal & Contract**
   - Prepare custom proposal
   - Review with client
   - Sign contracts

4. **Project Kickoff**
   - Set up project management
   - Create communication channels
   - Schedule kickoff meeting

## Best Practices
- Always respond within 24 hours
- Use templates for consistency
- Document all client preferences`,
          category: "sales",
          tags: ["onboarding", "client", "process"],
          type: "process",
          status: "published",
          visibility: "team",
          author_id: "1",
          author_name: "Mike Johnson",
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          version: 2,
          is_starred: true,
          view_count: 45
        },
        {
          id: "2",
          title: "Development Workflow",
          content: `# Development Workflow

## Git Workflow
We follow a feature branch workflow:
- Main branch is always deployable
- Create feature branches from main
- Submit PRs for review
- Merge after approval

## Code Standards
- Use TypeScript for all new code
- Follow ESLint configuration
- Write tests for new features
- Document complex logic

## Deployment Process
1. Run tests locally
2. Push to feature branch
3. Create PR with description
4. Wait for CI/CD checks
5. Merge after review
6. Deploy to staging
7. Test in staging
8. Deploy to production`,
          category: "development",
          tags: ["git", "workflow", "deployment"],
          type: "system",
          status: "published",
          visibility: "team",
          author_id: "2",
          author_name: "Sarah Chen",
          created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          version: 3,
          is_starred: true,
          view_count: 78
        },
        {
          id: "3",
          title: "API Documentation Template",
          content: `# API Documentation Template

Use this template for documenting new API endpoints.

## Endpoint: [METHOD] /api/[resource]

### Description
Brief description of what this endpoint does.

### Authentication
- [ ] Public
- [x] Requires authentication
- [ ] Admin only

### Request
\`\`\`json
{
  "field1": "string",
  "field2": 123
}
\`\`\`

### Response
\`\`\`json
{
  "success": true,
  "data": {
    "id": "123",
    "field1": "value"
  }
}
\`\`\`

### Error Codes
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error`,
          category: "development",
          tags: ["api", "template", "documentation"],
          type: "template",
          status: "published",
          visibility: "team",
          author_id: "2",
          author_name: "Sarah Chen",
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          version: 1,
          is_starred: false,
          view_count: 23
        },
        {
          id: "4",
          title: "Security Best Practices",
          content: `# Security Best Practices

## Authentication
- Use strong passwords
- Enable 2FA where possible
- Rotate API keys regularly

## Data Protection
- Encrypt sensitive data
- Use HTTPS everywhere
- Follow GDPR guidelines

## Access Control
- Principle of least privilege
- Regular access reviews
- Remove unused accounts`,
          category: "security",
          tags: ["security", "best-practices"],
          type: "policy",
          status: "published",
          visibility: "team",
          author_id: "1",
          author_name: "Mike Johnson",
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          version: 1,
          is_starred: false,
          view_count: 34
        }
      ];
      
      setDocuments(mockDocs);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
    setLoading(false);
  };

  const createDocument = async () => {
    if (!documentForm.title || !documentForm.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const newDoc: Document = {
        id: Date.now().toString(),
        title: documentForm.title,
        content: documentForm.content,
        category: documentForm.category,
        tags: documentForm.tags.split(',').map(t => t.trim()).filter(t => t),
        type: documentForm.type,
        status: 'draft',
        visibility: documentForm.visibility,
        author_id: user?.id || '1',
        author_name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: 1,
        is_starred: false,
        view_count: 0
      };

      setDocuments(prev => [newDoc, ...prev]);
      setShowCreateDialog(false);
      setDocumentForm({
        title: "",
        content: "",
        category: "general",
        tags: "",
        type: "process",
        visibility: "team"
      });
      toast.success('Document created successfully!');
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('Failed to create document');
    }
  };

  const updateDocument = async () => {
    if (!selectedDocument || !documentForm.title || !documentForm.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const updatedDoc = {
        ...selectedDocument,
        title: documentForm.title,
        content: documentForm.content,
        category: documentForm.category,
        tags: documentForm.tags.split(',').map(t => t.trim()).filter(t => t),
        type: documentForm.type,
        visibility: documentForm.visibility,
        updated_at: new Date().toISOString(),
        version: selectedDocument.version + 1
      };

      setDocuments(prev => prev.map(doc => 
        doc.id === selectedDocument.id ? updatedDoc : doc
      ));
      setShowEditDialog(false);
      setSelectedDocument(updatedDoc);
      toast.success('Document updated successfully!');
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document');
    }
  };

  const deleteDocument = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      if (selectedDocument?.id === id) {
        setSelectedDocument(null);
      }
      toast.success('Document deleted successfully!');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const toggleStar = async (id: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, is_starred: !doc.is_starred } : doc
    ));
  };

  const getTypeIcon = (type: Document['type']) => {
    switch (type) {
      case 'process': return <GitBranch className="h-4 w-4" />;
      case 'system': return <Database className="h-4 w-4" />;
      case 'guide': return <BookOpen className="h-4 w-4" />;
      case 'policy': return <Shield className="h-4 w-4" />;
      case 'template': return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadgeColor = (type: Document['type']) => {
    switch (type) {
      case 'process': return 'default';
      case 'system': return 'secondary';
      case 'guide': return 'default';
      case 'policy': return 'destructive';
      case 'template': return 'outline';
      default: return 'default';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === "all" || doc.category === filterCategory;
    const matchesType = filterType === "all" || doc.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const starredDocuments = documents.filter(doc => doc.is_starred);
  const recentDocuments = [...documents].sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  ).slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* Sidebar */}
      <div className="w-64 border-r bg-gray-50 p-4 space-y-6">
        {/* Quick Actions */}
        <div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                New Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Document</DialogTitle>
                <DialogDescription>
                  Create a new process, system documentation, or guide
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={documentForm.title}
                    onChange={(e) => setDocumentForm({...documentForm, title: e.target.value})}
                    placeholder="Document title"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={documentForm.type}
                      onValueChange={(value) => setDocumentForm({...documentForm, type: value as Document['type']})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="process">Process</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="guide">Guide</SelectItem>
                        <SelectItem value="policy">Policy</SelectItem>
                        <SelectItem value="template">Template</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={documentForm.category}
                      onValueChange={(value) => setDocumentForm({...documentForm, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Visibility</Label>
                    <Select
                      value={documentForm.visibility}
                      onValueChange={(value) => setDocumentForm({...documentForm, visibility: value as Document['visibility']})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="team">Team</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={documentForm.tags}
                    onChange={(e) => setDocumentForm({...documentForm, tags: e.target.value})}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={documentForm.content}
                    onChange={(e) => setDocumentForm({...documentForm, content: e.target.value})}
                    placeholder="Document content (Markdown supported)"
                    rows={15}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createDocument}>
                    Create Document
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Navigation */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-gray-600 mb-2">Quick Access</h3>
          <Button variant="ghost" className="w-full justify-start" onClick={() => setFilterCategory("all")}>
            <FileText className="h-4 w-4 mr-2" />
            All Documents
            <Badge variant="secondary" className="ml-auto">{documents.length}</Badge>
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Star className="h-4 w-4 mr-2" />
            Starred
            <Badge variant="secondary" className="ml-auto">{starredDocuments.length}</Badge>
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Clock className="h-4 w-4 mr-2" />
            Recent
          </Button>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-gray-600 mb-2">Categories</h3>
          {categories.map(category => {
            const count = documents.filter(d => d.category === category.id).length;
            return (
              <Button
                key={category.id}
                variant="ghost"
                className={`w-full justify-start ${filterCategory === category.id ? 'bg-gray-100' : ''}`}
                onClick={() => setFilterCategory(category.id)}
              >
                <category.icon className={`h-4 w-4 mr-2 ${category.color}`} />
                {category.name}
                {count > 0 && (
                  <Badge variant="secondary" className="ml-auto">{count}</Badge>
                )}
              </Button>
            );
          })}
        </div>

        {/* Document Types */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-gray-600 mb-2">Types</h3>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="process">Processes</SelectItem>
              <SelectItem value="system">Systems</SelectItem>
              <SelectItem value="guide">Guides</SelectItem>
              <SelectItem value="policy">Policies</SelectItem>
              <SelectItem value="template">Templates</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Document List */}
        <div className="w-96 border-r">
          <div className="p-4 border-b">
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <ScrollArea className="h-[calc(100%-73px)]">
            <div className="p-4 space-y-2">
              {filteredDocuments.map(doc => (
                <Card
                  key={doc.id}
                  className={`cursor-pointer transition-colors ${
                    selectedDocument?.id === doc.id ? 'border-primary' : 'hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDocument(doc)}
                >
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(doc.type)}
                          <CardTitle className="text-base">{doc.title}</CardTitle>
                        </div>
                        <CardDescription className="mt-1">
                          By {doc.author_name} • {format(new Date(doc.updated_at), 'MMM d, yyyy')}
                        </CardDescription>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={getTypeBadgeColor(doc.type) as any}>{doc.type}</Badge>
                          <Badge variant="outline">{doc.category}</Badge>
                          {doc.is_starred && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Document Viewer */}
        {selectedDocument ? (
          <div className="flex-1">
            <div className="border-b p-4 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(selectedDocument.type)}
                    <h2 className="text-xl font-bold">{selectedDocument.title}</h2>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Last updated {format(new Date(selectedDocument.updated_at), 'MMM d, yyyy h:mm a')} • 
                    Version {selectedDocument.version} • 
                    {selectedDocument.view_count} views
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleStar(selectedDocument.id)}
                  >
                    <Star className={`h-4 w-4 ${selectedDocument.is_starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDocumentForm({
                        title: selectedDocument.title,
                        content: selectedDocument.content,
                        category: selectedDocument.category,
                        tags: selectedDocument.tags.join(', '),
                        type: selectedDocument.type,
                        visibility: selectedDocument.visibility
                      });
                      setShowEditDialog(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteDocument(selectedDocument.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <History className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {selectedDocument.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <ScrollArea className="h-[calc(100%-120px)]">
              <div className="p-6">
                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ 
                    __html: selectedDocument.content.replace(/\n/g, '<br>')
                      .replace(/#{1,6}\s(.+)/g, '<h3>$1</h3>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/`(.*?)`/g, '<code>$1</code>')
                      .replace(/- (.+)/g, '<li>$1</li>')
                  }} />
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a document to view</p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      {showEditDialog && selectedDocument && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Document</DialogTitle>
              <DialogDescription>
                Update your document content and metadata
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={documentForm.title}
                  onChange={(e) => setDocumentForm({...documentForm, title: e.target.value})}
                  placeholder="Document title"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select
                    value={documentForm.type}
                    onValueChange={(value) => setDocumentForm({...documentForm, type: value as Document['type']})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="process">Process</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="policy">Policy</SelectItem>
                      <SelectItem value="template">Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={documentForm.category}
                    onValueChange={(value) => setDocumentForm({...documentForm, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Visibility</Label>
                  <Select
                    value={documentForm.visibility}
                    onValueChange={(value) => setDocumentForm({...documentForm, visibility: value as Document['visibility']})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                <Input
                  id="edit-tags"
                  value={documentForm.tags}
                  onChange={(e) => setDocumentForm({...documentForm, tags: e.target.value})}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              <div>
                <Label htmlFor="edit-content">Content *</Label>
                <Textarea
                  id="edit-content"
                  value={documentForm.content}
                  onChange={(e) => setDocumentForm({...documentForm, content: e.target.value})}
                  placeholder="Document content (Markdown supported)"
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={updateDocument}>
                  Update Document
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DocumentationCenter;