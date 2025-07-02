-- Missing RLS Policies for tables without policies

-- Activity Log Policies
CREATE POLICY "Authenticated users can view activity logs" ON activity_log
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can create activity logs" ON activity_log
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Chat Sessions Policies  
CREATE POLICY "Users can view own chat sessions" ON chat_sessions
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create chat sessions" ON chat_sessions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own chat sessions" ON chat_sessions
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- Email Templates Policies
CREATE POLICY "Authenticated users can view email templates" ON email_templates
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can create email templates" ON email_templates
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update email templates" ON email_templates
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete email templates" ON email_templates
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Expenses Policies
CREATE POLICY "Authenticated users can view expenses" ON expenses
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create expenses" ON expenses
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own expenses" ON expenses
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Admins can delete expenses" ON expenses
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Invoices Policies
CREATE POLICY "Authenticated users can view invoices" ON invoices
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create invoices" ON invoices
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update invoices" ON invoices
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete invoices" ON invoices
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Newsletter Subscribers Policies (more open for newsletter functionality)
CREATE POLICY "Public can view newsletter status" ON newsletter_subscribers
  FOR SELECT USING (true);

CREATE POLICY "Public can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own subscription" ON newsletter_subscribers
  FOR UPDATE USING (email = (SELECT email FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage all subscriptions" ON newsletter_subscribers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );