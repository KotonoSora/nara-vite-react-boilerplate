#!/bin/bash
# Link checking script for documentation
# Validates all links in markdown files

set -e

echo "🔗 Running link validation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOCS_DIR="docs"
README_FILE="README.md"
CONFIG_FILE=".markdown-link-check.json"

# Function to print colored output
print_status() {
    case $1 in
        "success") echo -e "${GREEN}✅ $2${NC}" ;;
        "error") echo -e "${RED}❌ $2${NC}" ;;
        "warning") echo -e "${YELLOW}⚠️  $2${NC}" ;;
        "info") echo -e "ℹ️  $2" ;;
    esac
}

# Check if markdown-link-check is available
if ! command -v markdown-link-check &> /dev/null; then
    print_status "error" "markdown-link-check not found. Please install with: npm install -D markdown-link-check"
    exit 1
fi

# Function to check links in a file
check_file_links() {
    local file="$1"
    local filename=$(basename "$file")
    
    print_status "info" "Checking links in $filename..."
    
    if markdown-link-check "$file" --config "$CONFIG_FILE" --quiet; then
        print_status "success" "$filename - All links valid"
        return 0
    else
        print_status "error" "$filename - Found broken links"
        return 1
    fi
}

# Initialize counters
total_files=0
failed_files=0
broken_links=0

# Check README first
if [ -f "$README_FILE" ]; then
    total_files=$((total_files + 1))
    if ! check_file_links "$README_FILE"; then
        failed_files=$((failed_files + 1))
    fi
fi

# Check all markdown files in docs directory
if [ -d "$DOCS_DIR" ]; then
    while IFS= read -r -d '' file; do
        total_files=$((total_files + 1))
        if ! check_file_links "$file"; then
            failed_files=$((failed_files + 1))
        fi
    done < <(find "$DOCS_DIR" -name "*.md" -print0)
fi

echo ""
echo "📊 Link checking results:"
echo "   Files checked: $total_files"
echo "   Files with broken links: $failed_files"

if [ $failed_files -eq 0 ]; then
    print_status "success" "All links are valid!"
    exit 0
else
    print_status "error" "Found broken links in $failed_files file(s)"
    echo ""
    echo "🔧 Common fixes:"
    echo "   • Check relative paths (case sensitive)"
    echo "   • Verify external URLs are accessible"
    echo "   • Update outdated links"
    echo "   • Check anchor links match actual headings"
    echo ""
    echo "📖 See link checking configuration: .markdown-link-check.json"
    exit 1
fi