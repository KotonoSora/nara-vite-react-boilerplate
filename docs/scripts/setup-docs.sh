#!/bin/bash
# Documentation setup script
# Sets up the complete documentation development environment

set -e

echo "📚 Setting up documentation development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    case $1 in
        "success") echo -e "${GREEN}✅ $2${NC}" ;;
        "error") echo -e "${RED}❌ $2${NC}" ;;
        "warning") echo -e "${YELLOW}⚠️  $2${NC}" ;;
        "info") echo -e "${BLUE}ℹ️  $2${NC}" ;;
        "header") echo -e "${BLUE}🔷 $2${NC}" ;;
    esac
}

print_status "header" "DOCUMENTATION ENVIRONMENT SETUP"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    print_status "error" "npm not found. Please install Node.js and npm first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_status "error" "package.json not found. Please run this script from the project root."
    exit 1
fi

# Install documentation dependencies
print_status "info" "Installing documentation tools..."
npm install -D markdownlint-cli markdown-link-check remark remark-cli remark-preset-lint-recommended remark-preset-lint-consistent

# Make scripts executable
print_status "info" "Setting up documentation scripts..."
chmod +x docs/scripts/*.sh

# Create necessary directories
print_status "info" "Creating documentation directories..."
mkdir -p docs/images docs/examples docs/.cache

# Validate current documentation
print_status "info" "Running initial documentation validation..."

if npm run docs:lint; then
    print_status "success" "Markdown linting passed"
else
    print_status "warning" "Some markdown linting issues found - run 'npm run docs:lint:fix' to auto-fix"
fi

# Test link checking (but don't fail on template links)
print_status "info" "Testing link validation (may show template link warnings)..."
npm run docs:check-links || print_status "warning" "Link checker setup complete (template links expected to be broken)"

# Create .gitignore entries if not present
if ! grep -q "docs/.cache" .gitignore 2>/dev/null; then
    print_status "info" "Adding documentation entries to .gitignore..."
    echo "" >> .gitignore
    echo "# Documentation build artifacts" >> .gitignore
    echo "docs/.cache/" >> .gitignore
    echo "docs/dist/" >> .gitignore
    echo "docs/build/" >> .gitignore
fi

# Show available commands
print_status "header" "AVAILABLE COMMANDS"
echo ""
echo "📝 Documentation Development:"
echo "   npm run docs:lint          - Lint all documentation"
echo "   npm run docs:lint:fix      - Auto-fix linting issues"
echo "   npm run docs:check-links   - Validate all links"
echo "   npm run docs:validate      - Run comprehensive validation"
echo ""
echo "🛠 Documentation Scripts:"
echo "   bash docs/scripts/lint-docs.sh       - Detailed linting"
echo "   bash docs/scripts/check-links.sh     - Link validation"
echo "   bash docs/scripts/validate-docs.sh   - Full validation report"
echo ""
echo "📋 Templates Available:"
echo "   docs/templates/guide-template.md           - General guide template"
echo "   docs/templates/tutorial-template.md        - Tutorial template"
echo "   docs/templates/api-reference-template.md   - API documentation template"
echo "   docs/templates/troubleshooting-template.md - Troubleshooting template"
echo ""

# Show next steps
print_status "header" "NEXT STEPS"
echo ""
echo "1. 📖 Read the documentation standards:"
echo "   open docs/DOCS_STANDARDS.md"
echo ""
echo "2. 🔍 Validate your current documentation:"
echo "   npm run docs:validate"
echo ""
echo "3. ✏️  Create new documentation using templates:"
echo "   cp docs/templates/guide-template.md docs/YOUR_NEW_GUIDE.md"
echo ""
echo "4. 🔧 Set up your editor for markdown development:"
echo "   - Install markdownlint extension"
echo "   - Configure markdown preview"
echo "   - Set up spell checking"
echo ""

print_status "success" "Documentation environment setup complete!"
print_status "info" "Happy documenting! 📚"