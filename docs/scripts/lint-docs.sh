#!/bin/bash
# Documentation linting script
# Validates markdown files for consistency and style

set -e

echo "🔍 Running documentation linting..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOCS_DIR="docs"
README_FILE="README.md"

# Function to print colored output
print_status() {
    case $1 in
        "success") echo -e "${GREEN}✅ $2${NC}" ;;
        "error") echo -e "${RED}❌ $2${NC}" ;;
        "warning") echo -e "${YELLOW}⚠️  $2${NC}" ;;
        "info") echo -e "ℹ️  $2" ;;
    esac
}

# Check if markdownlint is available
if ! command -v markdownlint &> /dev/null; then
    print_status "error" "markdownlint not found. Please install with: npm install -D markdownlint-cli"
    exit 1
fi

# Run markdownlint on documentation files
print_status "info" "Checking markdown files with markdownlint..."

if markdownlint "$DOCS_DIR"/**/*.md "$README_FILE" --config .markdownlint.jsonc; then
    print_status "success" "Markdown linting passed"
else
    print_status "error" "Markdown linting failed"
    echo ""
    echo "🔧 To fix automatically fixable issues:"
    echo "   markdownlint --fix $DOCS_DIR/**/*.md $README_FILE --config .markdownlint.jsonc"
    echo ""
    echo "📖 See documentation standards: docs/DOCS_STANDARDS.md"
    exit 1
fi

# Check for common documentation issues
print_status "info" "Checking for common documentation issues..."

# Check for TODO markers
if grep -r "TODO\|FIXME\|XXX" "$DOCS_DIR" --include="*.md" > /dev/null; then
    print_status "warning" "Found TODO/FIXME markers in documentation"
    grep -rn "TODO\|FIXME\|XXX" "$DOCS_DIR" --include="*.md" | head -5
    echo "   Consider addressing these before publishing"
fi

# Check for placeholder text
if grep -r "\[.*\]" "$DOCS_DIR" --include="*.md" | grep -v "http" | grep -v "docs/" > /dev/null; then
    print_status "warning" "Found potential placeholder text (content in brackets)"
    grep -rn "\[.*\]" "$DOCS_DIR" --include="*.md" | grep -v "http" | grep -v "docs/" | head -3
    echo "   Verify these are not unfilled template placeholders"
fi

# Check for consistent headings
print_status "info" "Validating heading structure..."

# This is a basic check - could be enhanced with more sophisticated validation
find "$DOCS_DIR" -name "*.md" -exec bash -c '
    file="$1"
    if head -1 "$file" | grep -v "^# " > /dev/null; then
        if [ "$(basename "$file")" != "README.md" ]; then
            echo "⚠️  $file: First line should be a top-level heading"
        fi
    fi
' _ {} \;

print_status "success" "Documentation linting completed"

echo ""
echo "📊 Documentation statistics:"
echo "   Files checked: $(find "$DOCS_DIR" -name "*.md" | wc -l)"
echo "   Total lines: $(find "$DOCS_DIR" -name "*.md" -exec wc -l {} + | tail -1 | awk '{print $1}')"
echo "   Words: $(find "$DOCS_DIR" -name "*.md" -exec wc -w {} + | tail -1 | awk '{print $1}')"