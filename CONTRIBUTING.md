# <img src="https://api.iconify.design/mdi:hand-heart.svg?color=%23ef4444" width="32"/> Contributing to ClickShield

First off, thank you for considering contributing to ClickShield! <img src="https://api.iconify.design/mdi:party-popper.svg?color=%23f59e0b" width="20"/> It's people like you that make ClickShield such a great tool.

## <img src="https://api.iconify.design/mdi:book-open-variant.svg?color=%233b82f6" width="24"/> Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
- [Development Setup](#-development-setup)
- [Pull Request Process](#-pull-request-process)
- [Coding Standards](#-coding-standards)
- [Commit Message Guidelines](#-commit-message-guidelines)
- [Issue Guidelines](#-issue-guidelines)

---

## <img src="https://api.iconify.design/mdi:shield-heart.svg?color=%23ef4444" width="24"/> Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [vishal95844@gmail.com](mailto:vishal95844@gmail.com).

### <img src="https://api.iconify.design/mdi:handshake.svg?color=%2310b981" width="20"/> Our Pledge

- <img src="https://api.iconify.design/mdi:account-group.svg?color=%233b82f6" width="16"/> **Be respectful** and inclusive to all contributors
- <img src="https://api.iconify.design/mdi:heart.svg?color=%23ef4444" width="16"/> **Be welcoming** to newcomers and experienced developers alike
- <img src="https://api.iconify.design/mdi:lightbulb-on.svg?color=%23f59e0b" width="16"/> **Accept constructive criticism** gracefully
- <img src="https://api.iconify.design/mdi:target.svg?color=%238b5cf6" width="16"/> **Focus on what's best** for the community

---

## <img src="https://api.iconify.design/mdi:hands-pray.svg?color=%23f59e0b" width="24"/> How Can I Contribute?

### <img src="https://api.iconify.design/mdi:bug.svg?color=%23ef4444" width="20"/> Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**<img src="https://api.iconify.design/mdi:clipboard-check.svg?color=%2310b981" width="18"/> Bug Report Template:**

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 118]
- Node.js version: [e.g., 18.17.0]
- ClickShield version: [e.g., 1.0.0]
```

### <img src="https://api.iconify.design/mdi:lightbulb.svg?color=%23f59e0b" width="20"/> Suggesting Features

We love to receive feature suggestions! Feature requests are tracked as GitHub issues.

**<img src="https://api.iconify.design/mdi:star-shooting.svg?color=%238b5cf6" width="18"/> Feature Request Template:**

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request.
```

### <img src="https://api.iconify.design/mdi:code-braces.svg?color=%233b82f6" width="20"/> Contributing Code

Want to contribute code? Awesome! <img src="https://api.iconify.design/mdi:fire.svg?color=%23ef4444" width="16"/>

**Areas we'd love help with:**
- <img src="https://api.iconify.design/mdi:bug-check.svg?color=%2310b981" width="16"/> Fixing bugs
- <img src="https://api.iconify.design/mdi:feature-search.svg?color=%233b82f6" width="16"/> Adding new features
- <img src="https://api.iconify.design/mdi:text-box-check.svg?color=%23f59e0b" width="16"/> Improving documentation
- <img src="https://api.iconify.design/mdi:test-tube.svg?color=%238b5cf6" width="16"/> Writing tests
- <img src="https://api.iconify.design/mdi:chart-line.svg?color=%2310b981" width="16"/> Performance improvements
- <img src="https://api.iconify.design/mdi:translate.svg?color=%23ef4444" width="16"/> Translations/i18n

---

## <img src="https://api.iconify.design/mdi:cog.svg?color=%233b82f6" width="24"/> Development Setup

### <img src="https://api.iconify.design/mdi:check-decagram.svg?color=%2310b981" width="20"/> Prerequisites

- <img src="https://api.iconify.design/logos:nodejs-icon.svg" width="16"/> **Node.js** 18+ installed
- <img src="https://api.iconify.design/mdi:git.svg?color=%23f59e0b" width="16"/> **Git** installed
- <img src="https://api.iconify.design/mdi:key.svg?color=%23ef4444" width="16"/> **Google Safe Browsing API Key**

### <img src="https://api.iconify.design/mdi:rocket-launch.svg?color=%23f59e0b" width="20"/> Getting Started

1. **<img src="https://api.iconify.design/mdi:source-fork.svg?color=%233b82f6" width="16"/> Fork the repository** on GitHub

2. **<img src="https://api.iconify.design/mdi:download-cloud.svg?color=%2310b981" width="16"/> Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ClickShield.git
   cd ClickShield
   ```

3. **<img src="https://api.iconify.design/mdi:link-variant.svg?color=%238b5cf6" width="16"/> Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/tbhvishal/ClickShield.git
   ```

4. **<img src="https://api.iconify.design/mdi:file-document-edit.svg?color=%23f59e0b" width="16"/> Create `.env` file:**
   ```bash
   cp .env.example .env
   # Edit .env and add your API key
   ```

5. **<img src="https://api.iconify.design/mdi:package-down.svg?color=%23ef4444" width="16"/> Install dependencies:**
   ```bash
   npm run install:all
   ```

6. **<img src="https://api.iconify.design/mdi:check-circle.svg?color=%2310b981" width="16"/> Verify setup:**
   ```bash
   npm run verify
   ```

7. **<img src="https://api.iconify.design/mdi:play-circle.svg?color=%233b82f6" width="16"/> Start development servers:**
   ```bash
   npm start
   ```

---

## <img src="https://api.iconify.design/mdi:source-pull.svg?color=%2310b981" width="24"/> Pull Request Process

### <img src="https://api.iconify.design/mdi:source-branch.svg?color=%233b82f6" width="20"/> Creating a Pull Request

1. **<img src="https://api.iconify.design/mdi:source-branch-plus.svg?color=%23f59e0b" width="16"/> Create a new branch:**
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/bug-name
   ```

2. **<img src="https://api.iconify.design/mdi:pencil.svg?color=%238b5cf6" width="16"/> Make your changes** following our [coding standards](#-coding-standards)

3. **<img src="https://api.iconify.design/mdi:test-tube.svg?color=%2310b981" width="16"/> Test your changes:**
   ```bash
   npm run build
   npm start
   # Test thoroughly in browser
   ```

4. **<img src="https://api.iconify.design/mdi:content-save.svg?color=%23ef4444" width="16"/> Commit your changes** with a clear message (see [commit guidelines](#-commit-message-guidelines))

5. **<img src="https://api.iconify.design/mdi:upload.svg?color=%233b82f6" width="16"/> Push to your fork:**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **<img src="https://api.iconify.design/mdi:source-pull.svg?color=%2310b981" width="16"/> Open a Pull Request** on GitHub

### <img src="https://api.iconify.design/mdi:clipboard-text.svg?color=%23f59e0b" width="20"/> Pull Request Checklist

Before submitting your PR, make sure:

- <img src="https://api.iconify.design/mdi:check-box-outline.svg?color=%2310b981" width="16"/> **Code builds successfully** without errors
- <img src="https://api.iconify.design/mdi:check-box-outline.svg?color=%2310b981" width="16"/> **All tests pass** (if applicable)
- <img src="https://api.iconify.design/mdi:check-box-outline.svg?color=%2310b981" width="16"/> **Code follows** our coding standards
- <img src="https://api.iconify.design/mdi:check-box-outline.svg?color=%2310b981" width="16"/> **Commit messages** follow our guidelines
- <img src="https://api.iconify.design/mdi:check-box-outline.svg?color=%2310b981" width="16"/> **Documentation updated** if needed
- <img src="https://api.iconify.design/mdi:check-box-outline.svg?color=%2310b981" width="16"/> **No console errors** or warnings
- <img src="https://api.iconify.design/mdi:check-box-outline.svg?color=%2310b981" width="16"/> **Tested on multiple browsers** (Chrome, Firefox, Safari)

---

## <img src="https://api.iconify.design/mdi:code-tags.svg?color=%238b5cf6" width="24"/> Coding Standards

### <img src="https://api.iconify.design/logos:typescript-icon.svg" width="20"/> TypeScript

- <img src="https://api.iconify.design/mdi:checkbox-marked.svg?color=%2310b981" width="16"/> Use **TypeScript** for all new files
- <img src="https://api.iconify.design/mdi:checkbox-marked.svg?color=%2310b981" width="16"/> Define proper **types/interfaces** (avoid `any`)
- <img src="https://api.iconify.design/mdi:checkbox-marked.svg?color=%2310b981" width="16"/> Use **strict mode** TypeScript configuration

### <img src="https://api.iconify.design/logos:react.svg" width="20"/> React

- <img src="https://api.iconify.design/mdi:checkbox-marked.svg?color=%233b82f6" width="16"/> Use **functional components** with hooks
- <img src="https://api.iconify.design/mdi:checkbox-marked.svg?color=%233b82f6" width="16"/> Follow **React best practices** (single responsibility, composition)
- <img src="https://api.iconify.design/mdi:checkbox-marked.svg?color=%233b82f6" width="16"/> Use **meaningful component names** (PascalCase)

### <img src="https://api.iconify.design/mdi:format-text.svg?color=%23f59e0b" width="20"/> Code Style

- <img src="https://api.iconify.design/mdi:checkbox-marked.svg?color=%23ef4444" width="16"/> Use **2 spaces** for indentation
- <img src="https://api.iconify.design/mdi:checkbox-marked.svg?color=%23ef4444" width="16"/> Use **single quotes** for strings
- <img src="https://api.iconify.design/mdi:checkbox-marked.svg?color=%23ef4444" width="16"/> Add **semicolons** at end of statements
- <img src="https://api.iconify.design/mdi:checkbox-marked.svg?color=%23ef4444" width="16"/> Follow **ESLint rules** configured in the project
- <img src="https://api.iconify.design/mdi:checkbox-marked.svg?color=%23ef4444" width="16"/> Write **clear, descriptive variable names**

### <img src="https://api.iconify.design/mdi:comment-text.svg?color=%2310b981" width="20"/> Comments

- <img src="https://api.iconify.design/mdi:checkbox-marked.svg?color=%238b5cf6" width="16"/> Add comments for **complex logic**
- <img src="https://api.iconify.design/mdi:checkbox-marked.svg?color=%238b5cf6" width="16"/> Use **JSDoc** for function documentation
- <img src="https://api.iconify.design/mdi:checkbox-marked.svg?color=%238b5cf6" width="16"/> Keep comments **up-to-date** with code changes

### <img src="https://api.iconify.design/mdi:folder-open.svg?color=%233b82f6" width="20"/> File Organization

```
src/
├── components/          # React components
│   ├── ComponentName.tsx
│   └── index.ts        # Barrel exports
├── utils/              # Utility functions
├── types/              # TypeScript types/interfaces
└── assets/             # Static assets
```

---

## <img src="https://api.iconify.design/mdi:message-text.svg?color=%23f59e0b" width="24"/> Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### <img src="https://api.iconify.design/mdi:format-header-pound.svg?color=%233b82f6" width="20"/> Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### <img src="https://api.iconify.design/mdi:tag-multiple.svg?color=%2310b981" width="20"/> Types

- <img src="https://api.iconify.design/mdi:plus-circle.svg?color=%2310b981" width="16"/> **feat**: New feature
- <img src="https://api.iconify.design/mdi:bug.svg?color=%23ef4444" width="16"/> **fix**: Bug fix
- <img src="https://api.iconify.design/mdi:file-document.svg?color=%233b82f6" width="16"/> **docs**: Documentation changes
- <img src="https://api.iconify.design/mdi:palette.svg?color=%23f59e0b" width="16"/> **style**: Code style changes (formatting, semicolons, etc.)
- <img src="https://api.iconify.design/mdi:recycle.svg?color=%238b5cf6" width="16"/> **refactor**: Code refactoring
- <img src="https://api.iconify.design/mdi:speedometer.svg?color=%2310b981" width="16"/> **perf**: Performance improvements
- <img src="https://api.iconify.design/mdi:test-tube.svg?color=%23ef4444" width="16"/> **test**: Adding or updating tests
- <img src="https://api.iconify.design/mdi:tools.svg?color=%236b7280" width="16"/> **chore**: Maintenance tasks
- <img src="https://api.iconify.design/mdi:cog.svg?color=%233b82f6" width="16"/> **build**: Build system changes
- <img src="https://api.iconify.design/mdi:robot.svg?color=%23f59e0b" width="16"/> **ci**: CI/CD changes

### <img src="https://api.iconify.design/mdi:lightbulb-on.svg?color=%23f59e0b" width="20"/> Examples

```bash
# Good commit messages
feat(ui): add dark mode toggle button
fix(api): resolve CORS issue with Safe Browsing API
docs(readme): update installation instructions
refactor(components): simplify ResultCard component logic
perf(frontend): optimize image loading with lazy loading

# Bad commit messages
fix stuff
update code
changes
asdfasdf
```

---

## <img src="https://api.iconify.design/mdi:alert-circle.svg?color=%23ef4444" width="24"/> Issue Guidelines

### <img src="https://api.iconify.design/mdi:magnify.svg?color=%233b82f6" width="20"/> Before Creating an Issue

- <img src="https://api.iconify.design/mdi:checkbox-marked-circle.svg?color=%2310b981" width="16"/> **Search existing issues** to avoid duplicates
- <img src="https://api.iconify.design/mdi:checkbox-marked-circle.svg?color=%2310b981" width="16"/> **Check documentation** to see if it's already covered
- <img src="https://api.iconify.design/mdi:checkbox-marked-circle.svg?color=%2310b981" width="16"/> **Try the latest version** to see if it's fixed

### <img src="https://api.iconify.design/mdi:pen.svg?color=%23f59e0b" width="20"/> Writing Good Issues

- <img src="https://api.iconify.design/mdi:text-subject.svg?color=%238b5cf6" width="16"/> **Clear title** describing the problem/feature
- <img src="https://api.iconify.design/mdi:text-long.svg?color=%233b82f6" width="16"/> **Detailed description** with context
- <img src="https://api.iconify.design/mdi:stairs.svg?color=%2310b981" width="16"/> **Steps to reproduce** (for bugs)
- <img src="https://api.iconify.design/mdi:image.svg?color=%23ef4444" width="16"/> **Screenshots/GIFs** when relevant
- <img src="https://api.iconify.design/mdi:information.svg?color=%23f59e0b" width="16"/> **Environment details** (OS, browser, versions)

---

## <img src="https://api.iconify.design/mdi:help-circle.svg?color=%233b82f6" width="24"/> Questions?

- <img src="https://api.iconify.design/mdi:forum.svg?color=%2310b981" width="18"/> **GitHub Discussions**: [Start a discussion](https://github.com/tbhvishal/ClickShield/discussions)
- <img src="https://api.iconify.design/mdi:bug-outline.svg?color=%23ef4444" width="18"/> **GitHub Issues**: [Report bugs or request features](https://github.com/tbhvishal/ClickShield/issues)
- <img src="https://api.iconify.design/mdi:email.svg?color=%23f59e0b" width="18"/> **Email**: [vishal95844@gmail.com](mailto:vishal95844@gmail.com)

---

## <img src="https://api.iconify.design/mdi:trophy.svg?color=%23f59e0b" width="24"/> Recognition

Contributors who make significant contributions will be:

- <img src="https://api.iconify.design/mdi:star.svg?color=%23f59e0b" width="16"/> Listed in our **Contributors** section
- <img src="https://api.iconify.design/mdi:trophy-variant.svg?color=%23ef4444" width="16"/> Mentioned in **release notes**
- <img src="https://api.iconify.design/mdi:medal.svg?color=%2310b981" width="16"/> Credited in the **README**

---

<div align="center">
  <p><strong><img src="https://api.iconify.design/mdi:heart.svg?color=%23ef4444" width="20"/> Thank you for contributing to ClickShield! <img src="https://api.iconify.design/mdi:heart.svg?color=%23ef4444" width="20"/></strong></p>
  <p><em>Together, we're making the internet a safer place!</em></p>
  <img src="https://api.iconify.design/mdi:shield-check.svg?color=%2310b981" width="48"/>
</div>
