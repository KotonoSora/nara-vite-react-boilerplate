# Documentation Index

Welcome to the complete documentation for the NARA (Non‑Abstract Reusable App) boilerplate. This organized guide index provides quick-access navigation, use-case routing, and cross-referenced learning paths to help you master the entire development stack efficiently.

---

## 📚 Documentation Overview

The NARA boilerplate documentation is strategically organized into focused guides that cover different aspects of development, from getting started to advanced architectural patterns and comprehensive troubleshooting, ensuring developers can find exactly what they need at every stage of their journey.

---

## 🚀 Getting Started

### Essential Reading

- **[Developer Onboarding Guide](./DEVELOPER_ONBOARDING.md)** - Start here! Complete setup guide for new developers
- **[Project Overview](./PROJECT_OVERVIEW.md)** - Architecture, tech stack, and project structure
- **[README](../README.md)** - Quick overview and basic setup instructions

### Quick Setup Checklist

1. Read [Developer Onboarding Guide](./DEVELOPER_ONBOARDING.md)
2. Follow setup instructions
3. Review [Project Overview](./PROJECT_OVERVIEW.md)
4. Start with [Component Guide](./COMPONENT_GUIDE.md) for UI development

---

## 🏗 Architecture and Design

### Core Architecture

- **[Architecture Deep Dive](./ARCHITECTURE.md)** - Comprehensive architecture overview, design patterns, and technical decisions
- **[Project Overview](./PROJECT_OVERVIEW.md)** - High-level project structure and feature overview

### Technology-Specific Guides

- **[React Router Guide](./REACT_ROUTER_GUIDE.md)** - File-based routing patterns and SSR
- **[Component Guide](./COMPONENT_GUIDE.md)** - UI components, shadcn/ui, styling patterns
- **[Database Guide](./DATABASE_GUIDE.md)** - Drizzle ORM, schema design, migrations
- **[API Development Guide](./API_GUIDE.md)** - Hono framework, routing, middleware

---

## 💻 Development Guides

### Core Development

- **[Developer Onboarding Guide](./DEVELOPER_ONBOARDING.md)** - Complete new developer setup
- **[Testing Guide](./TESTING_GUIDE.md)** - Unit tests, integration tests, E2E testing
- **[API Development Guide](./API_GUIDE.md)** - Backend development with Hono
- **[Database Guide](./DATABASE_GUIDE.md)** - Database development and management

### Frontend Development

- **[Component Guide](./COMPONENT_GUIDE.md)** - Component system and UI patterns
- **[React Router Guide](./REACT_ROUTER_GUIDE.md)** - Routing and navigation

### Backend Development

- **[API Development Guide](./API_GUIDE.md)** - API design and implementation
- **[Database Guide](./DATABASE_GUIDE.md)** - Data layer development

---

## 🚢 Deployment and Operations

### CI/CD and Deployment

- **[CI Deploy Guide](./CI_DEPLOY_GUIDE.md)** - GitHub Actions, Cloudflare deployment
- **[Troubleshooting Guide](./TROUBLESHOOTING.md)** - Common issues and solutions

### Troubleshooting

- **[Troubleshooting Guide](./TROUBLESHOOTING.md)** - Comprehensive problem-solving guide

---

## 👥 Team and Contribution

### Contributing

- **[Contributing Guidelines](../CONTRIBUTING.md)** - How to contribute to the project
- **[Code of Conduct](../CODE_OF_CONDUCT.md)** - Community guidelines
- **[Security Policy](../SECURITY.md)** - Security reporting guidelines

### Legal

- **[License](../LICENSE)** - AGPL-3.0 license terms
- **[Changelog](../CHANGELOG.md)** - Version history

---

## 📖 Documentation by Use Case

### 🆕 New to the Project?

> **Learning Path (Confidence: Step by step guidance)**

1. [Developer Onboarding Guide](./DEVELOPER_ONBOARDING.md) - **Start here!** Complete setup and first steps
2. [Project Overview](./PROJECT_OVERVIEW.md) - Understand the architecture and tech stack
3. [Architecture Deep Dive](./ARCHITECTURE.md) - Deep technical understanding

**Success Criteria:** Can run `bun run dev` and access the app at localhost:5173

### 🎨 Frontend Development?

> **Development Path (Confidence: Component-focused workflow)**

1. [Component Guide](./COMPONENT_GUIDE.md) - UI components and styling patterns
2. [React Router Guide](./REACT_ROUTER_GUIDE.md) - File-based routing and navigation
3. [Testing Guide](./TESTING_GUIDE.md) (Frontend sections) - Component testing strategies

**Success Criteria:** Can create new components and routes with proper styling

### ⚙️ Backend Development?

> **API Development Path (Confidence: Full-stack integration)**

1. [API Development Guide](./API_GUIDE.md) - Hono framework and endpoint creation
2. [Database Guide](./DATABASE_GUIDE.md) - Drizzle ORM and schema design
3. [Testing Guide](./TESTING_GUIDE.md) (API sections) - API and database testing

**Success Criteria:** Can create type-safe APIs with database integration

### 🚀 Ready to Deploy?

> **Deployment Path (Confidence: Production readiness)**

1. [CI Deploy Guide](./CI_DEPLOY_GUIDE.md) - GitHub Actions and Cloudflare deployment
2. [Troubleshooting Guide](./TROUBLESHOOTING.md) - Common deployment issues

**Success Criteria:** Application deployed successfully to Cloudflare

### 🧪 Setting Up Testing?

> **Testing Path (Confidence: Quality assurance)**

1. [Testing Guide](./TESTING_GUIDE.md) - Complete testing strategies and setup
2. [Architecture Deep Dive](./ARCHITECTURE.md) (Testing Architecture section) - Testing architecture patterns

**Success Criteria:** Can write and run tests for all application layers

### 🐛 Having Issues?

> **Problem Resolution Path (Confidence: Issue resolution)**

1. [Troubleshooting Guide](./TROUBLESHOOTING.md) - Comprehensive problem-solving guide
2. [Developer Onboarding Guide](./DEVELOPER_ONBOARDING.md) (Environment Setup) - Environment troubleshooting

**Success Criteria:** Development environment works correctly and issues are resolved

---

## 🔍 Quick Reference

### Common Tasks

| Task                          | Guide                                             | Section                  | Difficulty      | Est. Time |
| ----------------------------- | ------------------------------------------------- | ------------------------ | --------------- | --------- |
| Setup development environment | [Developer Onboarding](./DEVELOPER_ONBOARDING.md) | Quick Setup Checklist    | 🟢 Beginner     | 30 min    |
| Add new component             | [Component Guide](./COMPONENT_GUIDE.md)           | Component Best Practices | 🟡 Intermediate | 20 min    |
| Create API endpoint           | [API Development Guide](./API_GUIDE.md)           | RESTful API Design       | 🟡 Intermediate | 45 min    |
| Design database schema        | [Database Guide](./DATABASE_GUIDE.md)             | Schema Design            | 🟠 Advanced     | 60 min    |
| Add new route                 | [React Router Guide](./REACT_ROUTER_GUIDE.md)     | File-based Routing       | 🟢 Beginner     | 15 min    |
| Write tests                   | [Testing Guide](./TESTING_GUIDE.md)               | Unit Testing             | 🟡 Intermediate | 45 min    |
| Deploy to production          | [CI Deploy Guide](./CI_DEPLOY_GUIDE.md)           | Manual Deployment        | 🟠 Advanced     | 90 min    |
| Debug issues                  | [Troubleshooting Guide](./TROUBLESHOOTING.md)     | Common Issues            | 🟡 Intermediate | Variable  |

### Technology References

| Technology         | Primary Guide                                 | Difficulty      | Prerequisites      | Additional Resources                              |
| ------------------ | --------------------------------------------- | --------------- | ------------------ | ------------------------------------------------- |
| React Router v7    | [React Router Guide](./REACT_ROUTER_GUIDE.md) | 🟡 Intermediate | React basics       | [Architecture](./ARCHITECTURE.md)                 |
| shadcn/ui          | [Component Guide](./COMPONENT_GUIDE.md)       | 🟢 Beginner     | CSS knowledge      | [Developer Onboarding](./DEVELOPER_ONBOARDING.md) |
| Drizzle ORM        | [Database Guide](./DATABASE_GUIDE.md)         | 🟠 Advanced     | SQL knowledge      | [API Guide](./API_GUIDE.md)                       |
| Hono Framework     | [API Development Guide](./API_GUIDE.md)       | 🟡 Intermediate | HTTP/REST concepts | [Architecture](./ARCHITECTURE.md)                 |
| Cloudflare Workers | [CI Deploy Guide](./CI_DEPLOY_GUIDE.md)       | 🟠 Advanced     | Cloud platforms    | [API Guide](./API_GUIDE.md)                       |
| Vitest             | [Testing Guide](./TESTING_GUIDE.md)           | 🟡 Intermediate | Testing concepts   | [Troubleshooting](./TROUBLESHOOTING.md)           |

---

## 📋 Documentation Standards

### Structure

Each guide follows a consistent structure:

- **Overview** - What the guide covers
- **Core Concepts** - Fundamental understanding
- **Practical Examples** - Real-world usage
- **Best Practices** - Recommended patterns
- **Troubleshooting** - Common issues (when applicable)

### Cross-References

- Guides reference each other where relevant
- [Troubleshooting Guide](./TROUBLESHOOTING.md) provides solutions for all areas
- [Architecture Deep Dive](./ARCHITECTURE.md) explains the "why" behind patterns

### Code Examples

- All code examples are tested and functional
- Examples follow the project's coding standards
- TypeScript examples include proper typing

---

## 🆘 Need Help?

### In Order of Preference

1. **Check Documentation** - Start with relevant guide above
2. **Troubleshooting Guide** - [Common issues and solutions](./TROUBLESHOOTING.md)
3. **GitHub Issues** - [Search existing issues](https://github.com/KotonoSora/nara-vite-react-boilerplate/issues)
4. **Create Issue** - [Use the issue template](https://github.com/KotonoSora/nara-vite-react-boilerplate/issues/new)

### Before Asking for Help

- [ ] Read the relevant documentation
- [ ] Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [ ] Search existing GitHub issues
- [ ] Try the health check script from [Troubleshooting Guide](./TROUBLESHOOTING.md)

### Issue Template

When creating a new issue, include:

- What you're trying to accomplish
- What documentation you've already read
- Steps to reproduce the issue
- Your environment details (OS, Node version, etc.)
- Error messages or screenshots

---

## 🔄 Documentation Updates

### Contributing to Documentation

- Documentation follows the same contribution process as code
- Create PRs for documentation improvements
- Follow the [Contributing Guidelines](../CONTRIBUTING.md)

### Keeping Documentation Current

- Documentation is updated with each release
- Breaking changes are documented in [Changelog](../CHANGELOG.md)
- Community contributions are welcome and appreciated

---

## 🎯 Next Steps

### New Developers

1. Complete [Developer Onboarding Guide](./DEVELOPER_ONBOARDING.md)
2. Build your first feature using the guides
3. Contribute improvements back to the project

### Experienced Developers

1. Review [Architecture Deep Dive](./ARCHITECTURE.md)
2. Focus on domain-specific guides for your work
3. Help improve documentation for others

### Team Leads

1. Ensure team follows [Contributing Guidelines](../CONTRIBUTING.md)
2. Use guides for onboarding new team members
3. Customize documentation for your team's specific needs

---

**Happy coding!** The NARA boilerplate is designed to help you build faster and with confidence. These guides should provide everything you need to be productive.

---

Built with ❤️ by KotonoSora — to help you ship faster and with confidence.
