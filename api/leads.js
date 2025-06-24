// App Suite Lead Management API
// Now integrated with Neon Database

import { db } from '../lib/database.js';

export default async function handler(req, res) {
  // Enable CORS for frontend integration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'POST') {
      // New lead from proposal generator
      const leadData = req.body;
      
      // Create lead data for database
      const leadRecord = {
        company: leadData.companyName,
        contact: leadData.contactName,
        email: leadData.email,
        phone: leadData.phone || null,
        industry: leadData.industry || null,
        type: leadData.projectType === 'ai-enhanced' ? 'ai-enhanced' : 
              leadData.projectType === 'enterprise' ? 'enterprise' : 'standard',
        value: leadData.estimatedValue,
        features: leadData.features || [],
        timeline: leadData.timeline || null,
        budget: leadData.budget || null,
        source: leadData.source || 'website_proposal_generator',
        notes: leadData.notes || `Generated proposal for ${leadData.projectType}. Challenge: ${leadData.currentChallenge || 'Not specified'}`,
        nextAction: leadData.nextAction || 'Follow up within 24 hours',
        nextActionDate: leadData.nextActionDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        probability: leadData.probability || 40
      };

      // Save to database
      const savedLead = await db.createLead(leadRecord);

      // Log activity
      await db.logActivity('lead_created', `New lead created: ${leadData.companyName}`, {
        leadId: savedLead.id,
        source: leadRecord.source,
        value: leadRecord.value
      });

      console.log('📧 New Lead Saved to Database:', {
        id: savedLead.id,
        company: savedLead.company_name,
        contact: savedLead.contact_name,
        email: savedLead.email,
        value: savedLead.estimated_value,
        source: savedLead.source
      });

      res.status(201).json({
        success: true,
        message: 'Lead created successfully',
        leadId: savedLead.id,
        lead: {
          id: savedLead.id,
          company: savedLead.company_name,
          contact: savedLead.contact_name,
          email: savedLead.email,
          phone: savedLead.phone,
          value: savedLead.estimated_value,
          type: savedLead.project_type,
          stage: savedLead.status,
          probability: savedLead.probability,
          nextAction: savedLead.next_action,
          nextActionDate: savedLead.next_action_date,
          source: savedLead.source,
          notes: savedLead.notes,
          createdDate: savedLead.created_date,
          industry: savedLead.industry,
          features: savedLead.features,
          timeline: savedLead.timeline,
          budget: savedLead.budget
        },
        nextSteps: [
          'Lead added to sales pipeline',
          'Follow-up email scheduled',
          'Team notification sent'
        ]
      });

    } else if (req.method === 'GET') {
      // Get leads for Command Center
      const filters = {
        limit: req.query.limit ? parseInt(req.query.limit) : 50,
        status: req.query.status,
        priority: req.query.priority
      };

      const leads = await db.getLeads(filters);
      
      // Transform database format to frontend format
      const transformedLeads = leads.map(lead => ({
        id: lead.id,
        company: lead.company_name,
        contact: lead.contact_name,
        email: lead.email,
        phone: lead.phone,
        value: lead.estimated_value,
        type: lead.project_type,
        stage: lead.status,
        probability: lead.probability,
        nextAction: lead.next_action,
        nextActionDate: lead.next_action_date,
        source: lead.source,
        notes: lead.notes,
        createdDate: lead.created_date,
        industry: lead.industry,
        features: lead.features,
        timeline: lead.timeline,
        budget: lead.budget,
        priority: lead.priority
      }));

      res.status(200).json({
        success: true,
        leads: transformedLeads,
        total: leads.length
      });

    } else if (req.method === 'PUT') {
      // Update lead
      const { id } = req.query;
      const updates = req.body;

      // Transform frontend field names to database field names
      const dbUpdates = {};
      if (updates.company) dbUpdates.company_name = updates.company;
      if (updates.contact) dbUpdates.contact_name = updates.contact;
      if (updates.value) dbUpdates.estimated_value = updates.value;
      if (updates.type) dbUpdates.project_type = updates.type;
      if (updates.stage) dbUpdates.status = updates.stage;
      if (updates.nextAction) dbUpdates.next_action = updates.nextAction;
      if (updates.nextActionDate) dbUpdates.next_action_date = updates.nextActionDate;
      
      // Pass through direct matches
      ['email', 'phone', 'industry', 'timeline', 'budget', 'source', 'notes', 'probability', 'priority', 'features'].forEach(field => {
        if (updates[field] !== undefined) dbUpdates[field] = updates[field];
      });

      const updatedLead = await db.updateLead(id, dbUpdates);

      // Log activity
      await db.logActivity('lead_updated', `Lead updated: ${updatedLead.company_name}`, {
        leadId: updatedLead.id,
        changes: Object.keys(dbUpdates)
      });

      res.status(200).json({
        success: true,
        message: 'Lead updated successfully',
        lead: updatedLead
      });

    } else {
      res.status(405).json({ 
        error: 'Method not allowed',
        allowedMethods: ['GET', 'POST', 'PUT']
      });
    }

  } catch (error) {
    console.error('Lead API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Lead processing temporarily unavailable'
    });
  }
}

// Future: Database Schema for Neon
/*
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  industry VARCHAR(100),
  project_type VARCHAR(50),
  estimated_value INTEGER,
  features JSONB,
  timeline VARCHAR(100),
  budget VARCHAR(100),
  source VARCHAR(100),
  status VARCHAR(50) DEFAULT 'proposal_sent',
  priority VARCHAR(20) DEFAULT 'medium',
  proposal_pdf VARCHAR(500),
  notes TEXT,
  next_action VARCHAR(255),
  next_action_date TIMESTAMP,
  probability INTEGER DEFAULT 40,
  created_date TIMESTAMP DEFAULT NOW(),
  updated_date TIMESTAMP DEFAULT NOW()
);
*/