const PDFDocument = require('pdfkit');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { analysis, branding } = JSON.parse(event.body);
    
    if (!analysis || !analysis.proposal) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Analysis data required' })
      };
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: 'LETTER',
      margins: {
        top: 72,
        bottom: 72,
        left: 72,
        right: 72
      },
      info: {
        Title: `Proposal for ${analysis.projectScope.clientName}`,
        Author: 'App Suite',
        Subject: 'Custom Application Development Proposal',
        Creator: 'App Suite AI'
      }
    });

    const chunks = [];
    doc.on('data', chunks.push.bind(chunks));

    // Define colors
    const colors = {
      primary: '#3b82f6',      // Blue
      secondary: '#8b5cf6',    // Purple
      success: '#10b981',      // Green
      warning: '#f59e0b',      // Amber
      danger: '#ef4444',       // Red
      text: '#1f2937',         // Gray-800
      textLight: '#6b7280',    // Gray-500
      background: '#f9fafb',   // Gray-50
      accent: '#ec4899'        // Pink
    };

    // Header with gradient effect
    doc.rect(0, 0, doc.page.width, 100)
       .fill(colors.primary);
    
    doc.rect(0, 100, doc.page.width, 20)
       .fillOpacity(0.1)
       .fill(colors.secondary);

    // App Suite Logo/Text
    doc.fillColor('white')
       .fontSize(28)
       .font('Helvetica-Bold')
       .text('App Suite', 72, 40);
    
    doc.fontSize(12)
       .font('Helvetica')
       .text('Custom Business Applications', 72, 70);

    // Reset position
    doc.y = 140;

    // Proposal Title
    doc.fillColor(colors.text)
       .fontSize(24)
       .font('Helvetica-Bold')
       .text('PROJECT PROPOSAL', { align: 'center' });
    
    doc.moveDown(0.5);
    doc.fontSize(18)
       .font('Helvetica')
       .fillColor(colors.primary)
       .text(`${analysis.projectScope.clientName} - ${analysis.projectScope.companyName}`, { align: 'center' });
    
    doc.moveDown();
    doc.fontSize(12)
       .fillColor(colors.textLight)
       .text(new Date().toLocaleDateString('en-US', { 
         weekday: 'long', 
         year: 'numeric', 
         month: 'long', 
         day: 'numeric' 
       }), { align: 'center' });

    // Package Badge
    const packageInfo = getPackageDetails(analysis.projectScope.recommendedPackage);
    doc.moveDown();
    
    const badgeWidth = 200;
    const badgeX = (doc.page.width - badgeWidth) / 2;
    
    doc.roundedRect(badgeX, doc.y, badgeWidth, 40, 20)
       .fillAndStroke(packageInfo.color, packageInfo.color);
    
    doc.fillColor('white')
       .fontSize(14)
       .font('Helvetica-Bold')
       .text(packageInfo.name, badgeX, doc.y + 8, {
         width: badgeWidth,
         align: 'center'
       });
    
    doc.fontSize(12)
       .text(`$${analysis.projectScope.price.toLocaleString()}`, badgeX, doc.y + 2, {
         width: badgeWidth,
         align: 'center'
       });

    doc.y += 60;

    // Executive Summary Section
    if (analysis.summary) {
      addSection(doc, 'EXECUTIVE SUMMARY', colors.primary);
      doc.fillColor(colors.text)
         .fontSize(12)
         .font('Helvetica')
         .text(analysis.summary, {
           align: 'justify',
           lineGap: 4
         });
      doc.moveDown();
    }

    // Key Points with icons
    if (analysis.keyPoints && analysis.keyPoints.length > 0) {
      addSection(doc, 'KEY DISCUSSION POINTS', colors.secondary);
      
      analysis.keyPoints.forEach(point => {
        // Bullet point with color
        doc.circle(doc.x + 6, doc.y + 6, 3)
           .fill(colors.success);
        
        doc.fillColor(colors.text)
           .fontSize(11)
           .text(point, doc.x + 20, doc.y, {
             width: doc.page.width - 144 - 20,
             align: 'left'
           });
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    // Pain Points Analysis
    if (analysis.painPoints && analysis.painPoints.length > 0) {
      addSection(doc, 'CHALLENGES IDENTIFIED', colors.danger);
      
      analysis.painPoints.forEach(pain => {
        // Pain point box
        doc.roundedRect(doc.x, doc.y, doc.page.width - 144, 60, 5)
           .fillOpacity(0.05)
           .fill(colors.danger)
           .fillOpacity(1);
        
        doc.fillColor(colors.danger)
           .fontSize(12)
           .font('Helvetica-Bold')
           .text(pain.issue, doc.x + 10, doc.y + 10);
        
        doc.fillColor(colors.text)
           .fontSize(10)
           .font('Helvetica')
           .text(`Impact: ${pain.impact}`, doc.x + 10, doc.y + 5);
        
        doc.fontSize(9)
           .fillColor(colors.textLight)
           .text(`Frequency: ${pain.frequency} | Urgency: ${pain.emotionalTone}`, doc.x + 10, doc.y + 3);
        
        doc.y += 15;
      });
      doc.moveDown();
    }

    // AI Opportunities
    if (analysis.aiOpportunities && analysis.aiOpportunities.length > 0) {
      addSection(doc, 'AI-POWERED SOLUTIONS', colors.accent);
      
      analysis.aiOpportunities.forEach(opp => {
        // AI opportunity card
        doc.roundedRect(doc.x, doc.y, doc.page.width - 144, 80, 5)
           .fillOpacity(0.05)
           .fill(colors.accent)
           .fillOpacity(1);
        
        // AI icon
        doc.fillColor(colors.accent)
           .fontSize(11)
           .font('Helvetica-Bold')
           .text('🤖 ' + opp.task, doc.x + 10, doc.y + 10);
        
        doc.fillColor(colors.text)
           .fontSize(10)
           .font('Helvetica')
           .text(`Current: ${opp.currentMethod}`, doc.x + 10, doc.y + 5);
        
        doc.fillColor(colors.success)
           .font('Helvetica-Bold')
           .text(`AI Solution: ${opp.aiSolution}`, doc.x + 10, doc.y + 5);
        
        // Time saved badge
        const savedX = doc.page.width - 144 - 100;
        doc.roundedRect(savedX, doc.y - 25, 90, 20, 10)
           .fill(colors.success);
        
        doc.fillColor('white')
           .fontSize(9)
           .text(opp.timeSaved, savedX + 5, doc.y - 20, {
             width: 80,
             align: 'center'
           });
        
        doc.y += 35;
      });
      doc.moveDown();
    }

    // Start new page for proposal
    doc.addPage();

    // Proposal content with proper formatting
    doc.fillColor(colors.text)
       .fontSize(12)
       .font('Helvetica');

    // Format the proposal text with proper paragraphs
    const proposalParagraphs = analysis.proposal.split('\n\n');
    
    proposalParagraphs.forEach(paragraph => {
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        // Bold headers
        doc.font('Helvetica-Bold')
           .fillColor(colors.primary)
           .text(paragraph.replace(/\*\*/g, ''), {
             align: 'left',
             lineGap: 4
           });
      } else if (paragraph.startsWith('- ')) {
        // Bullet points
        const lines = paragraph.split('\n');
        lines.forEach(line => {
          if (line.startsWith('- ')) {
            doc.circle(doc.x + 6, doc.y + 6, 2)
               .fill(colors.primary);
            
            doc.fillColor(colors.text)
               .font('Helvetica')
               .text(line.substring(2), doc.x + 15, doc.y, {
                 width: doc.page.width - 144 - 15
               });
            doc.moveDown(0.5);
          }
        });
      } else {
        // Regular paragraphs
        doc.font('Helvetica')
           .fillColor(colors.text)
           .text(paragraph, {
             align: 'justify',
             lineGap: 4
           });
      }
      doc.moveDown();
    });

    // Investment Summary Box
    if (doc.y > doc.page.height - 200) {
      doc.addPage();
    }

    const investmentY = doc.y;
    doc.roundedRect(72, investmentY, doc.page.width - 144, 120, 10)
       .fillOpacity(0.05)
       .fillAndStroke(colors.primary, colors.primary)
       .fillOpacity(1);

    doc.fillColor(colors.primary)
       .fontSize(16)
       .font('Helvetica-Bold')
       .text('INVESTMENT SUMMARY', 82, investmentY + 15);

    doc.fillColor(colors.text)
       .fontSize(14)
       .text(packageInfo.name, 82, investmentY + 45);

    doc.fontSize(24)
       .font('Helvetica-Bold')
       .fillColor(colors.success)
       .text(`$${analysis.projectScope.price.toLocaleString()}`, 82, investmentY + 70);

    doc.fontSize(11)
       .font('Helvetica')
       .fillColor(colors.textLight)
       .text('One-time payment • No monthly fees • You own it forever', 82, investmentY + 95);

    // Footer
    doc.fillColor(colors.textLight)
       .fontSize(9)
       .font('Helvetica')
       .text('App Suite • www.app-suite.io • Build Once, Use Forever', 72, doc.page.height - 50, {
         align: 'center',
         width: doc.page.width - 144
       });

    // Finalize PDF
    doc.end();

    // Wait for chunks to be collected
    const pdfBuffer = await new Promise((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${analysis.projectScope.clientName}-proposal.pdf"`
      },
      body: pdfBuffer.toString('base64'),
      isBase64Encoded: true
    };

  } catch (error) {
    console.error('PDF generation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate PDF', details: error.message })
    };
  }
};

function getPackageDetails(packageType) {
  const packages = {
    starter: {
      name: 'Starter Package',
      color: '#10b981' // Green
    },
    professional: {
      name: 'Professional Package',
      color: '#3b82f6' // Blue
    },
    enterprise: {
      name: 'Enterprise Package',
      color: '#8b5cf6' // Purple
    },
    custom: {
      name: 'Custom Enterprise',
      color: '#ec4899' // Pink
    }
  };
  
  return packages[packageType] || packages.professional;
}

function addSection(doc, title, color) {
  if (doc.y > doc.page.height - 150) {
    doc.addPage();
  }
  
  doc.fillColor(color)
     .fontSize(14)
     .font('Helvetica-Bold')
     .text(title);
  
  doc.moveTo(doc.x, doc.y)
     .lineTo(doc.x + 100, doc.y)
     .strokeColor(color)
     .lineWidth(2)
     .stroke();
  
  doc.moveDown();
}