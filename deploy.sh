#!/bin/bash

echo "🚀 Deploying App Suite with SEO optimizations..."

# Build the project
echo "📦 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📄 Generated files:"
    ls -la dist/
    echo ""
    echo "🔍 SEO pages generated:"
    find dist/ -name "index.html" -exec echo "  - {}" \;
    echo ""
    echo "🌐 Ready for deployment!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Deploy the dist/ folder to your hosting provider"
    echo "2. Submit sitemap to Google Search Console: https://app-suite.io/sitemap.xml"
    echo "3. Test with Google's Rich Results Test: https://search.google.com/test/rich-results"
    echo "4. Monitor crawling in Google Search Console"
else
    echo "❌ Build failed!"
    exit 1
fi