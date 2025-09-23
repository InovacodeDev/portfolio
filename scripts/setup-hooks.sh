#!/bin/bash

# Git hooks setup script
# Run this script after cloning the repository to enable git hooks

set -e

echo "🔧 Setting up git hooks for InovaCode Portfolio..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: This script must be run from the root of a git repository"
    exit 1
fi

# Configure git to use our custom hooks directory
print_info "Configuring git hooks path..."
git config core.hooksPath .githooks
print_success "Git hooks path configured to use .githooks directory"

# Make all hooks executable
print_info "Making hooks executable..."
find .githooks -type f -exec chmod +x {} \;
print_success "All hooks are now executable"

# Verify hooks are working
print_info "Available hooks:"
for hook in .githooks/*; do
    if [ -f "$hook" ]; then
        hook_name=$(basename "$hook")
        echo "  - $hook_name"
    fi
done

echo ""
print_success "Git hooks setup complete! 🎉"
echo ""
echo "📋 Available hooks:"
echo "  • pre-push: Validates frozen lockfile consistency"
echo ""
echo "💡 These hooks will run automatically on git operations."
echo "   To temporarily skip hooks, use --no-verify flag"
echo ""
echo "🔧 To disable hooks: git config core.hooksPath .git/hooks"
echo "🔧 To re-enable hooks: git config core.hooksPath .githooks"