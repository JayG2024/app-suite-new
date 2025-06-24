import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";

// Import white paper components
import HiddenCostGeoBlockingAiSearchVisibility from "./blog/HiddenCostGeoBlockingAiSearchVisibility";
import GenerativeEngineOptimizationGuide2025Full from "./blog/GenerativeEngineOptimizationGuide2025Full";
import MarkdownWhitepaper from "@/components/MarkdownWhitepaper";

// This would typically come from a CMS or API
const getBlogPost = (id: string) => {
  // Handle white papers as special cases
  if (id === "generative-engine-optimization-complete-guide-2025") {
    return "geo-whitepaper";
  }
  
  if (id === "hidden-cost-geo-blocking-ai-search-visibility") {
    return "whitepaper";
  }
  
  // Legacy redirect for old URL
  if (id === "website-accessibility-whitepaper") {
    return "redirect-whitepaper";
  }
  
  const posts = [
    {
      id: "google-business-profile-consolidation",
      title: "Strategic Consolidation of Google Business Profiles: Unifying Your Online Presence",
      date: "June 5, 2025",
      excerpt: "Master the complex process of merging Google Business Profiles while preserving valuable reviews. Complete strategic guide for business owners and digital marketers.",
      category: "Business Strategy",
      author: "Jason Gordon",
      readTime: "18 min read",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=1000",
      content: `
        <div class="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200 mb-8">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">🏢</span>
            </div>
            <div>
              <h3 class="font-semibold text-green-900">Local SEO Expertise</h3>
              <p class="text-green-700 text-sm">Strategic digital presence management for business growth</p>
            </div>
          </div>
          <p class="text-green-800">
            At App Suite, we understand that your Google Business Profile is a critical digital asset. This comprehensive guide demonstrates our expertise in local SEO optimization and strategic online presence management.
          </p>
        </div>

        <div class="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-8">
          <h3 class="font-semibold text-amber-900 mb-3">📋 Executive Summary</h3>
          <p class="text-amber-800 mb-4">
            Businesses often encounter complexities when managing their online presence, particularly with Google Business Profile (GBP) listings. A common challenge arises when a business has two distinct profiles: one unverified at an old address containing valuable customer reviews, and another verified at the correct current address but lacking those crucial testimonials.
          </p>
          <p class="text-amber-800">
            This strategic guide addresses this specific dilemma, outlining a methodical approach to consolidate these profiles while preserving all valuable customer reviews and enhancing local search visibility.
          </p>
        </div>

        <h2 class="text-2xl font-bold mt-12 mb-6 flex items-center gap-3">
          <span class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">🔍</span>
          Understanding Your Google Business Profile Challenge
        </h2>

        <p class="text-lg leading-relaxed mb-6">
          The scenario involves two distinct listings, each holding a piece of your business's digital identity. Understanding the precise nature of this Google Business Profile issue is the first step toward successful resolution.
        </p>

        <div class="grid md:grid-cols-2 gap-6 mb-8">
          <div class="p-6 bg-red-50 rounded-lg border border-red-200">
            <h4 class="font-semibold text-red-900 mb-3">❌ Old Profile Issues</h4>
            <ul class="space-y-2 text-red-800 text-sm">
              <li>• Unverified status</li>
              <li>• Contains valuable reviews</li>
              <li>• Outdated address information</li>
              <li>• Risk of deletion by Google</li>
            </ul>
          </div>
          <div class="p-6 bg-green-50 rounded-lg border border-green-200">
            <h4 class="font-semibold text-green-900 mb-3">✅ New Profile Assets</h4>
            <ul class="space-y-2 text-green-800 text-sm">
              <li>• Verified ownership</li>
              <li>• Correct current address</li>
              <li>• Updated photos and information</li>
              <li>• Missing historical reviews</li>
            </ul>
          </div>
        </div>

        <div class="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
          <h4 class="font-semibold text-blue-900 mb-2">🎯 Critical Distinction</h4>
          <p class="text-blue-800 mb-3">
            <strong>Google's policies differentiate significantly between:</strong>
          </p>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="p-3 bg-white rounded border">
              <h5 class="font-medium text-blue-900">Location Changes</h5>
              <p class="text-blue-700 text-sm">Updating address on existing profile (Google's preferred method)</p>
            </div>
            <div class="p-3 bg-white rounded border">
              <h5 class="font-medium text-blue-900">Merging Duplicates</h5>
              <p class="text-blue-700 text-sm">Only for genuine duplicates at same physical location</p>
            </div>
          </div>
        </div>

        <h2 class="text-2xl font-bold mt-12 mb-6 flex items-center gap-3">
          <span class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">📋</span>
          Strategic Consolidation Process
        </h2>

        <div class="space-y-8 mb-12">
          <div class="border-l-4 border-primary pl-6">
            <h3 class="text-xl font-semibold mb-4 text-primary">Step 1: Initial Assessment & Documentation</h3>
            <div class="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 class="font-medium mb-2">Essential Information to Gather:</h4>
              <ul class="space-y-1 text-sm text-muted-foreground">
                <li>• Complete URLs for both profiles</li>
                <li>• Google Business Profile IDs</li>
                <li>• Verification status of each listing</li>
                <li>• Review count and content screenshots</li>
                <li>• Business name, category, and phone consistency</li>
              </ul>
            </div>
          </div>

          <div class="border-l-4 border-green-500 pl-6">
            <h3 class="text-xl font-semibold mb-4 text-green-700">Step 2: Claim & Verify the Review-Rich Profile</h3>
            <p class="text-muted-foreground mb-4">
              The unverified status represents a significant vulnerability. Without established ownership, editing information or initiating review transfers becomes impossible.
            </p>
            <div class="bg-green-50 p-4 rounded-lg">
              <h4 class="font-medium text-green-900 mb-2">Verification Methods:</h4>
              <ul class="space-y-1 text-green-800 text-sm">
                <li>• Postcard verification (most common)</li>
                <li>• Phone call verification</li>
                <li>• SMS verification</li>
                <li>• Video verification (for specific cases)</li>
              </ul>
            </div>
          </div>

          <div class="border-l-4 border-blue-500 pl-6">
            <h3 class="text-xl font-semibold mb-4 text-blue-700">Step 3: Update Address on Review-Rich Profile</h3>
            <p class="text-muted-foreground mb-4">
              Once ownership is established, update the address to match your current location. This aligns with Google's recommended procedure for businesses that have moved.
            </p>
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-blue-800 text-sm">
                <strong>Key Insight:</strong> Google's systems are designed to automatically transfer reviews when a business's address is updated on an existing profile.
              </p>
            </div>
          </div>
        </div>

        <h2 class="text-2xl font-bold mt-12 mb-6 flex items-center gap-3">
          <span class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">⚠️</span>
          Navigating Common Challenges
        </h2>

        <div class="space-y-6 mb-8">
          <div class="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 class="font-semibold text-yellow-900 mb-3">Challenge: Reviews Not Transferring Automatically</h4>
            <p class="text-yellow-800 mb-3">If reviews don't transfer after address updates, direct engagement with Google Business Profile Support becomes necessary.</p>
            <div class="bg-white p-4 rounded border">
              <h5 class="font-medium mb-2">When to Contact Support:</h5>
              <ul class="space-y-1 text-sm">
                <li>• Reviews fail to transfer after 30 days</li>
                <li>• Two profiles persist at same address</li>
                <li>• New profile was accidentally created instead of updating existing one</li>
              </ul>
            </div>
          </div>

          <div class="p-6 bg-red-50 rounded-lg border border-red-200">
            <h4 class="font-semibold text-red-900 mb-3">Challenge: Google Refuses to Merge Due to Address Discrepancy</h4>
            <p class="text-red-800 mb-3">Google strictly requires profiles to represent the same business at the same physical location for merging.</p>
            <div class="bg-white p-4 rounded border">
              <h5 class="font-medium mb-2">Alternative Solutions:</h5>
              <ul class="space-y-1 text-sm">
                <li>• Report old profile as "moved" via Google Maps</li>
                <li>• Use address update strategy first</li>
                <li>• Remove old profile only after confirming data transfer</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 class="text-2xl font-bold mt-12 mb-6 flex items-center gap-3">
          <span class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">📈</span>
          The Business Impact of Profile Consolidation
        </h2>

        <div class="grid md:grid-cols-3 gap-6 mb-8">
          <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h4 class="font-semibold mb-3 text-green-700">🎯 Enhanced Local SEO</h4>
            <ul class="space-y-2 text-sm">
              <li>• Higher search rankings</li>
              <li>• Increased Local Pack visibility</li>
              <li>• Stronger digital authority</li>
              <li>• Improved algorithm recognition</li>
            </ul>
          </div>
          
          <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h4 class="font-semibold mb-3 text-blue-700">🤝 Better Customer Experience</h4>
            <ul class="space-y-2 text-sm">
              <li>• Eliminates confusion</li>
              <li>• Consolidated review credibility</li>
              <li>• Clear contact information</li>
              <li>• Stronger social proof</li>
            </ul>
          </div>
          
          <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h4 class="font-semibold mb-3 text-purple-700">⚡ Operational Efficiency</h4>
            <ul class="space-y-2 text-sm">
              <li>• Single profile management</li>
              <li>• Unified performance metrics</li>
              <li>• Streamlined review responses</li>
              <li>• Focused optimization efforts</li>
            </ul>
          </div>
        </div>

        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg border border-blue-200 mb-8">
          <h3 class="text-xl font-bold mb-4">📊 Information Checklist for Google Support</h3>
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium mb-3">Required Information:</h4>
              <ul class="space-y-2 text-sm">
                <li>✓ Primary profile URL and ID</li>
                <li>✓ Duplicate profile URL and ID</li>
                <li>✓ Business name and category</li>
                <li>✓ Current address and phone</li>
              </ul>
            </div>
            <div>
              <h4 class="font-medium mb-3">Supporting Documents:</h4>
              <ul class="space-y-2 text-sm">
                <li>✓ Utility bills or business license</li>
                <li>✓ Screenshots of both profiles</li>
                <li>✓ Review reply backups</li>
                <li>✓ Clear explanation of desired outcome</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 class="text-2xl font-bold mt-12 mb-6 flex items-center gap-3">
          <span class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">🎯</span>
          Best Practices for Prevention
        </h2>

        <div class="space-y-4 mb-8">
          <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <span class="text-2xl">📍</span>
            <div>
              <h4 class="font-semibold">Always Update Existing Profiles</h4>
              <p class="text-sm text-muted-foreground">When moving locations, update the address on your existing Google Business Profile rather than creating a new one.</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <span class="text-2xl">🔔</span>
            <div>
              <h4 class="font-semibold">Monitor Your Online Presence</h4>
              <p class="text-sm text-muted-foreground">Regularly search for your business on Google to identify any unauthorized or duplicate listings.</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <span class="text-2xl">💾</span>
            <div>
              <h4 class="font-semibold">Backup Review Responses</h4>
              <p class="text-sm text-muted-foreground">Document all review responses before initiating any profile changes, as these may be lost during consolidation.</p>
            </div>
          </div>
        </div>

        <div class="bg-primary/5 p-8 rounded-lg border border-primary/20 mb-8">
          <h3 class="text-xl font-bold mb-4">Why This Expertise Matters for Your Business</h3>
          <p class="text-muted-foreground mb-6">
            Effective Google Business Profile management is crucial for local SEO success. When we develop your custom software solutions, we ensure they integrate seamlessly with your digital marketing ecosystem, including optimized local search presence.
          </p>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="flex items-center gap-3">
              <span class="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm">✓</span>
              <span class="text-sm">Strategic local SEO optimization</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm">✓</span>
              <span class="text-sm">Integrated digital presence management</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm">✓</span>
              <span class="text-sm">Review and reputation systems</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm">✓</span>
              <span class="text-sm">Automated reporting and monitoring</span>
            </div>
          </div>
        </div>

        <h2 class="text-2xl font-bold mt-12 mb-6">Strategic Conclusion</h2>

        <p class="mb-6">
          Successfully consolidating Google Business Profiles requires understanding Google's specific policies, following a strategic approach, and maintaining persistent follow-up. The process is primarily about proper location change management rather than simple profile merging.
        </p>

        <p class="mb-8">
          By following this comprehensive guide, businesses can preserve their valuable customer reviews while establishing a unified, authoritative online presence that drives local search success and customer trust.
        </p>

        <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <p class="text-sm text-muted-foreground mb-2">
            <strong>Expert Insight:</strong> This guide represents the type of strategic digital presence management we bring to every custom software project, ensuring your business systems work in harmony with your marketing and customer engagement goals.
          </p>
          <p class="text-sm text-muted-foreground">
            <strong>Next in Series:</strong> Advanced Local SEO automation strategies for multi-location businesses
          </p>
        </div>
      `,
      schema: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "Strategic Consolidation of Google Business Profiles: Unifying Your Online Presence",
        "description": "Master the complex process of merging Google Business Profiles while preserving valuable reviews. Complete strategic guide for business owners and digital marketers.",
        "author": {
          "@type": "Person",
          "name": "Jason Gordon",
          "jobTitle": "CEO & Lead Developer",
          "worksFor": {
            "@type": "Organization",
            "name": "App Suite"
          }
        },
        "publisher": {
          "@type": "Organization",
          "name": "App Suite",
          "logo": {
            "@type": "ImageObject",
            "url": "https://app-suite.io/logo.png"
          }
        },
        "datePublished": "2025-06-05",
        "dateModified": "2025-06-05",
        "image": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://app-suite.io/blog/google-business-profile-consolidation"
        },
        "keywords": "Google Business Profile, local SEO, business listing management, review consolidation, Google My Business, duplicate listings, local search optimization, business profile merge",
        "about": [
          {
            "@type": "Thing",
            "name": "Google Business Profile Management"
          },
          {
            "@type": "Thing", 
            "name": "Local SEO Strategy"
          },
          {
            "@type": "Thing",
            "name": "Online Reputation Management"
          }
        ],
        "mentions": [
          {
            "@type": "SoftwareApplication",
            "name": "Google Business Profile",
            "applicationCategory": "Business Management Software"
          }
        ],
        "articleSection": "Business Strategy",
        "wordCount": "2800",
        "timeRequired": "PT18M",
        "audience": {
          "@type": "Audience",
          "audienceType": "Business Owners, Digital Marketers, Local SEO Specialists"
        }
      }
    },
    {
      id: "openai-models-guide",
      title: "Making Sense of OpenAI Models – The Complete Guide (May 30, 2025)",
      date: "May 30, 2025",
      excerpt: "Navigate OpenAI's complete model ecosystem with our comprehensive guide covering performance comparisons, selection strategies, and real-world applications.",
      category: "AI Development",
      author: "Jason Gordon",
      readTime: "12 min read", 
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000",
      content: `
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 mb-8">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">🤖</span>
            </div>
            <div>
              <h3 class="font-semibold text-blue-900">AI Model Expertise</h3>
              <p class="text-blue-700 text-sm">Deep technical knowledge for better business decisions</p>
            </div>
          </div>
          <p class="text-blue-800">
            At App Suite, we don't just use AI—we architect intelligent systems. This guide demonstrates the depth of AI expertise we bring to every custom software project.
          </p>
        </div>

        <p class="text-lg leading-relaxed mb-6">
          OpenAI's model ecosystem has evolved dramatically over the past few years, creating a rich but potentially confusing landscape of AI capabilities. This comprehensive guide helps you navigate OpenAI's current lineup as of May 30, 2025, providing release timelines, performance comparisons, and practical selection advice.
        </p>

        <h2 class="text-2xl font-bold mt-12 mb-6 flex items-center gap-3">
          <span class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">🚀</span>
          Why Are There So Many OpenAI Models?
        </h2>

        <div class="bg-gray-50 p-6 rounded-lg border-l-4 border-primary mb-6">
          <p class="font-medium mb-3">Think of OpenAI's model strategy like a toolbox rather than a single multi-tool.</p>
          <p class="text-muted-foreground">
            Just as you wouldn't use a hammer for every home repair job, different AI tasks require specialized approaches.
          </p>
        </div>

        <p class="mb-4">OpenAI has evolved from its earlier approach (where GPT-3.5 and GPT-4 were expected to handle nearly everything) to a more nuanced ecosystem with:</p>

        <div class="grid md:grid-cols-2 gap-4 mb-8">
          <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 class="font-semibold text-blue-900 mb-2">🧠 Reasoning Specialists</h4>
            <p class="text-blue-800 text-sm">(o-series) for complex problem-solving</p>
          </div>
          <div class="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 class="font-semibold text-green-900 mb-2">💬 Chat Generalists</h4>
            <p class="text-green-800 text-sm">(GPT series) for versatile applications</p>
          </div>
          <div class="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 class="font-semibold text-purple-900 mb-2">⚡ Efficiency-Focused</h4>
            <p class="text-purple-800 text-sm">For routine but high-volume tasks</p>
          </div>
          <div class="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h4 class="font-semibold text-orange-900 mb-2">🎨 Domain Experts</h4>
            <p class="text-orange-800 text-sm">For images, speech, and specialized functions</p>
          </div>
        </div>

        <h2 class="text-2xl font-bold mt-12 mb-6 flex items-center gap-3">
          <span class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">📅</span>
          The OpenAI Model Timeline
        </h2>

        <div class="space-y-6 mb-8">
          <div class="border-l-4 border-blue-500 pl-6">
            <h3 class="text-xl font-semibold mb-3 text-blue-700">2022-2023: Foundation Era</h3>
            <ul class="space-y-2 text-muted-foreground">
              <li><strong>GPT-3.5 Turbo</strong> (Nov 2022): The workhorse model that powered early ChatGPT</li>
              <li><strong>GPT-4</strong> (March 2023): Major leap in reasoning capabilities</li>
              <li><strong>DALL·E 2</strong> → <strong>DALL·E 3</strong>: Progressive image generation improvements</li>
              <li><strong>Whisper</strong> (Sept 2022): Established speech recognition capabilities</li>
            </ul>
          </div>

          <div class="border-l-4 border-green-500 pl-6">
            <h3 class="text-xl font-semibold mb-3 text-green-700">2024: Diversification Phase</h3>
            <ul class="space-y-2 text-muted-foreground">
              <li><strong>GPT-4o</strong> (May 2024): Speed/performance optimizations</li>
              <li><strong>o1 & o1-mini</strong> (July 2024): First dedicated reasoning models</li>
              <li><strong>TTS-1 & TTS-1 HD</strong> (Aug 2024): Specialized text-to-speech</li>
              <li><strong>text-embedding-3</strong> (April 2024): Enhanced vector representations</li>
            </ul>
          </div>

          <div class="border-l-4 border-purple-500 pl-6">
            <h3 class="text-xl font-semibold mb-3 text-purple-700">2025: Specialization Era</h3>
            <ul class="space-y-2 text-muted-foreground">
              <li><strong>o3 & o3-mini</strong> (Jan 2025): Major reasoning advancement</li>
              <li><strong>GPT-4.1</strong> (March 2025): Latest flagship general model</li>
              <li><strong>GPT-4.1 mini & nano</strong> (April 2025): Efficiency variants</li>
              <li><strong>o4-mini</strong> (May 2025): Balanced reasoning performance</li>
              <li><strong>GPT Image 1</strong> (Feb 2025): State-of-the-art image generation</li>
            </ul>
          </div>
        </div>

        <h2 class="text-2xl font-bold mt-12 mb-6 flex items-center gap-3">
          <span class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">📊</span>
          Performance Deep Dive
        </h2>

        <div class="overflow-x-auto mb-8">
          <table class="w-full border-collapse bg-white rounded-lg shadow-sm overflow-hidden">
            <thead class="bg-gray-50">
              <tr>
                <th class="border border-gray-200 p-3 text-left font-semibold">Model</th>
                <th class="border border-gray-200 p-3 text-left font-semibold">Complex Math</th>
                <th class="border border-gray-200 p-3 text-left font-semibold">Multi-step Planning</th>
                <th class="border border-gray-200 p-3 text-left font-semibold">Compute Requirements</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-200 p-3 font-medium">o3</td>
                <td class="border border-gray-200 p-3"><span class="bg-green-100 text-green-800 px-2 py-1 rounded">92% accuracy</span></td>
                <td class="border border-gray-200 p-3"><span class="bg-green-100 text-green-800 px-2 py-1 rounded">Excellent (10+ steps)</span></td>
                <td class="border border-gray-200 p-3"><span class="bg-red-100 text-red-800 px-2 py-1 rounded">100% (baseline)</span></td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-200 p-3 font-medium">o4-mini</td>
                <td class="border border-gray-200 p-3"><span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">85% accuracy</span></td>
                <td class="border border-gray-200 p-3"><span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">Very Good (7-8 steps)</span></td>
                <td class="border border-gray-200 p-3"><span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">60%</span></td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="border border-gray-200 p-3 font-medium">GPT-4.1</td>
                <td class="border border-gray-200 p-3"><span class="bg-green-100 text-green-800 px-2 py-1 rounded">88% accuracy</span></td>
                <td class="border border-gray-200 p-3"><span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">Very Good (8-9 steps)</span></td>
                <td class="border border-gray-200 p-3"><span class="bg-red-100 text-red-800 px-2 py-1 rounded">95%</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
          <h4 class="font-semibold text-blue-900 mb-2">💡 Real-world Impact</h4>
          <p class="text-blue-800">
            For financial modeling or complex scientific tasks, the difference between o3 and o3-mini might mean the difference between successfully analyzing a multi-variable problem and getting an incomplete solution.
          </p>
        </div>

        <h2 class="text-2xl font-bold mt-12 mb-6 flex items-center gap-3">
          <span class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">🎯</span>
          Choosing the Right Model
        </h2>

        <div class="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200 mb-8">
          <h3 class="font-semibold text-gray-900 mb-4">Decision Tree Approach:</h3>
          
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <div>
                <p class="font-medium">Complex reasoning or problem-solving?</p>
                <p class="text-sm text-muted-foreground">→ Use <strong>o3</strong> (premium) or <strong>o4-mini</strong> (balanced)</p>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <div>
                <p class="font-medium">General content or conversation?</p>
                <p class="text-sm text-muted-foreground">→ Use <strong>GPT-4.1</strong> (quality) or <strong>GPT-4.1 mini</strong> (efficiency)</p>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              <div>
                <p class="font-medium">Media generation?</p>
                <p class="text-sm text-muted-foreground">→ Use <strong>GPT Image 1</strong> (premium) or <strong>DALL·E 3</strong> (standard)</p>
              </div>
            </div>
          </div>
        </div>

        <h2 class="text-2xl font-bold mt-12 mb-6 flex items-center gap-3">
          <span class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">💼</span>
          Business Applications
        </h2>

        <div class="grid md:grid-cols-3 gap-6 mb-8">
          <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h4 class="font-semibold mb-3 text-green-700">Budget-Conscious</h4>
            <ul class="space-y-2 text-sm">
              <li><strong>Customer Support:</strong> GPT-4.1 nano</li>
              <li><strong>Content Marketing:</strong> GPT-4o mini</li>
              <li><strong>Data Analysis:</strong> o3-mini</li>
            </ul>
          </div>
          
          <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h4 class="font-semibold mb-3 text-blue-700">Balanced Approach</h4>
            <ul class="space-y-2 text-sm">
              <li><strong>Customer Support:</strong> GPT-4o</li>
              <li><strong>Content Marketing:</strong> GPT-4.1 mini</li>
              <li><strong>Data Analysis:</strong> o4-mini</li>
            </ul>
          </div>
          
          <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h4 class="font-semibold mb-3 text-purple-700">Performance-Focused</h4>
            <ul class="space-y-2 text-sm">
              <li><strong>Customer Support:</strong> GPT-4.1</li>
              <li><strong>Content Marketing:</strong> GPT-4.1</li>
              <li><strong>Data Analysis:</strong> o3</li>
            </ul>
          </div>
        </div>

        <div class="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mb-8">
          <h4 class="font-semibold text-yellow-900 mb-2">🚀 Strategic Approach</h4>
          <p class="text-yellow-800">
            Many organizations adopt a tiered strategy, using performance-focused models for high-value, customer-facing content while deploying budget-conscious options for internal or draft work.
          </p>
        </div>

        <h2 class="text-2xl font-bold mt-12 mb-6 flex items-center gap-3">
          <span class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">🔮</span>
          The Future Landscape
        </h2>

        <p class="mb-6">Based on current patterns, we anticipate these developments:</p>

        <div class="space-y-4 mb-8">
          <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <span class="text-2xl">📈</span>
            <div>
              <h4 class="font-semibold">GPT-4.2 (Expected Q3 2025)</h4>
              <p class="text-sm text-muted-foreground">Enhanced contextual understanding and knowledge depth</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <span class="text-2xl">🧠</span>
            <div>
              <h4 class="font-semibold">o5 (Expected Q4 2025)</h4>
              <p class="text-sm text-muted-foreground">Next major reasoning model with significant problem-solving improvements</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <span class="text-2xl">🔗</span>
            <div>
              <h4 class="font-semibold">Cross-modal Integration</h4>
              <p class="text-sm text-muted-foreground">Unification of text, image, audio, and potentially video capabilities</p>
            </div>
          </div>
        </div>

        <div class="bg-primary/5 p-8 rounded-lg border border-primary/20 mb-8">
          <h3 class="text-xl font-bold mb-4">Why This Expertise Matters for Your Business</h3>
          <p class="text-muted-foreground mb-6">
            Understanding AI models isn't just academic—it's strategic. When we build your custom software, we select and combine the right AI capabilities for maximum impact and efficiency.
          </p>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="flex items-center gap-3">
              <span class="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm">✓</span>
              <span class="text-sm">Right model for each specific task</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm">✓</span>
              <span class="text-sm">Optimized cost and performance</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm">✓</span>
              <span class="text-sm">Future-proof AI architecture</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm">✓</span>
              <span class="text-sm">Strategic competitive advantage</span>
            </div>
          </div>
        </div>

        <h2 class="text-2xl font-bold mt-12 mb-6">Conclusion</h2>

        <p class="mb-6">
          OpenAI's model lineup has evolved from a few general-purpose tools to a sophisticated ecosystem of specialized capabilities. As of May 30, 2025, the key to success lies not in simply choosing the "best" model, but in strategically selecting and combining the right tools for each specific need.
        </p>

        <p class="mb-8">
          By understanding the timeline, performance characteristics, and practical applications of each model, you can make informed decisions that balance capability, efficiency, and cost—ultimately delivering more effective AI solutions.
        </p>

        <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <p class="text-sm text-muted-foreground mb-2">
            <strong>Update Schedule:</strong> This guide will be updated every three weeks to reflect new releases, performance improvements, and evolving best practices in the rapidly changing landscape of AI capabilities.
          </p>
          <p class="text-sm text-muted-foreground">
            <strong>Next Update:</strong> June 20, 2025
          </p>
        </div>
      `,
      schema: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "Making Sense of OpenAI Models – The Complete Guide (May 30, 2025)",
        "description": "Navigate OpenAI's complete model ecosystem with our comprehensive guide covering performance comparisons, selection strategies, and real-world applications.",
        "author": {
          "@type": "Person",
          "name": "Jason Gordon"
        },
        "publisher": {
          "@type": "Organization",
          "name": "App Suite",
          "logo": {
            "@type": "ImageObject", 
            "url": "https://app-suite.io/logo.png"
          }
        },
        "datePublished": "2025-05-30",
        "dateModified": "2025-05-30",
        "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://app-suite.io/blog/openai-models-complete-guide"
        },
        "keywords": "OpenAI, GPT-4, AI models, machine learning, artificial intelligence, business AI, custom software development"
      }
    }
  ];
  
  return posts.find(post => post.id === id);
};

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = getBlogPost(id || '');

  // Handle white papers as special cases
  if (post === "geo-whitepaper") {
    return <GenerativeEngineOptimizationGuide2025Full />;
  }
  
  if (post === "whitepaper") {
    return <HiddenCostGeoBlockingAiSearchVisibility />;
  }
  
  // Handle legacy redirect for old white paper URL
  if (post === "redirect-whitepaper") {
    window.location.replace('/blog/hidden-cost-geo-blocking-ai-search-visibility');
    return null;
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
        <Button onClick={() => navigate('/blog')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Button>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={post.title}
        description={post.excerpt}
        image={post.image}
        structuredData={post.schema}
      />
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(post.schema) }}
      />
      
      <article className="bg-background">
        {/* Header */}
        <div className="bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 py-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/blog')}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
            
            <div className="max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-4">
                <Tag className="h-3 w-3 mr-1" />
                {post.category}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="container mx-auto px-4 mb-12">
          <div className="max-w-4xl mx-auto">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-3xl mx-auto">
            <div 
              className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-foreground
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:text-muted-foreground prose-li:text-muted-foreground
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* CTA Section */}
            <div className="mt-16 p-8 bg-primary/5 rounded-lg border border-primary/20 text-center">
              <h3 className="text-xl font-bold mb-4">Ready to Build Your Custom Solution?</h3>
              <p className="text-muted-foreground mb-6">
                Let's discuss how AI-powered custom development can eliminate your monthly software costs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to="/roi-calculator">Calculate Your ROI</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/contact">Schedule Discovery Call</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPost;