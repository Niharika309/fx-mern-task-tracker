#!/bin/bash

echo "🚀 MERN Task Tracker - Deployment Script"
echo "========================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📋 Deployment Steps:"
echo "1. Set up MongoDB Atlas (see DEPLOYMENT_GUIDE.md)"
echo "2. Deploy backend to Vercel"
echo "3. Deploy frontend to Vercel"
echo "4. Set environment variables"
echo "5. Test deployment"
echo ""

echo "🔧 Starting Backend Deployment..."
echo "Run: vercel"
echo ""

echo "🎨 Starting Frontend Deployment..."
echo "Run: cd client && vercel"
echo ""

echo "📝 Don't forget to:"
echo "- Set up MongoDB Atlas"
echo "- Add environment variables in Vercel dashboard"
echo "- Update frontend API URLs"
echo ""

echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
