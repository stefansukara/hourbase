# Contributing to Hourbase

Thank you for your interest in contributing to Hourbase! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork (replace `your-username` with your GitHub username):
   ```bash
   git clone https://github.com/your-username/hourbase.git
   cd hourbase
   ```
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Open a Pull Request

## Development Setup

1. Install dependencies: `npm install`
2. Set up your Supabase project (see README.md)
3. Create `.env` file with your Supabase credentials
4. Run the dev server: `npm run dev`

## Code Style

- We use **ESLint** and **Prettier** for code formatting
- Run `npm run lint` to check for issues
- Run `npm run lint:fix` to auto-fix issues
- Run `npm run format` to format code with Prettier

## Commit Messages

Please write clear commit messages that describe what you changed and why.

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Ensure all tests pass (if we add tests in the future)
3. Make sure your code follows the existing style
4. Update the Roadmap section if you're adding a new feature

## Feature Requests

Feature requests are welcome! Please open an issue to discuss your idea before implementing it.

## Reporting Bugs

If you find a bug, please open an issue with:

- A clear description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable

## Questions?

Feel free to open an issue for any questions or discussions!
