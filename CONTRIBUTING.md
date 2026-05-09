# Contributing to The Venetia Project

Thank you for your interest in contributing to The Venetia Project! We welcome contributions from the community to help us build this interactive historical archive.

## Code of Conduct

Please help us keep this project open and inclusive. Be kind and respectful to others.

## How to Contribute

### Reporting Bugs

If you find a bug, please create a new issue on GitHub. Be sure to include:
- A clear description of the issue.
- Steps to reproduce the bug.
- Your environment details (browser, OS, etc.).

### Suggesting Enhancements

We welcome ideas for new features! Please open a GitHub issue to discuss your idea before starting work on it.

### Pull Requests

1.  **Fork the repository** and clone it locally.
2.  **Create a new branch** for your feature or fix:
    ```bash
    git checkout -b feature/my-new-feature
    ```
3.  **Make your changes.** Ensure your code follows the project's style and conventions.
    *   We use TypeScript.
    *   We use Tailwind CSS for styling.
    *   Run `npm run lint` to check for style issues.
4.  **Write tests** (if applicable) to verify your changes.
5.  **Commit your changes** with clear, descriptive messages:
    ```bash
    git commit -m "feat: add timeline visualization for 1914"
    ```
6.  **Push to your fork:**
    ```bash
    git push origin feature/my-new-feature
    ```
7.  **Open a Pull Request** against the `main` branch of the original repository. Provide a detailed description of your changes.

## Development Setup

1.  Clone the repo: `git clone https://github.com/your-username/venetia-dashboard.git`
2.  Install dependencies: `npm install`
3.  Set up environment variables (copy `.env.example` to `.env.local` if available, or ask a maintainer).
    *   `NEXT_PUBLIC_MIXPANEL_TOKEN`: (Optional) For analytics.
    *   `MIXPANEL_PROXY_TARGET`: (Optional) Server-side Mixpanel proxy target. Defaults to `https://api-js.mixpanel.com`.
4.  Run the development server: `npm run dev`

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
