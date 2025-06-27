
import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { faqData, faqCategories, searchFAQs } from "@/data/faqData";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = searchFAQs(searchQuery, selectedCategory);

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <SEO title="Help Center - App Suite Support & FAQs" description="Find answers to common questions about App Suite's custom software development services. Get help with projects, pricing, development process, and support options." />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">Help Center</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Find answers to your questions about our custom application building services
          </p>
          
          {/* Search */}
          <div className="flex gap-2 max-w-xl mx-auto mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search for help articles..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>Search</Button>
          </div>
        </div>

        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {faqCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Search Results Info */}
            {(searchQuery || selectedCategory !== "All") && (
              <div className="text-center text-muted-foreground">
                Found {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''}
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
              </div>
            )}

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id}>
                  <Collapsible 
                    open={expandedFAQ === faq.id}
                    onOpenChange={() => toggleFAQ(faq.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <CardTitle className="text-lg mb-2">{faq.question}</CardTitle>
                            <div className="flex gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {faq.category}
                              </Badge>
                            </div>
                          </div>
                          {expandedFAQ === faq.id ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No results found for your search.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Contact Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-muted-foreground">jason@jaydus.ai</p>
                      <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Link to="/contact">
                      <Button className="w-full">
                        Submit Support Request
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Support Hours & SLA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Business Hours</h4>
                    <p className="text-sm text-muted-foreground">Monday - Friday: 9 AM - 6 PM EST</p>
                    <p className="text-sm text-muted-foreground">Weekend: Emergency support only</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Response Times</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Critical Issues: Within 4 hours</li>
                      <li>• General Support: Within 24 hours</li>
                      <li>• Feature Requests: Within 48 hours</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">24/7 Emergency Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Available for critical system issues affecting business operations
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Link to="/contact">
                    <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                      <MessageCircle className="h-6 w-6" />
                      <span>Schedule Consultation</span>
                    </Button>
                  </Link>
                  <Link to="/apps">
                    <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                      <Search className="h-6 w-6" />
                      <span>Browse Applications</span>
                    </Button>
                  </Link>
                  <Link to="/roi-calculator">
                    <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                      <Clock className="h-6 w-6" />
                      <span>Calculate ROI</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HelpCenter;
