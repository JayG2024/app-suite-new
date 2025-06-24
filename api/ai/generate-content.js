import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, data, userId } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ 
      error: 'AI service not configured',
      message: 'Please add OPENAI_API_KEY to your environment variables'
    });
  }

  try {
    let result;

    switch (action) {
      case 'weekly-report':
        result = await generateWeeklyReport(data);
        break;
      
      case 'email-campaign':
        result = await createEmailCampaign(data);
        break;
      
      case 'proposal':
        result = await generateProposal(data);
        break;
      
      case 'competitor-analysis':
        result = await analyzeCompetitors(data);
        break;
      
      case 'social-media':
        result = await draftSocialMedia(data);
        break;
      
      case 'conversion-optimization':
        result = await optimizeConversion(data);
        break;
      
      case 'blog-post':
        result = await generateBlogPost(data);
        break;
      
      case 'newsletter':
        result = await generateNewsletter(data);
        break;

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    // Log the AI generation activity
    const { db } = await import('@/lib/db');
    await db.query(
      `INSERT INTO admin_activities (user_id, action, details, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [userId || 1, `ai_content_${action}`, { prompt: data, result: result.substring(0, 100) }]
    );

    return res.status(200).json({ success: true, content: result });
  } catch (error) {
    console.error('AI generation error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate content', 
      details: error.message 
    });
  }
}

async function generateWeeklyReport(data) {
  const { projectData, startDate, endDate } = data;
  
  const prompt = `Generate a professional weekly client report for App Suite based on the following project data:
  
  Projects: ${JSON.stringify(projectData)}
  Period: ${startDate} to ${endDate}
  
  Include:
  1. Executive Summary
  2. Project Progress Overview
  3. Completed Milestones
  4. Upcoming Tasks
  5. Key Metrics
  6. Recommendations
  
  Format in HTML with professional styling.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 2000,
  });

  return completion.choices[0].message.content;
}

async function createEmailCampaign(data) {
  const { campaignType, targetAudience, product, goals } = data;
  
  const prompt = `Create an email marketing campaign for App Suite:
  
  Campaign Type: ${campaignType}
  Target Audience: ${targetAudience}
  Product/Service: ${product}
  Goals: ${goals}
  
  Generate:
  1. Campaign strategy
  2. Email sequence (3-5 emails)
  3. Subject lines
  4. Email body content
  5. Call-to-action suggestions
  
  Make it compelling and conversion-focused.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    max_tokens: 2500,
  });

  return completion.choices[0].message.content;
}

async function generateProposal(data) {
  const { clientName, projectType, requirements, budget, timeline } = data;
  
  const prompt = `Generate a custom software development proposal for App Suite:
  
  Client: ${clientName}
  Project Type: ${projectType}
  Requirements: ${requirements}
  Budget Range: ${budget}
  Timeline: ${timeline}
  
  Include:
  1. Executive Summary
  2. Project Understanding
  3. Proposed Solution
  4. Technical Approach
  5. Timeline & Milestones
  6. Investment Options
  7. Why Choose App Suite
  
  Use App Suite's flat-rate pricing model and emphasize ownership benefits.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 3000,
  });

  return completion.choices[0].message.content;
}

async function analyzeCompetitors(data) {
  const { competitors, focusAreas } = data;
  
  const prompt = `Analyze competitors for App Suite:
  
  Competitors: ${competitors.join(', ')}
  Focus Areas: ${focusAreas.join(', ')}
  
  Provide:
  1. Competitor strengths and weaknesses
  2. Market positioning analysis
  3. Pricing comparison
  4. Feature comparison
  5. Opportunities for differentiation
  6. Recommended strategies
  
  Focus on how App Suite's flat-rate custom development model differs from SaaS competitors.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 2000,
  });

  return completion.choices[0].message.content;
}

async function draftSocialMedia(data) {
  const { platform, topic, tone, includeHashtags } = data;
  
  const prompt = `Create social media content for App Suite:
  
  Platform: ${platform}
  Topic: ${topic}
  Tone: ${tone}
  Include Hashtags: ${includeHashtags}
  
  Generate 5 different posts that:
  1. Highlight App Suite's unique value proposition
  2. Engage the target audience
  3. Include relevant CTAs
  4. Are optimized for ${platform}
  
  Focus on benefits of owning custom software vs renting SaaS.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.9,
    max_tokens: 1500,
  });

  return completion.choices[0].message.content;
}

async function optimizeConversion(data) {
  const { pageType, currentConversion, targetConversion, issues } = data;
  
  const prompt = `Provide conversion optimization recommendations for App Suite:
  
  Page Type: ${pageType}
  Current Conversion Rate: ${currentConversion}%
  Target Conversion Rate: ${targetConversion}%
  Known Issues: ${issues}
  
  Provide:
  1. Specific page optimization recommendations
  2. A/B test suggestions
  3. Copy improvements
  4. UX/UI enhancements
  5. Trust signals to add
  6. Implementation priority
  
  Focus on converting visitors interested in custom software development.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 2000,
  });

  return completion.choices[0].message.content;
}

async function generateBlogPost(data) {
  const { topic, keywords, targetLength } = data;
  
  const prompt = `Write a blog post for App Suite:
  
  Topic: ${topic}
  Keywords: ${keywords.join(', ')}
  Target Length: ${targetLength} words
  
  Create an engaging, SEO-optimized blog post that:
  1. Addresses pain points of businesses using expensive SaaS
  2. Highlights benefits of custom software ownership
  3. Includes real-world examples
  4. Has a compelling intro and conclusion
  5. Includes a clear CTA for App Suite's services
  
  Format with HTML including h2, h3 tags, lists, and emphasis where appropriate.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    max_tokens: 3000,
  });

  return completion.choices[0].message.content;
}

async function generateNewsletter(data) {
  const { theme, highlights, targetAudience } = data;
  
  const prompt = `Create a newsletter for App Suite:
  
  Theme: ${theme}
  Highlights: ${highlights.join(', ')}
  Target Audience: ${targetAudience}
  
  Generate:
  1. Compelling subject line
  2. Preview text
  3. Header section
  4. 3-4 content sections
  5. Client success story
  6. Tips/insights section
  7. Strong CTA
  
  Make it valuable, engaging, and focused on the benefits of custom software ownership.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    max_tokens: 2000,
  });

  return completion.choices[0].message.content;
}