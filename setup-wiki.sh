#!/bin/bash

# Setup GitHub Wiki Script
# This script populates the GitHub wiki with documentation from docs/wiki/

set -e  # Exit on error

echo "🚀 GitHub Wiki Setup Script"
echo "============================"
echo ""

# Check if wiki repo already exists
if [ -d "wiki-repo" ]; then
    echo "⚠️  wiki-repo directory already exists. Removing it..."
    rm -rf wiki-repo
fi

echo "📥 Cloning wiki repository..."
if git clone https://github.com/aathavale25-web/baby-sensory-webapplication.wiki.git wiki-repo; then
    echo "✅ Wiki repository cloned successfully"
else
    echo ""
    echo "❌ Failed to clone wiki repository."
    echo ""
    echo "Please make sure you have:"
    echo "1. Enabled the Wiki in your GitHub repository settings"
    echo "2. Created at least one page in the wiki (this initializes it)"
    echo ""
    echo "Steps to enable:"
    echo "  1. Go to: https://github.com/aathavale25-web/baby-sensory-webapplication/settings"
    echo "  2. Scroll to 'Features' section"
    echo "  3. Check 'Wikis'"
    echo "  4. Go to Wiki tab and create the first page"
    echo "  5. Run this script again"
    echo ""
    exit 1
fi

echo ""
echo "📄 Copying wiki pages..."

# Copy all markdown files
cp docs/wiki/*.md wiki-repo/

echo "✅ Copied the following pages:"
ls -1 wiki-repo/*.md | xargs -n1 basename

cd wiki-repo

echo ""
echo "📝 Committing changes..."
git add .

if git diff-index --quiet HEAD --; then
    echo "ℹ️  No changes to commit (wiki already up to date)"
else
    git commit -m "Add comprehensive wiki documentation

Documentation pages added:
- Home: Navigation hub and overview
- Installation Guide: Setup instructions
- Age-Adaptive System: How age profiles work
- Supabase Setup: Database configuration
- Parent's Guide: Usage recommendations
- Quick Start Guide: Get started in 5 minutes

Total: 6 comprehensive documentation pages"

    echo ""
    echo "⬆️  Pushing to GitHub..."
    git push origin master

    echo ""
    echo "✅ Wiki successfully populated!"
fi

cd ..

echo ""
echo "🎉 Done!"
echo ""
echo "View your wiki at:"
echo "https://github.com/aathavale25-web/baby-sensory-webapplication/wiki"
echo ""
echo "You can safely delete the wiki-repo folder:"
echo "  rm -rf wiki-repo"
echo ""
