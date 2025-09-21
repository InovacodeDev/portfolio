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

if ! command -v flyctl &> /dev/null; then
    echo "⚠️  Fly CLI not found. Install from: https://fly.io/docs/getting-started/installing-flyctl/"
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Lint and type check
echo "🔍 Running linting and type checking..."
pnpm turbo lint
pnpm turbo type-check

# Build applications
echo "🏗️  Building applications..."
pnpm turbo build

echo "✅ Build completed successfully!"

# Deploy frontend (if Vercel CLI is available)
if command -v vercel &> /dev/null; then
    echo "🌐 Deploying frontend to Vercel..."
    cd apps/web
    vercel --prod
    cd ../..
else
    echo "⏭️  Skipping frontend deploy (Vercel CLI not found)"
fi

# Deploy backend (if Fly CLI is available)
if command -v flyctl &> /dev/null; then
    echo "🔥 Deploying backend to Fly.io..."
    flyctl deploy
else
    echo "⏭️  Skipping backend deploy (Fly CLI not found)"
fi

echo "🎉 Deployment process completed!"
echo "📋 Next steps:"
echo "   1. Verify frontend at your Vercel domain"
echo "   2. Verify backend API at your Fly.io domain"
echo "   3. Test the contact form end-to-end"