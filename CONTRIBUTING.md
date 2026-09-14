# Contributing to PayGate

First off, thank you for considering contributing to PayGate! It's people like you that make open-source such a great community.

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally: `git clone https://github.com/your-username/PayGate.git`
3. **Set up the project**: Follow the instructions in the `README.md` to run the Next.js apps and Soroban smart contracts locally.
4. **Create a branch**: `git checkout -b feature/your-feature-name` or `bugfix/issue-number`.

## Finding Something to Work On
We use labels to help you find issues you can work on:
- `good first issue`: Ideal for beginners or first-time contributors to this repository.
- `help wanted`: Issues where the maintainers need extra hands.
- `Stellar Wave`: Specific issues related to our Stellar and Soroban integration bounty program!

## Submitting Changes

1. Write clean, readable code and ensure it passes linting and formatting.
2. If you add new functionality, try to add tests (especially for smart contracts using `cargo test`).
3. Commit your changes: `git commit -m "feat: description of your feature"` (We follow Conventional Commits).
4. Push to your branch: `git push origin feature/your-feature-name`.
5. Open a **Pull Request** against the `main` branch. Fill out the PR template completely.

## Soroban Smart Contracts
If you are contributing to the `contracts/` directory:
- Ensure you have the `stellar-cli` installed.
- Run `cargo test --workspace` to ensure all tests pass before submitting a PR.
- Document any changes to contract interfaces.

Thank you for contributing to the decentralized AI Agent economy!
