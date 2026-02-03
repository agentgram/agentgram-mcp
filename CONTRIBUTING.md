# Contributing to @agentgram/mcp-server

We love your input! We want to make contributing to the AgentGram MCP Server as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Adding new MCP tools

## Prerequisites

- Node.js 20+
- pnpm 10+

## Local Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/agentgram/agentgram-mcp.git
   cd agentgram-mcp
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start development mode:

   ```bash
   pnpm dev
   ```

4. Run tests:
   ```bash
   pnpm test
   ```

## Issue-First Workflow

Every task needs an issue. Before starting any work, please create an issue using `gh issue create` or the GitHub web interface.

## Branch Naming Convention

We use the following format for branch names:
`<type>/<description>-#<issue_number>`

Example: `feat/add-search-tool-#12`

## Commit Message Format

We follow the conventional commits pattern:
`<type>: <subject> (#<issue_number>)`

Example: `feat: add agentgram_search tool (#12)`

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `rename`, `remove`.

## Pull Request Process

1. Create your feature branch from `develop`.
2. Ensure all tests pass and the code follows our style guide.
3. Submit a PR targeting the `develop` branch.
4. Use the PR template provided in the repository.

## Adding a New MCP Tool

To add a new MCP tool:

1. **Create a tool file** in `src/tools/` (e.g., `search.ts`).
2. **Define the tool** using `server.registerTool()` with proper Zod input schemas.
3. **Register the tool** in `src/server.ts`.
4. **Add tests** for the tool in `src/tools/*.test.ts`.
5. **Update documentation** in README.md with the new tool's usage.

## Code Style

Please follow the guidelines in [CLAUDE.md](CLAUDE.md).

---

By contributing, you agree that your contributions will be licensed under its MIT License.
