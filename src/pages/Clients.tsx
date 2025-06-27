import { useState, useMemo } from "react";
import { Search, Users, Building2, Filter, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import ClientCard from "@/components/ClientCard";
import { clients, getUniqueCompanies, getTotalClientCount, getRecentClients } from "@/data/clientData";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  
  const companies = useMemo(() => getUniqueCompanies(), []);
  const totalClients = getTotalClientCount();
  const recentClients = getRecentClients().length;
  
  // Filter and sort clients
  const filteredClients = useMemo(() => {
    let filtered = [...clients];
    
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        client.firstName.toLowerCase().includes(search) ||
        client.lastName.toLowerCase().includes(search) ||
        client.email.toLowerCase().includes(search) ||
        (client.company && client.company.toLowerCase().includes(search)) ||
        (client.title && client.title.toLowerCase().includes(search))
      );
    }
    
    // Company filter
    if (selectedCompany !== "all") {
      filtered = filtered.filter(client => client.company === selectedCompany);
    }
    
    // Sorting
    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
        break;
      case "name-desc":
        filtered.sort((a, b) => `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`));
        break;
      case "company":
        filtered.sort((a, b) => (a.company || "").localeCompare(b.company || ""));
        break;
      case "date-asc":
        filtered.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
        break;
      case "date-desc":
      default:
        filtered.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        break;
    }
    
    return filtered;
  }, [searchTerm, selectedCompany, sortBy]);
  
  return (
    <>
      <SEO 
        title="Client Directory - App Suite"
        description="Browse our client directory featuring businesses we've built custom software solutions for."
        keywords="clients, portfolio, custom software clients, business applications"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Client Directory</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trusted by businesses across industries for custom software solutions
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{totalClients}</div>
                <p className="text-xs text-muted-foreground mt-1">Businesses served</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{companies.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Unique organizations</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Recent Additions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{recentClients}</div>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search by name, email, or company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Company</label>
                  <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Companies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Companies</SelectItem>
                      {companies.map(company => (
                        <SelectItem key={company} value={company}>
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Newest First</SelectItem>
                      <SelectItem value="date-asc">Oldest First</SelectItem>
                      <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                      <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Results count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredClients.length} of {totalClients} clients
            </p>
            {searchTerm || selectedCompany !== "all" ? (
              <Badge 
                variant="secondary" 
                className="cursor-pointer"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCompany("all");
                }}
              >
                Clear filters
              </Badge>
            ) : null}
          </div>
          
          {/* Client Cards Grid */}
          {filteredClients.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredClients.map((client, index) => (
                <ClientCard key={`${client.email}-${index}`} client={client} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No clients found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default Clients;