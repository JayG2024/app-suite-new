-- Partner Portal Schema Extension
-- Adds partner-specific tables and functionality to existing Supabase schema

-- Create partner-specific types
CREATE TYPE partner_status AS ENUM ('active', 'inactive', 'pending', 'suspended');
CREATE TYPE branding_level AS ENUM ('co-branded', 'partner-primary', 'full-white-label');
CREATE TYPE domain_type AS ENUM ('subdomain', 'custom-domain', 'partner-path');
CREATE TYPE domain_status AS ENUM ('pending', 'configuring', 'active', 'failed');
CREATE TYPE service_type AS ENUM ('custom-website', 'web-application', 'mobile-app', 'ai-website', 'ecommerce', 'maintenance');

-- Discount tiers table
CREATE TABLE public.discount_tiers (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  website_discount decimal(5,2) DEFAULT 0,
  webapp_discount decimal(5,2) DEFAULT 0,
  mobile_app_discount decimal(5,2) DEFAULT 0,
  ai_website_base_discount decimal(5,2) DEFAULT 0,
  ecommerce_discount decimal(5,2) DEFAULT 0,
  maintenance_discount decimal(5,2) DEFAULT 0,
  per_page_discount decimal(5,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Partner profiles table (extends existing profiles)
CREATE TABLE public.partner_profiles (
  id uuid REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  company_name text NOT NULL,
  contact_email text NOT NULL,
  discount_tier_id uuid REFERENCES discount_tiers(id),
  status partner_status DEFAULT 'pending',
  white_label_settings jsonb DEFAULT '{}'::jsonb,
  markup_preferences jsonb DEFAULT '{}'::jsonb,
  custom_domain text,
  branding_level branding_level DEFAULT 'co-branded',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Price quotes table
CREATE TABLE public.price_quotes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  partner_id uuid REFERENCES partner_profiles(id) ON DELETE CASCADE,
  service_type service_type NOT NULL,
  partner_cost decimal(10,2),
  suggested_retail_price decimal(10,2),
  markup_percentage decimal(5,2),
  specifications jsonb DEFAULT '{}'::jsonb,
  competitive_analysis jsonb DEFAULT '{}'::jsonb,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Resource categories table
CREATE TABLE public.resource_categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  description text,
  parent_category_id uuid REFERENCES resource_categories(id),
  created_at timestamptz DEFAULT now()
);

-- Resources table
CREATE TABLE public.resources (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  category_id uuid REFERENCES resource_categories(id),
  content_type text,
  file_path text,
  customizable boolean DEFAULT false,
  white_labelable boolean DEFAULT false,
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Custom resources table (partner-customized versions)
CREATE TABLE public.custom_resources (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  partner_id uuid REFERENCES partner_profiles(id) ON DELETE CASCADE,
  base_resource_id uuid REFERENCES resources(id),
  customized_content jsonb DEFAULT '{}'::jsonb,
  branding_data jsonb DEFAULT '{}'::jsonb,
  white_label_level branding_level DEFAULT 'co-branded',
  created_at timestamptz DEFAULT now()
);

-- Partner domains table (for white-label domain management)
CREATE TABLE public.partner_domains (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  partner_id uuid REFERENCES partner_profiles(id) ON DELETE CASCADE,
  domain_type domain_type NOT NULL,
  domain_name text,
  ssl_certificate_id text,
  dns_configured boolean DEFAULT false,
  status domain_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Partner analytics table
CREATE TABLE public.partner_analytics (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  partner_id uuid REFERENCES partner_profiles(id) ON DELETE CASCADE,
  metric_type text NOT NULL,
  metric_value decimal(10,2),
  metadata jsonb DEFAULT '{}'::jsonb,
  recorded_at timestamptz DEFAULT now()
);

-- Lead qualification forms table
CREATE TABLE public.qualification_forms (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  partner_id uuid REFERENCES partner_profiles(id) ON DELETE CASCADE,
  form_config jsonb DEFAULT '{}'::jsonb,
  public_url text,
  embed_code text,
  created_at timestamptz DEFAULT now()
);

-- Lead assessments table
CREATE TABLE public.lead_assessments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  form_id uuid REFERENCES qualification_forms(id) ON DELETE CASCADE,
  responses jsonb DEFAULT '{}'::jsonb,
  lead_score integer,
  service_recommendations jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Client profiles table (partner CRM)
CREATE TABLE public.client_profiles (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  partner_id uuid REFERENCES partner_profiles(id) ON DELETE CASCADE,
  company_name text,
  contact_info jsonb DEFAULT '{}'::jsonb,
  project_history jsonb DEFAULT '[]'::jsonb,
  communication_log jsonb DEFAULT '[]'::jsonb,
  preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on all partner tables
ALTER TABLE discount_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE qualification_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Partner Portal

-- Discount tiers: Viewable by partners, manageable by admins
CREATE POLICY "Partners can view discount tiers" ON discount_tiers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM partner_profiles 
      WHERE partner_profiles.id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage discount tiers" ON discount_tiers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Partner profiles: Partners can view/update own, admins can manage all
CREATE POLICY "Partners can view own profile" ON partner_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Partners can update own profile" ON partner_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all partner profiles" ON partner_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Price quotes: Partners can manage own quotes
CREATE POLICY "Partners can manage own quotes" ON price_quotes
  FOR ALL USING (
    partner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Resources: Partners can view, admins can manage
CREATE POLICY "Partners can view resources" ON resources
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM partner_profiles 
      WHERE partner_profiles.id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage resources" ON resources
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Resource categories: Same as resources
CREATE POLICY "Partners can view resource categories" ON resource_categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM partner_profiles 
      WHERE partner_profiles.id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage resource categories" ON resource_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Custom resources: Partners can manage own customizations
CREATE POLICY "Partners can manage own custom resources" ON custom_resources
  FOR ALL USING (
    partner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Partner domains: Partners can manage own domains
CREATE POLICY "Partners can manage own domains" ON partner_domains
  FOR ALL USING (
    partner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Partner analytics: Partners can view own analytics
CREATE POLICY "Partners can view own analytics" ON partner_analytics
  FOR SELECT USING (
    partner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "System can create analytics" ON partner_analytics
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Qualification forms: Partners can manage own forms
CREATE POLICY "Partners can manage own qualification forms" ON qualification_forms
  FOR ALL USING (
    partner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Lead assessments: Partners can view assessments from their forms
CREATE POLICY "Partners can view own lead assessments" ON lead_assessments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM qualification_forms 
      WHERE qualification_forms.id = lead_assessments.form_id 
      AND qualification_forms.partner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "System can create lead assessments" ON lead_assessments
  FOR INSERT WITH CHECK (true); -- Public forms need to create assessments

-- Client profiles: Partners can manage own client profiles
CREATE POLICY "Partners can manage own client profiles" ON client_profiles
  FOR ALL USING (
    partner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX idx_partner_profiles_status ON partner_profiles(status);
CREATE INDEX idx_partner_profiles_discount_tier ON partner_profiles(discount_tier_id);
CREATE INDEX idx_price_quotes_partner_id ON price_quotes(partner_id);
CREATE INDEX idx_price_quotes_service_type ON price_quotes(service_type);
CREATE INDEX idx_resources_category_id ON resources(category_id);
CREATE INDEX idx_custom_resources_partner_id ON custom_resources(partner_id);
CREATE INDEX idx_partner_domains_partner_id ON partner_domains(partner_id);
CREATE INDEX idx_partner_analytics_partner_id ON partner_analytics(partner_id);
CREATE INDEX idx_partner_analytics_recorded_at ON partner_analytics(recorded_at);
CREATE INDEX idx_qualification_forms_partner_id ON qualification_forms(partner_id);
CREATE INDEX idx_client_profiles_partner_id ON client_profiles(partner_id);

-- Apply updated_at triggers to partner tables
CREATE TRIGGER update_discount_tiers_updated_at BEFORE UPDATE ON discount_tiers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partner_profiles_updated_at BEFORE UPDATE ON partner_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_price_quotes_updated_at BEFORE UPDATE ON price_quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partner_domains_updated_at BEFORE UPDATE ON partner_domains
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_profiles_updated_at BEFORE UPDATE ON client_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default discount tiers
INSERT INTO discount_tiers (name, website_discount, webapp_discount, mobile_app_discount, ai_website_base_discount, ecommerce_discount, maintenance_discount, per_page_discount) VALUES
  ('Bronze', 10.00, 10.00, 10.00, 20.00, 10.00, 15.00, 50.00),
  ('Silver', 15.00, 15.00, 15.00, 25.00, 15.00, 20.00, 50.00),
  ('Gold', 20.00, 20.00, 20.00, 30.00, 20.00, 25.00, 50.00),
  ('Platinum', 25.00, 25.00, 25.00, 35.00, 25.00, 30.00, 50.00);

-- Insert default resource categories
INSERT INTO resource_categories (name, description) VALUES
  ('Technical Documentation', 'Technical specifications and implementation guides'),
  ('Sales Materials', 'Sales presentations, case studies, and competitive analysis'),
  ('Client Resources', 'Templates and materials for client presentations'),
  ('Training Materials', 'Partner onboarding and training resources');

-- Insert sample resources
INSERT INTO resources (title, category_id, content_type, customizable, white_labelable) VALUES
  ('Web Development Process Guide', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Security & Compliance Overview', (SELECT id FROM resource_categories WHERE name = 'Technical Documentation'), 'pdf', true, true),
  ('Service Comparison Chart', (SELECT id FROM resource_categories WHERE name = 'Sales Materials'), 'pdf', true, true),
  ('ROI Calculator Template', (SELECT id FROM resource_categories WHERE name = 'Sales Materials'), 'excel', true, true),
  ('Project Proposal Template', (SELECT id FROM resource_categories WHERE name = 'Client Resources'), 'docx', true, true),
  ('Statement of Work Template', (SELECT id FROM resource_categories WHERE name = 'Client Resources'), 'docx', true, true),
  ('Partner Onboarding Guide', (SELECT id FROM resource_categories WHERE name = 'Training Materials'), 'pdf', false, false),
  ('Sales Best Practices', (SELECT id FROM resource_categories WHERE name = 'Training Materials'), 'pdf', false, false);