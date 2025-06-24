
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Security = () => {
  return (
    <div className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Link to="/documentation" className="text-primary hover:underline flex items-center mb-4">
              <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
              <span>Back to Documentation</span>
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Data Security</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Understanding how App Suite protects your business data and maintains compliance with industry standards.
            </p>
          </div>

          <div className="space-y-8">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Security Overview</h2>
              <p className="text-muted-foreground mb-6">
                App Suite implements comprehensive security measures across multiple layers to protect your data. Our approach includes:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-md p-5">
                  <h3 className="font-medium mb-3">Infrastructure Security</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Secure data centers with 24/7 monitoring</li>
                    <li>Redundant power and cooling systems</li>
                    <li>Physical access controls and surveillance</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>DDoS protection and threat detection</li>
                  </ul>
                </div>
                
                <div className="border rounded-md p-5">
                  <h3 className="font-medium mb-3">Network Security</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Enterprise-grade firewalls and intrusion detection</li>
                    <li>Data encryption in transit (TLS 1.3)</li>
                    <li>VPN access for secure remote connections</li>
                    <li>Network segregation and isolation</li>
                    <li>Regular vulnerability scanning</li>
                  </ul>
                </div>
                
                <div className="border rounded-md p-5">
                  <h3 className="font-medium mb-3">Application Security</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Secure development lifecycle practices</li>
                    <li>Regular code reviews and security testing</li>
                    <li>Protection against OWASP Top 10 vulnerabilities</li>
                    <li>Rate limiting to prevent abuse</li>
                    <li>Web application firewall (WAF)</li>
                  </ul>
                </div>
                
                <div className="border rounded-md p-5">
                  <h3 className="font-medium mb-3">Data Security</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Encryption at rest (AES-256)</li>
                    <li>Database-level security controls</li>
                    <li>Secure backup procedures</li>
                    <li>Data loss prevention measures</li>
                    <li>Granular access controls</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">User Security & Access Controls</h2>
              <p className="text-muted-foreground mb-6">
                App Suite provides robust user security features to ensure that users can only access the data they need to perform their job.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-3">Authentication Options</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">Standard Authentication</h4>
                      <ul className="list-disc list-inside text-muted-foreground text-sm">
                        <li>Strong password policies</li>
                        <li>Account lockout after failed attempts</li>
                        <li>Password expiration controls</li>
                        <li>Password history enforcement</li>
                      </ul>
                    </div>
                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">Multi-Factor Authentication</h4>
                      <ul className="list-disc list-inside text-muted-foreground text-sm">
                        <li>SMS verification codes</li>
                        <li>Authenticator app support</li>
                        <li>Hardware security keys (FIDO2)</li>
                        <li>Biometric authentication options</li>
                      </ul>
                    </div>
                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">Single Sign-On (SSO)</h4>
                      <ul className="list-disc list-inside text-muted-foreground text-sm">
                        <li>SAML 2.0 support</li>
                        <li>OAuth 2.0 integration</li>
                        <li>OpenID Connect compatibility</li>
                        <li>Integration with major identity providers</li>
                      </ul>
                    </div>
                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">Advanced Security</h4>
                      <ul className="list-disc list-inside text-muted-foreground text-sm">
                        <li>IP address restrictions</li>
                        <li>Login hour limitations</li>
                        <li>Geographic access controls</li>
                        <li>Device trust verification</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-xl font-medium mb-3">Permission Management</h3>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      App Suite uses a comprehensive permission model to control data access:
                    </p>
                    
                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">Role-Based Access Control (RBAC)</h4>
                      <p className="text-muted-foreground text-sm">
                        Predefined roles (Administrator, Manager, User, Viewer) with appropriate permission sets that can be assigned to users.
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">Object-Level Permissions</h4>
                      <p className="text-muted-foreground text-sm">
                        Control which user roles can create, read, update, or delete specific types of records.
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">Field-Level Security</h4>
                      <p className="text-muted-foreground text-sm">
                        Restrict access to sensitive fields within records, with options to make fields read-only or completely hidden.
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">Record-Level Security</h4>
                      <p className="text-muted-foreground text-sm">
                        Control which specific records users can view or modify based on ownership, teams, or custom criteria.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>


            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Security Best Practices</h2>
              <p className="text-muted-foreground mb-6">
                Follow these recommendations to maximize the security of your App Suite instance:
              </p>
              
              <div className="space-y-5">
                <div className="flex items-start">
                  <div className="h-6 w-6 bg-primary/20 text-primary rounded-full flex items-center justify-center mr-3 mt-0.5">1</div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Enforce Strong Authentication</h3>
                    <p className="text-muted-foreground">
                      Enable multi-factor authentication for all users, especially administrators. Require complex passwords with regular rotation.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-6 w-6 bg-primary/20 text-primary rounded-full flex items-center justify-center mr-3 mt-0.5">2</div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Implement Least Privilege Access</h3>
                    <p className="text-muted-foreground">
                      Grant users only the permissions they need to perform their job functions. Regularly audit user permissions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-6 w-6 bg-primary/20 text-primary rounded-full flex items-center justify-center mr-3 mt-0.5">3</div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Monitor User Activity</h3>
                    <p className="text-muted-foreground">
                      Enable audit logging and regularly review logs for suspicious activities. Set up alerts for unusual access patterns.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-6 w-6 bg-primary/20 text-primary rounded-full flex items-center justify-center mr-3 mt-0.5">4</div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Maintain Data Hygiene</h3>
                    <p className="text-muted-foreground">
                      Regularly review and purge unnecessary data. Archive old records according to your retention policy.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-6 w-6 bg-primary/20 text-primary rounded-full flex items-center justify-center mr-3 mt-0.5">5</div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Train Your Team</h3>
                    <p className="text-muted-foreground">
                      Conduct regular security awareness training for all users with access to App Suite.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 border border-primary/20 bg-primary/5 rounded-md">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Security Assistance</h4>
                    <p className="text-muted-foreground text-sm">
                      Our security team is available to help you configure App Suite according to your security requirements. Contact us for a security assessment and recommendations.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
    </div>
  );
};

export default Security;
