const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // HTML content styled to match the website
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App Suite - Payment Terms & Conditions</title>
    <style>
        @page {
            margin: 1in 0.75in;
            @bottom-center {
                content: "Page " counter(page) " of " counter(pages);
                font-size: 10pt;
                color: #666;
            }
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: white;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        /* Header Styles */
        .header {
            text-align: center;
            margin-bottom: 50px;
            page-break-after: avoid;
        }
        
        .header h1 {
            font-size: 36px;
            color: #2563eb;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .header .subtitle {
            font-size: 18px;
            color: #64748b;
            margin-bottom: 20px;
        }
        
        .company-info {
            margin-top: 20px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 8px;
            font-size: 14px;
            color: #475569;
        }
        
        .badge-container {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
        }
        
        .badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .badge-primary {
            background: #e0e7ff;
            color: #4338ca;
        }
        
        .badge-secondary {
            background: #f1f5f9;
            color: #475569;
            border: 1px solid #e2e8f0;
        }
        
        /* Quick Summary Card */
        .summary-card {
            background: #eff6ff;
            border: 1px solid #dbeafe;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 40px;
            page-break-inside: avoid;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            text-align: center;
        }
        
        .summary-item .value {
            font-size: 32px;
            font-weight: 700;
            color: #2563eb;
            margin-bottom: 5px;
        }
        
        .summary-item .label {
            font-size: 14px;
            color: #64748b;
        }
        
        .summary-item .detail {
            font-size: 12px;
            color: #94a3b8;
            margin-top: 5px;
        }
        
        /* Section Styles */
        .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
        }
        
        .section h2 {
            font-size: 28px;
            color: #1e293b;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .section h3 {
            font-size: 20px;
            color: #334155;
            margin-top: 25px;
            margin-bottom: 15px;
        }
        
        /* Pricing Table */
        .pricing-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .pricing-table th {
            background: #f8fafc;
            padding: 15px;
            text-align: left;
            font-weight: 600;
            color: #1e293b;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .pricing-table td {
            padding: 15px;
            border-bottom: 1px solid #f1f5f9;
        }
        
        .pricing-table tr:last-child td {
            border-bottom: none;
        }
        
        .price {
            font-size: 20px;
            font-weight: 700;
            color: #2563eb;
        }
        
        /* List Styles */
        ul {
            list-style: none;
            padding-left: 0;
            margin: 15px 0;
        }
        
        ul li {
            position: relative;
            padding-left: 28px;
            margin-bottom: 10px;
            color: #475569;
        }
        
        ul li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #22c55e;
            font-weight: bold;
        }
        
        /* Card Styles */
        .card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 25px;
            margin: 20px 0;
            page-break-inside: avoid;
        }
        
        .card-title {
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 15px;
        }
        
        /* Alert Box */
        .alert {
            background: #fef3c7;
            border: 1px solid #fcd34d;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            page-break-inside: avoid;
        }
        
        .alert-title {
            font-weight: 600;
            color: #92400e;
            margin-bottom: 10px;
        }
        
        /* Footer */
        .footer {
            margin-top: 60px;
            padding-top: 30px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 14px;
        }
        
        .footer .contact {
            margin-top: 20px;
            font-weight: 600;
        }
        
        /* Utilities */
        .text-muted {
            color: #64748b;
        }
        
        .mt-4 { margin-top: 1rem; }
        .mb-4 { margin-bottom: 1rem; }
        .font-bold { font-weight: 700; }
        
        @media print {
            .container {
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Payment Terms & Conditions</h1>
            <p class="subtitle">Clear, transparent terms for App Suite custom software development services</p>
            <div class="badge-container">
                <span class="badge badge-secondary">Effective Date: June 1, 2025</span>
                <span class="badge badge-primary">Version 1.0</span>
            </div>
            <div class="company-info">
                <strong>App Suite by Jaydus Inc.</strong><br>
                Custom Business Applications at a Flat Rate<br>
                Contact: (302) 200-3330 | support@app-suite.io
            </div>
        </div>

        <!-- Quick Summary -->
        <div class="summary-card">
            <h2 style="text-align: center; margin-bottom: 25px; color: #1e293b;">Payment Summary</h2>
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="value">50%</div>
                    <div class="label">Upfront Payment</div>
                    <div class="detail">Due at contract signing</div>
                </div>
                <div class="summary-item">
                    <div class="value">30 Days</div>
                    <div class="label">Development Time</div>
                    <div class="detail">From payment to delivery</div>
                </div>
                <div class="summary-item">
                    <div class="value">50%</div>
                    <div class="label">Final Payment</div>
                    <div class="detail">Due on completion</div>
                </div>
            </div>
        </div>

        <!-- Service Pricing -->
        <div class="section">
            <h2>1. Service Pricing</h2>
            <p class="text-muted mb-4">App Suite offers transparent, flat-rate pricing for custom business applications. All prices are in USD.</p>
            
            <table class="pricing-table">
                <thead>
                    <tr>
                        <th>Package</th>
                        <th>Price</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Standard Application</strong></td>
                        <td class="price">$5,000</td>
                        <td>Core business applications with essential features. Perfect for streamlining single business processes.</td>
                    </tr>
                    <tr>
                        <td><strong>AI-Powered Solution</strong></td>
                        <td class="price">$7,500</td>
                        <td>Advanced applications with AI capabilities. Includes intelligent automation and predictive features.</td>
                    </tr>
                    <tr>
                        <td><strong>Enterprise Solution</strong></td>
                        <td class="price">$10,000</td>
                        <td>Complex systems with advanced integrations. Designed for organization-wide transformation.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Payment Schedules -->
        <div class="section">
            <h2>2. Payment Options</h2>
            
            <div class="card">
                <div class="card-title">Option 1: Split Payment (Most Popular)</div>
                <ul>
                    <li>50% upfront payment upon contract signing</li>
                    <li>50% final payment upon delivery and approval</li>
                    <li>Net 5 business days for each payment</li>
                    <li>Most flexible option for cash flow management</li>
                </ul>
            </div>
            
            <div class="card">
                <div class="card-title">Option 2: Full Payment (5% Discount)</div>
                <ul>
                    <li>100% payment upon contract signing</li>
                    <li>5% discount applied to total project cost</li>
                    <li>Net 5 business days</li>
                    <li>Best value option for prepared buyers</li>
                </ul>
            </div>
            
            <div class="card">
                <div class="card-title">Option 3: Three-Payment Plan (Enterprise Only)</div>
                <ul>
                    <li>33.33% upon contract signing</li>
                    <li>33.33% at development milestone (50% completion)</li>
                    <li>33.34% upon delivery and approval</li>
                    <li>Available for Enterprise packages only</li>
                </ul>
            </div>
        </div>

        <!-- What's Included -->
        <div class="section">
            <h2>3. What's Included</h2>
            <p class="text-muted mb-4">Every App Suite project includes:</p>
            
            <div class="card">
                <ul>
                    <li>Complete custom application built from scratch</li>
                    <li>Full source code ownership - it's yours forever</li>
                    <li>User documentation and training materials</li>
                    <li>30-day post-launch support and bug fixes</li>
                    <li>Deployment and hosting setup assistance</li>
                    <li>No licensing fees or recurring charges</li>
                    <li>Free minor updates during support period</li>
                    <li>Knowledge transfer sessions with your team</li>
                </ul>
            </div>
        </div>

        <!-- Payment Methods -->
        <div class="section">
            <h2>4. Accepted Payment Methods</h2>
            <ul>
                <li>ACH Bank Transfer (Preferred - no fees)</li>
                <li>Wire Transfer (domestic and international)</li>
                <li>Company Check (allow 5 days for clearing)</li>
                <li>Credit Card (3% processing fee applies)</li>
                <li>PayPal Business (3% processing fee applies)</li>
            </ul>
        </div>

        <!-- Terms and Conditions -->
        <div class="section">
            <h2>5. Terms and Conditions</h2>
            
            <h3>5.1 Project Timeline</h3>
            <ul>
                <li>Standard delivery: 30 business days from initial payment</li>
                <li>Timeline begins upon receipt of initial payment clearing</li>
                <li>Client delays or scope changes may extend timeline</li>
                <li>Weekly progress updates provided throughout development</li>
            </ul>
            
            <h3>5.2 Intellectual Property</h3>
            <ul>
                <li>Client owns all custom code upon final payment</li>
                <li>App Suite retains rights to reusable frameworks and components</li>
                <li>No ongoing licensing fees or usage restrictions</li>
                <li>Client receives unrestricted commercial usage rights</li>
            </ul>
            
            <h3>5.3 Support and Maintenance</h3>
            <ul>
                <li>30 days of complimentary support included</li>
                <li>Covers bug fixes and minor adjustments</li>
                <li>Extended support available at $150/hour</li>
                <li>Monthly maintenance plans available starting at $500/month</li>
            </ul>
        </div>

        <!-- Late Payment Terms -->
        <div class="section">
            <h2>6. Late Payment Policy</h2>
            <div class="alert">
                <div class="alert-title">Important Payment Information</div>
                <ul>
                    <li>Payments are due within 5 business days of invoice</li>
                    <li>Late payments subject to 1.5% monthly interest charge</li>
                    <li>Development work may be suspended for overdue accounts</li>
                    <li>Final code delivery requires all payments to be current</li>
                </ul>
            </div>
        </div>

        <!-- Refund Policy -->
        <div class="section">
            <h2>7. Refund Policy</h2>
            <ul>
                <li>Initial payment is non-refundable once development begins</li>
                <li>Final payment only due upon your approval of completed work</li>
                <li>Partial refunds considered for project cancellations before 25% completion</li>
                <li>All refund requests must be submitted in writing</li>
            </ul>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Questions about payment terms?</strong></p>
            <p class="contact">Contact us at (302) 200-3330 or support@app-suite.io</p>
            <p class="mt-4">© 2025 App Suite by Jaydus Inc. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;

    // Launch Puppeteer with Chromium
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    
    // Set content
    await page.setContent(htmlContent, { 
      waitUntil: 'networkidle0' 
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      displayHeaderFooter: false,
      margin: {
        top: '0.75in',
        right: '0.75in',
        bottom: '0.75in',
        left: '0.75in'
      }
    });

    await browser.close();

    // Return PDF as response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="App-Suite-Payment-Terms.pdf"',
        'Cache-Control': 'public, max-age=3600'
      },
      body: pdfBuffer.toString('base64'),
      isBase64Encoded: true
    };

  } catch (error) {
    console.error('Error generating PDF:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to generate PDF',
        details: error.message 
      })
    };
  }
};