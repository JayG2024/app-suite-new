import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Phone, 
  Linkedin, 
  Building2, 
  User,
  Calendar,
  ExternalLink
} from "lucide-react";
import { Client } from "@/data/clientData";

interface ClientCardProps {
  client: Client;
}

const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  const fullName = `${client.firstName} ${client.lastName}`.trim();
  const initials = `${client.firstName.charAt(0)}${client.lastName ? client.lastName.charAt(0) : ''}`;
  
  // Format date to be more readable
  const formattedDate = new Date(client.dateAdded).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-semibold text-primary">{initials}</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-tight">{fullName}</h3>
              {client.title && (
                <p className="text-sm text-muted-foreground">{client.title}</p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {client.company && (
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{client.company}</span>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a 
              href={`mailto:${client.email}`} 
              className="text-primary hover:underline truncate"
              title={client.email}
            >
              {client.email}
            </a>
          </div>
          
          {client.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a 
                href={`tel:${client.phone.replace(/\D/g, '')}`} 
                className="hover:underline"
              >
                {client.phone}
              </a>
            </div>
          )}
          
          {client.linkedin && (
            <div className="flex items-center gap-2 text-sm">
              <Linkedin className="h-4 w-4 text-muted-foreground" />
              <a 
                href={`https://linkedin.com/in/${client.linkedin}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                LinkedIn Profile
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Added {formattedDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCard;