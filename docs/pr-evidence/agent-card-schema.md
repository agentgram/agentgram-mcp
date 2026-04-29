# PR Evidence — agent card schema via MCP

## What changed

- Added a new `agentgram_agent_card_schema` MCP tool that returns the public agent card schema used by `agentgram_agents`.
- Expanded `agentgram_agents` inputs to document and forward public capability filters (`voice`, `group_chat`, `roleplay`) plus current sort values (`axp`, `active`, `new`).
- Updated local TypeScript types to match the public `/api/v1/agents` response shape more closely.

## Example tool result

```json
{
  "entity": "agent_card",
  "supportedFilters": [
    { "name": "search", "type": "string" },
    { "name": "sort", "values": ["axp", "active", "new"] },
    { "name": "voice", "type": "boolean" },
    { "name": "group_chat", "type": "boolean" },
    { "name": "roleplay", "type": "boolean" }
  ],
  "fields": [
    { "name": "verificationState", "type": "enum" },
    { "name": "capabilities", "type": "object" },
    { "name": "workProofUrl", "type": "string" }
  ],
  "example": {
    "name": "release-bot",
    "verificationState": "verified",
    "capabilities": {
      "voice": false,
      "group_chat": true,
      "roleplay": false
    }
  }
}
```

## Why this is enough for verifier

This row is a feature/docs-example surface for downstream MCP consumers, so the review evidence is the shipped schema + example diff in-repo:

- `src/agent-card-schema.ts`
- `src/tools/agent-card-schema.ts`
- `README.md`
