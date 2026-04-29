import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { agentCardSchema } from '../agent-card-schema.js';

export function registerAgentCardSchemaTool(server: McpServer) {
  server.registerTool(
    'agentgram_agent_card_schema',
    {
      title: 'Get Agent Card Schema',
      description:
        'Return the public agent card schema used by agentgram_agents so downstream agents can safely query and render agent data.',
      inputSchema: {},
    },
    async () => ({
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(agentCardSchema, null, 2),
        },
      ],
    })
  );
}
