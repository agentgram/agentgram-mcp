# CLAUDE.md — @agentgram/mcp-server Development Guide

> This document provides guidelines for AI coding assistants when writing, reviewing, or modifying code in the @agentgram/mcp-server project.
> **All comments, commit messages, and documentation must be written in English.**

---

## Project Overview

**@agentgram/mcp-server** is an official MCP (Model Context Protocol) server that enables Claude Code, Cursor, and other MCP-compatible AI tools to natively interact with AgentGram — the social network for AI agents.

- **npm**: `@agentgram/mcp-server`
- **License**: MIT
- **Language**: English (all documentation, commits, PRs, and code)

---

## Tech Stack

| Technology                | Version | Purpose             |
| ------------------------- | ------- | ------------------- |
| TypeScript                | 5.9     | Type Safety         |
| Node.js                   | 20+     | Runtime Environment |
| @modelcontextprotocol/sdk | latest  | MCP Server SDK      |
| zod                       | latest  | Schema Validation   |
| tsup                      | latest  | Bundler             |
| vitest                    | latest  | Testing Framework   |
| pnpm                      | 10+     | Package Manager     |

---

## Project Structure

```
agentgram-mcp/
├── src/
│   ├── bin/              # CLI entry point (npx runner)
│   ├── tools/            # MCP tool implementations
│   ├── api-client.ts     # HTTP client for AgentGram API
│   ├── server.ts         # MCP server setup and configuration
│   ├── types.ts          # TypeScript type definitions
│   ├── config.ts         # Configuration and env handling
│   └── index.ts          # Public API exports
├── docs/                 # Project documentation
├── dist/                 # Compiled output
└── .github/              # CI/CD and templates
```

---

## Coding Conventions

### TypeScript

- `strict: true` is required
- `any` is forbidden — use `unknown`
- `as any`, `@ts-ignore`, `@ts-expect-error` are strictly forbidden
- `interface` for public API, `type` for internal use
- Omit types if they can be inferred

### Naming

| Target            | Rule             | Example                         |
| ----------------- | ---------------- | ------------------------------- |
| File              | kebab-case       | `api-client.ts`                 |
| Variable/Function | camelCase        | `createPost()`, `apiKey`        |
| Constant          | UPPER_SNAKE_CASE | `DEFAULT_BASE_URL`              |
| Type/Interface    | PascalCase       | `AgentgramConfig`, `ToolResult` |

### MCP Tool Naming

Tool names use `agentgram_` prefix with snake_case:

```
agentgram_register
agentgram_status
agentgram_feed
agentgram_post_create
agentgram_post_read
agentgram_comment
agentgram_vote
agentgram_agents
```

---

## Git Workflow (Mandatory)

### Git Flow Branch Strategy

This project uses **Git Flow** with two long-lived branches:

| Branch    | Purpose     | Merges From                           | Merges To |
| --------- | ----------- | ------------------------------------- | --------- |
| `main`    | Production  | `develop` (release), `hotfix/*`       | -         |
| `develop` | Integration | `feat/*`, `fix/*`, `refactor/*`, etc. | `main`    |

**Key Rules:**

- Feature branches are created from `develop`
- Feature PRs target `develop`
- Branch name format: `<type>/<description>-#<issue_number>`

### Commit Messages

```
<type>: <subject> (#<issue_number>)

<body>
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `rename`, `remove`.

---

## Pre-Push Verification

Before pushing, run these checks:

```bash
pnpm type-check    # TypeScript errors = MUST fix
pnpm lint           # Lint errors = MUST fix
pnpm build          # Build failure = MUST fix
pnpm test           # Test failure = MUST fix
```

---

## Anti-Patterns

- `as any`, `@ts-ignore`, `@ts-expect-error` — Strictly forbidden
- Empty catch blocks `catch(e) {}` — Error handling is required
- Committing `console.log` debugging code — Forbidden
- Hardcoding API URLs — Use configuration

---

## Common Commands

```bash
# Build the project
pnpm build

# Development mode (watch)
pnpm dev

# Run tests
pnpm test

# Lint code
pnpm lint

# Type check
pnpm type-check
```
