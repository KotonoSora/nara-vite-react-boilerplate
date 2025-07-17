#!/bin/bash
# Comprehensive documentation validation
# Runs all documentation checks and generates a report

set -e

echo "📋 Running comprehensive documentation validation..."

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

# Track overall status
overall_status=0

print_status "header" "DOCUMENTATION VALIDATION REPORT"
echo "Generated: $(date)"
echo ""

# 1. Markdown Linting
print_status "header" "1. Markdown Linting"
if bash docs/scripts/lint-docs.sh; then
    print_status "success" "Markdown linting passed"
else
    print_status "error" "Markdown linting failed"
    overall_status=1
fi
echo ""

# 2. Link Checking
print_status "header" "2. Link Validation"
if bash docs/scripts/check-links.sh; then
    print_status "success" "Link validation passed"
else
    print_status "error" "Link validation failed"
    overall_status=1
fi
echo ""

# 3. Documentation Structure Check
print_status "header" "3. Documentation Structure"

# Check required files exist
required_files=(
    "docs/README.md"
    "docs/DOCS_STANDARDS.md"
    "docs/DEVELOPER_ONBOARDING.md"
    "docs/ARCHITECTURE.md"
    "docs/TROUBLESHOOTING.md"
)

structure_issues=0
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "success" "Required file exists: $file"
    else
        print_status "error" "Missing required file: $file"
        structure_issues=$((structure_issues + 1))
    fi
done

if [ $structure_issues -eq 0 ]; then
    print_status "success" "Documentation structure is complete"
else
    print_status "error" "Documentation structure has $structure_issues issues"
    overall_status=1
fi
echo ""

# 4. Content Quality Checks
print_status "header" "4. Content Quality"

# Check for empty files
empty_files=$(find docs -name "*.md" -empty | wc -l)
if [ "$empty_files" -eq 0 ]; then
    print_status "success" "No empty documentation files"
else
    print_status "warning" "Found $empty_files empty documentation files"
    find docs -name "*.md" -empty | while read file; do
        echo "   - $file"
    done
fi

# Check for files with minimal content (less than 100 characters)
minimal_files=0
find docs -name "*.md" -not -empty | while read file; do
    size=$(wc -c < "$file")
    if [ "$size" -lt 100 ]; then
        if [ $minimal_files -eq 0 ]; then
            print_status "warning" "Files with minimal content (< 100 chars):"
        fi
        echo "   - $file ($size chars)"
        minimal_files=$((minimal_files + 1))
    fi
done

echo ""

# 5. Documentation Coverage
print_status "header" "5. Documentation Coverage"

# Count different types of documentation
guides_count=$(find docs -name "*.md" -not -name "README.md" | wc -l)
total_size=$(find docs -name "*.md" -exec wc -c {} + | tail -1 | awk '{print $1}')
total_words=$(find docs -name "*.md" -exec wc -w {} + | tail -1 | awk '{print $1}')

echo "📊 Documentation Statistics:"
echo "   Total guides: $guides_count"
echo "   Total size: $(($total_size / 1024)) KB"
echo "   Total words: $total_words"
echo "   Average words per guide: $(($total_words / $guides_count))"

# Check coverage of key areas
coverage_areas=(
    "setup\|installation\|onboarding"
    "architecture\|design\|patterns"
    "testing\|test\|spec"
    "deployment\|deploy\|production"
    "troubleshooting\|debugging\|issues"
    "api\|backend\|server"
    "components\|frontend\|ui"
    "database\|db\|schema"
)

echo ""
echo "📋 Content Coverage:"
for area in "${coverage_areas[@]}"; do
    count=$(grep -ri "$area" docs --include="*.md" | wc -l)
    if [ "$count" -gt 0 ]; then
        print_status "success" "$(echo $area | cut -d'\\' -f1 | tr '[:lower:]' '[:upper:]') coverage: $count references"
    else
        print_status "warning" "$(echo $area | cut -d'\\' -f1 | tr '[:lower:]' '[:upper:]') coverage: No references found"
    fi
done

echo ""

# 6. Template Usage
print_status "header" "6. Template Compliance"

if [ -d "docs/templates" ]; then
    template_count=$(find docs/templates -name "*.md" | wc -l)
    print_status "success" "Documentation templates available: $template_count"
    
    # Check for template placeholders in documentation
    placeholder_files=$(grep -r "\[.*Template.*\]" docs --include="*.md" --exclude-dir=templates | wc -l)
    if [ "$placeholder_files" -eq 0 ]; then
        print_status "success" "No unfilled template placeholders found"
    else
        print_status "warning" "Found potential unfilled template placeholders"
    fi
else
    print_status "warning" "No documentation templates directory found"
fi

echo ""

# Final Summary
print_status "header" "VALIDATION SUMMARY"

if [ $overall_status -eq 0 ]; then
    print_status "success" "All documentation validation checks passed!"
    echo ""
    echo "✨ Your documentation is in excellent shape:"
    echo "   • Consistent markdown formatting"
    echo "   • All links are working"
    echo "   • Complete documentation structure"
    echo "   • Good content coverage"
    echo ""
    echo "🚀 Ready for production!"
else
    print_status "error" "Some documentation validation checks failed"
    echo ""
    echo "🔧 Please address the issues above before publishing."
    echo "💡 See docs/DOCS_STANDARDS.md for guidelines."
fi

echo ""
echo "📋 Report completed at $(date)"

exit $overall_status