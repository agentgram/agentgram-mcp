import { describe, expect, it, vi } from 'vitest';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerAgentCardSchemaTool } from './agent-card-schema.js';
import { registerAgentsTool } from './agents.js';

type ToolHandler = (input: Record<string, unknown>) => Promise<{
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}>;

function createMockServer() {
  const tools: Array<{
    name: string;
    config: Record<string, unknown>;
    handler: ToolHandler;
  }> = [];

  const server = {
    registerTool: vi.fn((name, config, handler) => {
      tools.push({
        name,
        config: config as Record<string, unknown>,
        handler: handler as ToolHandler,
      });
    }),
  } as unknown as McpServer;

  return { server, tools };
}

describe('agentgram_agent_card_schema', () => {
  it('registers a schema tool that exposes fields, filters, and a concrete example', async () => {
    const { server, tools } = createMockServer();

    registerAgentCardSchemaTool(server);

    expect(tools).toHaveLength(1);
    expect(tools[0]?.name).toBe('agentgram_agent_card_schema');

    const result = await tools[0]!.handler({});
    const schema = JSON.parse(result.content[0]!.text) as {
      entity: string;
      supportedFilters: Array<{ name: string }>;
      fields: Array<{ name: string }>;
      example: Record<string, unknown>;
    };

    expect(schema.entity).toBe('agent_card');
    expect(schema.supportedFilters.map((filter) => filter.name)).toEqual(
      expect.arrayContaining(['search', 'sort', 'voice', 'group_chat', 'roleplay'])
    );
    expect(schema.fields.map((field) => field.name)).toEqual(
      expect.arrayContaining(['verificationState', 'capabilities', 'workProofUrl'])
    );
    expect(schema.example['capabilities']).toMatchObject({ group_chat: true });
  });
});

describe('agentgram_agents', () => {
  it('normalizes legacy karma sort and forwards capability filters to the API client', async () => {
    const { server, tools } = createMockServer();
    const client = {
      listAgents: vi.fn().mockResolvedValue({
        success: true,
        data: [
          {
            id: 'agent_123',
            name: 'release-bot',
            verificationState: 'verified',
          },
        ],
      }),
    };

    registerAgentsTool(server, client as never);

    const tool = tools.find(({ name }) => name === 'agentgram_agents');
    expect(tool).toBeDefined();

    const result = await tool!.handler({
      limit: 5,
      page: 2,
      sort: 'karma',
      search: 'release',
      voice: true,
      roleplay: true,
    });

    expect(client.listAgents).toHaveBeenCalledWith({
      limit: 5,
      page: 2,
      sort: 'axp',
      search: 'release',
      voice: true,
      roleplay: true,
      group_chat: undefined,
    });

    expect(JSON.parse(result.content[0]!.text)).toEqual([
      {
        id: 'agent_123',
        name: 'release-bot',
        verificationState: 'verified',
      },
    ]);
  });
});
