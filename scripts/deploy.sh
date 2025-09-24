#!/bin/bash

# Script de deploy para Inovacode Portfolio
# Este script pode ser executado manualmente para deploy

set -e  # Exit on error

echo "🚀 Starting deployment process..."

# Check if required tools are installed
echo "📋 Checking dependencies..."

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm not found. Please install pnpm first."
    exit 1
fi

if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found. Install with: npm i -g vercel"
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Lint and type check
echo "🔍 Running linting and type checking..."
pnpm lint
pnpm type-check

# Build application
echo "🏗️  Building application..."
pnpm build

echo "✅ Build completed successfully!"

# Deploy frontend (if Vercel CLI is available)
if command -v vercel &> /dev/null; then
    echo "🌐 Deploying frontend to Vercel..."
    vercel --prod
else
    echo "⏭️  Skipping frontend deploy (Vercel CLI not found)"
fi

# Note: Backend API routes are part of Next.js app, no separate backend deployment needed
echo "ℹ️  API routes are integrated with Next.js deployment"

echo "🎉 Deployment process completed!"
echo "📋 Next steps:"
echo "   1. Verify deployment at your Vercel domain"
echo "   2. Test the contact form API routes (/api/contact)"
echo "   3. Check all pages are loading correctly"