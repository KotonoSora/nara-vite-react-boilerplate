# Documentation Contribution Guide

Welcome to the NARA documentation contribution guide! This document explains how to contribute to our
comprehensive documentation system using our **Docs-as-Code** approach.

## Quick Start

### For New Contributors

1. **Set up your environment**
   ```bash
   npm run docs:setup
   ```

2. **Read the standards**
   - [Documentation Standards](./DOCS_STANDARDS.md) - Complete guidelines
   - [Available Templates](./templates/) - Consistent starting points

3. **Create your documentation**
   ```bash
   # Copy appropriate template
   cp docs/templates/guide-template.md docs/YOUR_GUIDE.md
   
   # Edit your documentation
   # Follow the template structure
   ```

4. **Validate before submitting**
   ```bash
   npm run docs:validate
   ```

---

## Documentation System Overview

### Docs-as-Code Philosophy

Our documentation is treated with the same rigor as source code:

- **Version controlled** - All changes tracked in Git
- **Code reviewed** - Documentation changes go through PR review
- **Automated testing** - Linting, link checking, structure validation
- **Consistent quality** - Templates and standards ensure uniformity
- **Collaborative** - Multiple contributors can work together effectively

### Tools and Infrastructure

| Tool | Purpose | Command |
|------|---------|---------|
| markdownlint | Markdown consistency | `npm run docs:lint` |
| markdown-link-check | Link validation | `npm run docs:check-links` |
| GitHub Actions | Automated validation | Runs on PR |
| Templates | Consistent structure | `docs/templates/` |
| Pre-commit hooks | Prevent bad commits | Automatic |

---

## Types of Documentation

### Comprehensive Guides

**Purpose:** In-depth coverage of major topics
**Template:** `guide-template.md`
**Examples:** `COMPONENT_GUIDE.md`, `API_GUIDE.md`

**When to create:**
- New major feature or technology
- Complex topics requiring detailed explanation
- Reference material for ongoing use

### Step-by-Step Tutorials

**Purpose:** Learning-focused, task-oriented instructions
**Template:** `tutorial-template.md`
**Examples:** Setup guides, specific implementation tutorials

**When to create:**
- Onboarding new developers
- Teaching specific skills
- Demonstrating complex workflows

### API References

**Purpose:** Technical reference for APIs and interfaces
**Template:** `api-reference-template.md`
**Examples:** REST API documentation, component props

**When to create:**
- Public or internal APIs
- Component libraries
- Configuration options

### Troubleshooting Guides

**Purpose:** Problem-solving and issue resolution
**Template:** `troubleshooting-template.md`
**Examples:** `TROUBLESHOOTING.md`, component-specific guides

**When to create:**
- Common support issues
- Complex debugging scenarios
- Platform-specific problems

---

## Contribution Workflow

### 1. Planning Your Contribution

**Before writing:**

- [ ] Check if documentation already exists
- [ ] Read related documentation for context
- [ ] Identify your target audience
- [ ] Choose the appropriate template
- [ ] Plan your structure and scope

**Document planning:**
- What problem does this solve?
- Who is the target audience?
- What prior knowledge is assumed?
- How does this fit with existing docs?

### 2. Creating Documentation

**Setup:**
```bash
# Ensure environment is ready
npm run docs:setup

# Choose and copy template
cp docs/templates/[appropriate-template].md docs/YOUR_GUIDE.md
```

**Writing process:**

1. **Fill in the template structure**
   - Replace all `[placeholder]` content
   - Follow the template sections
   - Remove template instructions

2. **Write clear, actionable content**
   - Use active voice
   - Include code examples
   - Add screenshots for UI elements
   - Cross-reference related docs

3. **Test all examples**
   - Verify code examples work
   - Test all instructions step-by-step
   - Check that links are correct

### 3. Quality Assurance

**Local validation:**
```bash
# Lint markdown formatting
npm run docs:lint

# Check all links
npm run docs:check-links

# Full validation
npm run docs:validate
```

**Content review:**
- [ ] All code examples tested
- [ ] Screenshots are current
- [ ] Links work correctly
- [ ] Writing is clear and concise
- [ ] Structure follows template
- [ ] Cross-references are accurate

### 4. Submission Process

**Create a Pull Request:**

1. **Commit your changes**
   ```bash
   git add docs/YOUR_GUIDE.md
   git commit -m "docs: add [brief description] guide"
   ```

2. **Push and create PR**
   ```bash
   git push origin your-branch
   # Create PR through GitHub interface
   ```

3. **Use PR template**
   - Fill out documentation section completely
   - List all files changed
   - Explain the purpose and scope

**PR Requirements:**
- [ ] Passes all automated checks
- [ ] Includes documentation type in PR description
- [ ] Links to related issues or discussions
- [ ] Explains target audience and purpose

---

## Review Process

### For Authors

**Preparing for review:**
- Run all validation tools locally
- Double-check all examples and links
- Consider reviewer perspective
- Provide context in PR description

**Responding to feedback:**
- Address all reviewer comments
- Re-run validation after changes
- Ask for clarification if needed
- Update related documentation if necessary

### For Reviewers

**Review checklist:**
- [ ] Content is accurate and complete
- [ ] Writing is clear and follows style guide
- [ ] Code examples work as written
- [ ] Links are functional and appropriate
- [ ] Structure follows template standards
- [ ] Cross-references are helpful

**Review focus areas:**
- **Accuracy** - Technical correctness
- **Clarity** - Understandable by target audience
- **Completeness** - Covers stated scope adequately
- **Consistency** - Follows project standards
- **Usefulness** - Serves documented purpose

---

## Maintenance

### Regular Tasks

**Monthly:**
- [ ] Review popular documentation for accuracy
- [ ] Update screenshots if UI has changed
- [ ] Check external links for validity
- [ ] Review and respond to documentation issues

**Quarterly:**
- [ ] Audit documentation structure
- [ ] Update templates based on learnings
- [ ] Review metrics and user feedback
- [ ] Plan documentation improvements

### Version Management

**With each release:**
- [ ] Update version-specific information
- [ ] Document new features added
- [ ] Update migration guides
- [ ] Review deprecation notices

**Breaking changes:**
- [ ] Update affected documentation immediately
- [ ] Add migration instructions
- [ ] Update troubleshooting guides
- [ ] Communicate changes clearly

---

## Best Practices

### Writing Guidelines

**Structure:**
- Start with overview and prerequisites
- Use consistent heading hierarchy
- Include table of contents for long docs
- End with next steps and related resources

**Content:**
- Write for your audience's skill level
- Include realistic, working examples
- Explain the "why" behind instructions
- Use screenshots for complex UI interactions

**Style:**
- Use active voice ("Run the command" vs "The command should be run")
- Be concise but thorough
- Use consistent terminology
- Follow markdown standards

### Technical Guidelines

**Code examples:**
```typescript
// Always include necessary imports
import { Component } from 'react';

// Use proper TypeScript typing
interface Props {
  title: string;
  children: React.ReactNode;
}

// Include JSDoc comments for complex examples
/**
 * Example component demonstrating best practices
 */
export function ExampleComponent({ title, children }: Props) {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
```

**Configuration examples:**
- Include complete configuration files when helpful
- Highlight the relevant sections
- Explain the purpose of each option
- Provide links to full reference

### Collaboration Tips

**Working with others:**
- Coordinate on large documentation efforts
- Review each other's work regularly
- Share expertise and insights
- Maintain consistent voice and style

**Community engagement:**
- Respond to documentation issues promptly
- Welcome new contributors
- Provide constructive feedback
- Share knowledge and best practices

---

## Getting Help

### Documentation Questions

1. **Check existing resources**
   - [Documentation Standards](./DOCS_STANDARDS.md)
   - [Templates](./templates/)
   - [Troubleshooting Guide](./TROUBLESHOOTING.md)

2. **Ask for help**
   - [Create documentation issue](https://github.com/KotonoSora/nara-vite-react-boilerplate/issues/new?template=documentation.yml)
   - Join discussions in PRs
   - Ask in team channels

### Technical Support

**Tooling issues:**
```bash
# Reset documentation environment
npm run docs:setup

# Get detailed validation report
npm run docs:validate
```

**Common problems:**
- Linting failures - Check `.markdownlint.jsonc` configuration
- Link checking issues - Review `.markdown-link-check.json` settings
- Template problems - Ensure you're using the latest templates

---

## Recognition

### Contribution Types

We recognize all forms of documentation contribution:

- **Writing** - Creating new documentation
- **Editing** - Improving existing content
- **Reviewing** - Providing feedback on PRs
- **Maintenance** - Keeping docs current
- **Tooling** - Improving our infrastructure
- **Translation** - Making docs accessible

### Documentation Contributors

Documentation contributors are recognized in:
- Git commit history
- Release notes
- Contributor acknowledgments
- Community highlights

---

**Ready to contribute?** Start with `npm run docs:setup` and choose a template that fits your contribution!

**Questions?** Check our [Documentation Standards](./DOCS_STANDARDS.md) or
[open an issue](https://github.com/KotonoSora/nara-vite-react-boilerplate/issues/new?template=documentation.yml).