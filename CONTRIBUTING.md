# 🤝 Contributing to PKM Frontend

Thank you for your interest in contributing to the PKM Frontend project! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors:

- Be respectful and inclusive
- Use welcoming and inclusive language
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/pkm-frontend.git
   cd pkm-frontend
   ```
3. Add the original repository as upstream:
   ```bash
   git remote add upstream https://github.com/original-owner/pkm-frontend.git
   ```

## 🛠️ Development Setup

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Environment Configuration

Create a `.env` file with the following variables:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=PKM Community
VITE_DEBUG_MODE=true
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components
│   ├── admin/          # Admin-specific components
│   └── ui/             # Base UI components
├── routes/             # Route protection components
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   ├── auth/           # Authentication pages
│   └── user/           # User pages
├── layouts/            # Layout components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript definitions
├── utils/              # Utility functions
├── lib/                # Library configurations
└── css/                # Global styles
```

## 📝 Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Define interfaces for all props and data structures
- Use type assertions sparingly
- Prefer `interface` over `type` for object shapes

### React

- Use functional components with hooks
- Use TypeScript for all components
- Follow React best practices
- Use proper prop validation

### Styling

- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Use consistent spacing and colors
- Maintain design system consistency

### File Naming

- **Components**: `PascalCase.tsx`
- **Pages**: `kebab-case.tsx`
- **Hooks**: `camelCase.ts`
- **Services**: `camelCase.service.ts`
- **Types**: `camelCase.types.ts`

### Code Organization

- One component per file
- Export components as default
- Use named exports for utilities
- Group related functionality together

## 📝 Commit Guidelines

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(auth): add login form validation
fix(payment): resolve payment status update issue
docs(readme): update installation instructions
style(components): improve button component styling
refactor(api): simplify user service methods
test(utils): add tests for date formatting
chore(deps): update dependencies
```

## 🔄 Pull Request Process

### Before Submitting

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following coding standards

3. **Test your changes**:
   ```bash
   npm run lint
   npm run type-check
   npm run build
   ```

4. **Commit your changes** with descriptive messages

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

### Pull Request Guidelines

- **Clear title**: Describe what the PR does
- **Detailed description**: Explain changes and motivation
- **Link issues**: Reference related issues
- **Screenshots**: Include UI changes if applicable
- **Testing**: Describe how you tested the changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🐛 Issue Reporting

### Bug Reports

When reporting bugs, include:

- **Clear title**: Brief description of the issue
- **Steps to reproduce**: Detailed steps to recreate the bug
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: Browser, OS, Node.js version
- **Screenshots**: If applicable

### Feature Requests

For feature requests, include:

- **Clear title**: Brief description of the feature
- **Use case**: Why this feature is needed
- **Proposed solution**: How you think it should work
- **Alternatives**: Other solutions considered

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write tests for new features
- Test edge cases and error conditions
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Arrange
    const props = { /* test props */ };
    
    // Act
    render(<ComponentName {...props} />);
    
    // Assert
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for complex functions
- Document component props and usage
- Include examples in component documentation
- Keep README files updated

### Documentation Standards

- Use clear, concise language
- Include code examples
- Keep documentation up to date
- Use proper markdown formatting

## 🔧 Development Tools

### Recommended VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Auto Rename Tag
- Bracket Pair Colorizer

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 🚀 Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] Update version in package.json
- [ ] Update CHANGELOG.md
- [ ] Run full test suite
- [ ] Build production bundle
- [ ] Create release notes
- [ ] Tag release in Git

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and discussions
- **Pull Requests**: Code reviews and feedback

### Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

## 🎉 Recognition

Contributors will be recognized in:

- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing to PKM Frontend! 🚀
