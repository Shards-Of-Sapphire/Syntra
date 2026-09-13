# Contributing to *Syntra*

First off — thank you for taking the time to contribute! 💙

**Syntra** is a Sapphire project, and we welcome contributions that help us build better audience intelligence. This guide outlines how to report bugs, suggest features, and submit code.

---

## Code of Conduct

By participating in this project, you agree to uphold a friendly, respectful, and inclusive environment. Be kind, assume good intent, and keep discussions constructive.

- 🚀 **Innovation First** — propose bold ideas.
- 🤝 **Collaboration** — help others; every strength counts.
- 💡 **Authenticity** — communicate honestly and openly.

---

## How Can I Contribute?

### 🐞 Reporting Bugs

1. Search the [issue tracker](https://github.com/Shards-Of-Sapphire/Syntra/issues) to avoid duplicates.
2. Open an issue with a **clear title** and include:
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots / logs (if any)
   - Environment (OS, Python/Node version)

### 💡 Suggesting Features

1. Open an issue and tag it with the **`enhancement`** label.
2. Describe the problem it solves and your proposed approach.
3. Link it to the relevant **Syntra vector** (Sentiment, Demographics, Trends, or Link Analysis).

---

## Development Setup

```bash
git clone https://github.com/Shards-Of-Sapphire/Syntra.git
cd Syntra
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # fill in credentials
```

### Install dev dependencies for linting and testing:

```bash
pip install ruff pytest pre-commit
pre-commit intall
```

## Branching & Pull Requests

- Fork the repository and clone your fork.
- Create a branch from `main`:

```bash
git checkout -b feat/your-feature-name
```

- Use descriptive prefixes:
  - `feat/` — new feature
  - `fix/` — bug fix
  - `docs/` — documentation
  - `refactor/` — code restructuring
  - `test/` — test additions

- Make your changes with clear, atomic commits.
- Run the checks locally:

```bash
ruff check .
pytest
```

- Push your branch and open a Pull Request against main.
- Describe what you changed and why in the PR description.

## Code Style

- **Python**: follow  PEP 8  with ruff as the formatter/linter.
- **Type hints**: use them where reasonable.
- **Docs strings**: yes, please — concise and purpose-driven.
- **Secrets**: never commit .env, tokens, or credentials.

## License

By contributing, you agree that your contributions will be licensed under the MIT License [blocked].

## Questions?

Reach out to the Sapphire team at  shardsofsapphire.org@gmail.com  or open a  [discussion](https://github.com/Shards-Of-Sapphire/Syntra/discussions)

### Thanks for building with us. ✨
