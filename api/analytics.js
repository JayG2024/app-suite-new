// API endpoint for analytics data
import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

// Load environment variables
dotenv.config({ path: '.env.local' });

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  const client = await pool.connect();

  try {
    switch (req.method) {
      case 'GET':
        return await getAnalytics(req, res, client);
      case 'POST':
        return await recordAnalytics(req, res, client);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
}

async function getAnalytics(req, res, client) {
  try {
    const { period = '30' } = req.query; // Default to last 30 days
    const daysBack = parseInt(period);

    // Get website traffic data
    const trafficResult = await client.query(`
      SELECT 
        SUM(page_views) as total_views,
        SUM(unique_visitors) as total_visitors,
        COUNT(DISTINCT date) as days_tracked,
        AVG(bounce_rate) as avg_bounce_rate
      FROM website_analytics 
      WHERE date >= NOW() - INTERVAL '${daysBack} days'
    `);

    // Get traffic sources
    const sourcesResult = await client.query(`
      SELECT 
        source,
        SUM(sessions) as total_sessions,
        ROUND(
          (SUM(sessions)::float / 
           (SELECT SUM(sessions) FROM traffic_sources WHERE date >= NOW() - INTERVAL '${daysBack} days') * 100)::numeric, 
          1
        ) as percentage
      FROM traffic_sources 
      WHERE date >= NOW() - INTERVAL '${daysBack} days'
      GROUP BY source
      ORDER BY total_sessions DESC
    `);

    // Get social media metrics
    const socialResult = await client.query(`
      SELECT 
        platform,
        followers,
        engagement_rate,
        posts_count
      FROM social_media_metrics 
      WHERE date = (SELECT MAX(date) FROM social_media_metrics)
      ORDER BY followers DESC
    `);

    // Get email metrics
    const emailResult = await client.query(`
      SELECT 
        SUM(subscribers) as total_subscribers,
        AVG(open_rate) as avg_open_rate,
        AVG(click_rate) as avg_click_rate,
        COUNT(*) as campaigns_sent
      FROM email_campaigns 
      WHERE sent_date >= NOW() - INTERVAL '${daysBack} days'
    `);

    // Get top content
    const contentResult = await client.query(`
      SELECT 
        title,
        content_type,
        platform,
        views,
        clicks,
        shares,
        engagement
      FROM marketing_content 
      WHERE published_date >= NOW() - INTERVAL '${daysBack} days'
        AND status = 'published'
      ORDER BY (views + clicks * 2 + shares * 3) DESC
      LIMIT 5
    `);

    // Get lead generation data
    const leadsResult = await client.query(`
      SELECT 
        COUNT(*) as total_leads,
        COUNT(CASE WHEN status IN ('qualified', 'proposal', 'negotiation', 'closed-won') THEN 1 END) as qualified_leads
      FROM leads 
      WHERE created_date >= NOW() - INTERVAL '${daysBack} days'
    `);

    const traffic = trafficResult.rows[0];
    const sources = sourcesResult.rows.reduce((acc, row) => {
      acc[row.source] = parseInt(row.percentage);
      return acc;
    }, {});

    const social = socialResult.rows.reduce((acc, row) => {
      acc[row.platform] = {
        followers: row.followers,
        engagement: row.engagement_rate,
        posts: row.posts_count
      };
      return acc;
    }, {});

    const email = emailResult.rows[0];
    const content = contentResult.rows;
    const leads = leadsResult.rows[0];

    const analytics = {
      websiteTraffic: {
        totalViews: parseInt(traffic.total_views) || 0,
        totalVisitors: parseInt(traffic.total_visitors) || 0,
        avgBounceRate: parseFloat(traffic.avg_bounce_rate) || 0,
        sources: sources
      },
      socialMedia: social,
      email: {
        subscribers: parseInt(email.total_subscribers) || 0,
        openRate: parseFloat(email.avg_open_rate) || 0,
        clickRate: parseFloat(email.avg_click_rate) || 0,
        campaignsSent: parseInt(email.campaigns_sent) || 0
      },
      content: content,
      leads: {
        total: parseInt(leads.total_leads) || 0,
        qualified: parseInt(leads.qualified_leads) || 0,
        conversionRate: leads.total_leads > 0 ? 
          Math.round((leads.qualified_leads / leads.total_leads) * 100) : 0
      }
    };

    return res.status(200).json({ analytics });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}

async function recordAnalytics(req, res, client) {
  try {
    const { type, data } = req.body;

    switch (type) {
      case 'website':
        await client.query(`
          INSERT INTO website_analytics (date, page_views, unique_visitors, bounce_rate)
          VALUES (CURRENT_DATE, $1, $2, $3)
          ON CONFLICT (date) 
          DO UPDATE SET 
            page_views = website_analytics.page_views + EXCLUDED.page_views,
            unique_visitors = website_analytics.unique_visitors + EXCLUDED.unique_visitors,
            bounce_rate = EXCLUDED.bounce_rate
        `, [data.pageViews, data.uniqueVisitors, data.bounceRate]);
        break;

      case 'social':
        await client.query(`
          INSERT INTO social_media_metrics (platform, date, followers, engagement_rate, posts_count)
          VALUES ($1, CURRENT_DATE, $2, $3, $4)
          ON CONFLICT (platform, date)
          DO UPDATE SET 
            followers = EXCLUDED.followers,
            engagement_rate = EXCLUDED.engagement_rate,
            posts_count = EXCLUDED.posts_count
        `, [data.platform, data.followers, data.engagementRate, data.postsCount]);
        break;

      case 'content':
        await client.query(`
          UPDATE marketing_content 
          SET views = $1, clicks = $2, shares = $3, engagement = $4
          WHERE id = $5
        `, [data.views, data.clicks, data.shares, data.engagement, data.contentId]);
        break;
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error recording analytics:', error);
    return res.status(500).json({ error: 'Failed to record analytics' });
  }
}