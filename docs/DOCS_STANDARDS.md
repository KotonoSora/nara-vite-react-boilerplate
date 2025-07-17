# Documentation Standards and Guidelines

This document establishes the standards, guidelines, and best practices for maintaining high-quality, consistent documentation across the NARA boilerplate project.

## Overview

Our documentation follows a **Docs-as-Code** approach, treating documentation with the same rigor as source code. This ensures version control, collaboration, consistency, and maintainability.

---

## Table of Contents

- [Documentation Philosophy](#documentation-philosophy)
- [File Organization](#file-organization)
- [Writing Guidelines](#writing-guidelines)
- [Markdown Standards](#markdown-standards)
- [Code Examples](#code-examples)
- [Review Process](#review-process)
- [Tooling and Automation](#tooling-and-automation)
- [Templates](#templates)
- [Maintenance](#maintenance)

---

## Documentation Philosophy

### Principles

1. **User-Centered:** Documentation serves developers using the boilerplate
2. **Actionable:** Every guide should enable readers to accomplish specific goals
3. **Consistent:** Uniform structure, style, and formatting across all documents
4. **Maintainable:** Easy to update and keep current with code changes
5. **Collaborative:** Multiple contributors can work together effectively

### Goals

- Enable new developers to onboard quickly and efficiently
- Provide comprehensive reference materials for all technologies
- Establish internal standards for consistent development practices
- Create a sustainable documentation maintenance process

---

## File Organization

### Directory Structure

```
docs/
├── README.md                 # Documentation index and navigation
├── DOCS_STANDARDS.md         # This file - documentation standards
├── templates/                # Documentation templates
│   ├── README.md
│   ├── guide-template.md
│   └── ...
├── scripts/                  # Documentation utilities
│   ├── lint-docs.sh
│   ├── check-links.sh
│   └── ...
└── [GUIDE_NAME].md          # Individual documentation guides
```

### Naming Conventions

- **Files:** Use `SCREAMING_SNAKE_CASE.md` for guide names
- **Directories:** Use `kebab-case` for subdirectories
- **Images:** Store in `docs/images/` using descriptive names
- **Code examples:** Include in relevant guide or separate `examples/` directory

### File Types

- **Guides:** Comprehensive documentation for specific topics
- **References:** Quick lookup information and API documentation
- **Tutorials:** Step-by-step instructions for specific tasks
- **Standards:** Documentation about documentation (this file)

---

## Writing Guidelines

### Tone and Style

- **Professional but approachable:** Avoid overly casual language
- **Clear and concise:** Get to the point quickly
- **Active voice:** "Use this approach" vs "This approach should be used"
- **Present tense:** "The system handles..." vs "The system will handle..."

### Structure

#### Every Guide Should Include

1. **Overview section** - What, why, and who should read it
2. **Table of contents** - For documents longer than 3 sections
3. **Prerequisites** - What readers need before starting
4. **Step-by-step instructions** - Clear, actionable steps
5. **Code examples** - Working examples that readers can copy
6. **Troubleshooting** - Common issues and solutions
7. **Related resources** - Links to relevant documentation

#### Section Organization

- Use descriptive headings that indicate the content and purpose
- Keep sections focused on a single topic
- Include cross-references to related sections
- Provide clear outcomes for each section

### Content Guidelines

#### Do's

- ✅ Start with the most important information
- ✅ Use numbered lists for sequential steps
- ✅ Use bullet lists for related items
- ✅ Include realistic code examples
- ✅ Explain the "why" behind recommendations
- ✅ Test all instructions and code examples
- ✅ Keep examples up-to-date with current versions

#### Don'ts

- ❌ Assume prior knowledge without stating prerequisites
- ❌ Use outdated examples or screenshots
- ❌ Include untested code or instructions
- ❌ Duplicate information across multiple guides
- ❌ Use technical jargon without explanation

---

## Markdown Standards

### Formatting Rules

Our documentation uses **markdownlint** for consistency. Key rules:

#### Headings

```markdown
# H1 - Document title only
## H2 - Major sections
### H3 - Subsections
#### H4 - Sub-subsections (use sparingly)
```

#### Code Blocks

- Always specify language for syntax highlighting
- Use `typescript` for TypeScript code
- Use `bash` for terminal commands
- Use `json` for configuration files

```typescript
// Good - with language specification
const example = 'This will have syntax highlighting';
```

#### Lists

- Use `-` for bullet lists
- Use `1.` for numbered lists (auto-numbering)
- Indent nested items with 2 spaces

#### Links

- Use descriptive link text (not "click here")
- Prefer relative links for internal documentation
- Use reference-style links for repeated URLs

```markdown
<!-- Good -->
See the [Component Guide](./COMPONENT_GUIDE.md) for details.

<!-- Bad -->
Click [here](./COMPONENT_GUIDE.md) for details.
```

### Line Length

- Maximum 120 characters per line
- Break long lines at natural points (after punctuation)
- Code blocks are exempt from this rule

---

## Code Examples

### Requirements

All code examples must be:

- **Functional:** Copy-pasteable and working
- **Complete:** Include necessary imports and context
- **Current:** Use latest versions and best practices
- **Commented:** Explain non-obvious parts

### TypeScript Standards

```typescript
// Include necessary imports
import { ComponentProps } from 'react';

// Use proper typing
interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

// Include JSDoc comments for complex examples
/**
 * Custom button component with variant support
 */
export function Button({ variant = 'primary', size = 'md', ...props }: ButtonProps) {
  // Implementation
}
```

### Configuration Examples

- Include complete configuration files when helpful
- Highlight the relevant sections
- Explain the purpose of each configuration option

---

## Review Process

### Documentation Changes

All documentation changes follow the same review process as code:

1. **Create branch** from `develop`
2. **Make changes** following these standards
3. **Run documentation linting** (see [Tooling](#tooling-and-automation))
4. **Submit pull request** with clear description
5. **Address review feedback**
6. **Merge** after approval

### Review Checklist

#### Content Review

- [ ] Information is accurate and current
- [ ] Examples work as written
- [ ] Writing is clear and follows style guidelines
- [ ] All links work correctly
- [ ] Cross-references are accurate

#### Technical Review

- [ ] Markdownlint passes
- [ ] Link checking passes
- [ ] Spelling and grammar check
- [ ] Proper file naming and organization
- [ ] Templates used appropriately

### Review Guidelines

#### For Authors

- Test all code examples before submitting
- Run linting tools before requesting review
- Include screenshots for UI-related changes
- Explain the reasoning behind significant changes

#### For Reviewers

- Focus on accuracy, clarity, and usefulness
- Check that examples work in practice
- Verify cross-references and links
- Ensure consistency with existing documentation

---

## Tooling and Automation

### Linting Tools

We use automated tools to maintain consistency:

```bash
# Markdown linting
npm run docs:lint

# Link checking
npm run docs:check-links

# Full documentation validation
npm run docs:validate
```

### Configuration Files

- `.markdownlint.jsonc` - Markdown style and formatting rules
- `.markdown-link-check.json` - Link validation configuration
- `.remarkrc.mjs` - Advanced markdown processing

### GitHub Integration

- **Workflows:** Automated checks for documentation changes
- **Templates:** Issue and PR templates for documentation
- **Branch protection:** Require documentation checks to pass

### Local Development

```bash
# Setup documentation tools
npm run docs:setup

# Watch for changes and auto-fix
npm run docs:watch

# Generate documentation report
npm run docs:report
```

---

## Templates

### Available Templates

Use templates to maintain consistency:

- **[Guide Template](./templates/guide-template.md)** - For comprehensive guides
- **[Tutorial Template](./templates/tutorial-template.md)** - For step-by-step tutorials
- **[API Reference Template](./templates/api-reference-template.md)** - For API documentation
- **[Troubleshooting Template](./templates/troubleshooting-template.md)** - For issue resolution

### Using Templates

1. Copy the appropriate template
2. Rename following naming conventions
3. Fill in all sections marked with brackets
4. Remove template instructions
5. Follow the review process

---

## Maintenance

### Regular Tasks

#### Monthly

- [ ] Review and update outdated examples
- [ ] Check all external links
- [ ] Update screenshots if UI has changed
- [ ] Review analytics to identify popular/problematic docs

#### Quarterly

- [ ] Audit documentation structure
- [ ] Update templates based on learnings
- [ ] Review and update this standards document
- [ ] Survey team for documentation improvements

#### Release Cycle

- [ ] Update examples for new features
- [ ] Document breaking changes
- [ ] Update version-specific information
- [ ] Review and update troubleshooting guides

### Metrics and Analytics

Track documentation effectiveness:

- **Page views:** Which guides are most accessed
- **User feedback:** Collect feedback on helpfulness
- **Issue patterns:** Common documentation-related issues
- **Search terms:** What users are looking for

### Continuous Improvement

- Regular team retrospectives on documentation
- User feedback integration
- Tool and process improvements
- Template updates based on usage patterns

---

## Getting Help

### For Documentation Authors

1. **Check templates** - Use appropriate template for your content
2. **Review examples** - Look at existing guides for patterns
3. **Ask questions** - Create issues for clarification
4. **Test thoroughly** - Verify all examples and instructions

### For Documentation Users

1. **Search existing docs** - Use the [Documentation Index](./README.md)
2. **Check troubleshooting** - Many common issues are documented
3. **Provide feedback** - Help us improve with constructive feedback
4. **Contribute improvements** - Submit PRs for corrections and enhancements

---

## Evolution

This standards document evolves with the project. All changes are:

- **Proposed** through issues or discussions
- **Reviewed** by the team
- **Tested** with real documentation updates
- **Documented** in the changelog
- **Communicated** to all contributors

---

**Remember:** Good documentation is like good code - it's clear, tested, and maintained. When in doubt, prioritize the user's needs and experience.