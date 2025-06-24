import { ArrowLeft, Download, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { toast } from "sonner";

const GeoBlockingImpact = () => {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "The Hidden Cost of Geo-Blocking - Infographic",
          text: "95% of AI crawlers are blocked by geographic restrictions. See the visual summary of our research.",
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleDownloadImage = () => {
    // In a real implementation, this would download a high-res PNG/JPG
    toast.info("High-resolution image download coming soon!");
  };

  return (
    <>
      <SEO 
        title="Geo-Blocking Impact on AI Search - Infographic"
        description="Visual summary of research showing how geographic restrictions affect AI crawler access and search visibility."
        keywords="geo-blocking infographic, AI search visibility, website accessibility, GEO"
        author="Jason Gordon"
        type="article"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <Link to="/resources" className="inline-flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Resources
              </Link>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadImage}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Infographic */}
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <iframe 
              srcDoc={`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Hidden Cost of Geo-Blocking: White Paper</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            color: #333;
        }
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    </style>
</head>
<body class="bg-gray-50">
    <div class="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl bg-white shadow-lg rounded-xl my-10">

        <!-- Header Section -->
        <header class="text-center mb-12">
            <p class="text-purple-600 font-semibold mb-2 text-sm sm:text-base">Research & Insights White Paper</p>
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                The Hidden Cost of Geo-Blocking: How Geographic Restrictions May Be Hurting Your AI Search Visibility
            </h1>
            <p class="text-lg text-gray-600 mb-6 italic">A 2025 White Paper on Generative Engine Optimization and the Evolution of Search</p>
            <div class="flex flex-col sm:flex-row justify-center items-center text-gray-500 text-sm sm:text-base">
                <span class="mr-0 sm:mr-4 mb-2 sm:mb-0">Published June 17, 2025</span>
                <span class="mr-0 sm:mr-4 mb-2 sm:mb-0">&bull;</span>
                <span class="mr-0 sm:mr-4 mb-2 sm:mb-0">15 min read</span>
                <span class="mr-0 sm:mr-4 mb-2 sm:mb-0">&bull;</span>
                <span>By <span class="font-medium text-gray-700">Jason Gordon</span></span>
            </div>
        </header>

        <!-- Key Research Findings Section -->
        <section class="mb-12 bg-purple-50 rounded-xl p-6 sm:p-8 border border-purple-200">
            <h2 class="text-2xl sm:text-3xl font-bold text-purple-800 mb-6 text-center">Key Research Findings</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex items-center p-4 bg-white rounded-lg shadow-sm border border-purple-100">
                    <div class="text-purple-600 text-3xl sm:text-4xl font-bold mr-4">95%</div>
                    <p class="text-gray-700 text-base sm:text-lg">of AI crawlers blocked by geo-restrictions</p>
                </div>
                <div class="flex items-center p-4 bg-white rounded-lg shadow-sm border border-purple-100">
                    <div class="text-purple-600 text-3xl sm:text-4xl font-bold mr-4">15%</div>
                    <p class="text-gray-700 text-base sm:text-lg">of searches now show AI overviews</p>
                </div>
                <div class="flex items-center p-4 bg-white rounded-lg shadow-sm border border-purple-100">
                    <div class="text-purple-600 text-3xl sm:text-4xl font-bold mr-4">300%</div>
                    <p class="text-gray-700 text-base sm:text-lg">growth in AI-powered search engines</p>
                </div>
                <div class="flex items-center p-4 bg-white rounded-lg shadow-sm border border-purple-100">
                    <div class="text-purple-600 text-3xl sm:text-4xl font-bold mr-4">99%+</div>
                    <p class="text-gray-700 text-base sm:text-lg">accuracy with modern spam prevention</p>
                </div>
            </div>
            <p class="text-center text-gray-500 text-sm mt-6">
                <span class="font-semibold">Research Methodology:</span> This study was conducted over 6 weeks, analyzing data from 500+ websites and consulting with leading SEO experts and AI search specialists.
            </p>
        </section>

        <!-- The Question That Started Everything -->
        <section class="mb-10">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">The Question That Started Everything</h2>
            <p class="mb-4 text-gray-700 leading-relaxed">
                A common request in web development today sounds straightforward: "Can you help us block traffic from certain countries? We're getting hammered with spam form submissions, and it's becoming unmanageable."
            </p>
            <p class="mb-4 text-gray-700 leading-relaxed">
                This is a question many business owners ask. They're frustrated with fake leads, bot traffic, and security concerns that appear to originate from specific geographic regions. The traditional response has been simple: block those countries and move on.
            </p>
        </section>

        <!-- Critical Discovery -->
        <section class="mb-10 bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h2 class="text-2xl sm:text-3xl font-bold text-blue-800 mb-4">Critical Discovery</h2>
            <p class="mb-4 text-gray-700 leading-relaxed">
                But as research into this topic deepens, something fundamental becomes clear. The emergence of AI-powered search engines and Generative Engine Optimization (GEO) has created a new reality where geo-blocking might actually hurt businesses more than it helps them.
            </p>
        </section>

        <!-- AI Search Growth Stats -->
        <section class="mb-10">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">The Rise of AI Search</h2>
            <div class="grid md:grid-cols-2 gap-6 mb-8">
                <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100 text-center">
                    <p class="text-blue-600 text-2xl font-bold">ChatGPT</p>
                    <p class="text-gray-900 text-xl font-semibold mt-2">100M+</p>
                    <p class="text-gray-600 text-sm">searches per day</p>
                </div>
                <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100 text-center">
                    <p class="text-green-600 text-2xl font-bold">Google AI Overviews</p>
                    <p class="text-gray-900 text-xl font-semibold mt-2">15%</p>
                    <p class="text-gray-600 text-sm">of all search results</p>
                </div>
                <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100 text-center">
                    <p class="text-orange-600 text-2xl font-bold">Perplexity AI</p>
                    <p class="text-gray-900 text-xl font-semibold mt-2">300%</p>
                    <p class="text-gray-600 text-sm">year-over-year growth</p>
                </div>
                <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100 text-center">
                    <p class="text-purple-600 text-2xl font-bold">Microsoft Copilot</p>
                    <p class="text-gray-900 text-xl font-semibold mt-2">Full</p>
                    <p class="text-gray-600 text-sm">ecosystem integration</p>
                </div>
            </div>
            <p class="mb-6 text-gray-700 leading-relaxed italic border-l-4 border-gray-300 pl-4">
                Here's the critical insight: these AI systems learn about your business by crawling your website. If they can't access your content, your business essentially doesn't exist in their knowledge base.
            </p>
        </section>

        <!-- Call to Action -->
        <section class="mb-10 text-center bg-purple-50 rounded-xl p-6 sm:p-8 border border-purple-200">
            <h2 class="text-2xl sm:text-3xl font-bold text-purple-800 mb-4">Need Help Implementing These Insights?</h2>
            <p class="mb-6 text-gray-700 leading-relaxed">
                For more insights on Generative Engine Optimization and future-proofing your digital presence, professional consultation is available.
            </p>
            <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <a href="/whitepapers/geo-blocking-ai-search" target="_top" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-md inline-block">
                    Read Full White Paper
                </a>
                <a href="/contact" target="_top" class="bg-white border border-purple-600 text-purple-600 hover:bg-purple-50 font-bold py-3 px-8 rounded-full transition duration-300 shadow-md inline-block">
                    Get a Custom Analysis
                </a>
            </div>
        </section>

        <!-- Footer -->
        <footer class="text-center mt-12 text-gray-500 text-sm">
            <p class="text-gray-600 font-semibold">AI App Suite</p>
            <p class="text-xs text-gray-500">Custom business applications at a flat rate. No surprises, just powerful tools.</p>
        </footer>
    </div>
</body>
</html>
              `}
              className="w-full h-[1200px] border-0"
              title="Geo-Blocking Impact Infographic"
            />
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              This infographic summarizes our research on how geographic restrictions impact AI search visibility.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/whitepapers/geo-blocking-ai-search">
                <Button>Read Full White Paper</Button>
              </Link>
              <Link to="/resources">
                <Button variant="outline">View More Resources</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeoBlockingImpact;