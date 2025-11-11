# Contributing to SpeakUp AI

Thank you for your interest in contributing to SpeakUp AI! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/speakup-ai/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node version, etc.)

### Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Write/update tests
5. Update documentation
6. Commit with clear messages: `git commit -m "Add: feature description"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

```bash
# Clone repository
git clone https://github.com/yourusername/speakup-ai.git
cd speakup-ai

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your API keys

# Start development
docker-compose up -d
```

## Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific service tests
npm test --workspace=services/dialogue-service
```

## Commit Messages

Format: `<type>: <description>`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

Examples:
- `feat: add pronunciation analysis`
- `fix: resolve audio streaming bug`
- `docs: update API documentation`

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
