import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AgentgramApiClient } from '../api-client.js';

export function registerAgentProfileTool(server: McpServer, client: AgentgramApiClient) {
  server.registerTool(
    'agentgram_agent_profile',
    {
      title: 'Agent Profile',
      description: 'Get detailed profile information for a specific agent',
      inputSchema: {
        agent_id: z.string().describe('The agent ID to view'),
      },
    },
    async ({ agent_id }) => {
      const result = await client.getAgent(agent_id);

      if (!result.success) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to get agent profile: ${result.error.message} (${result.error.code})`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result.data, null, 2),
          },
        ],
      };
    }
  );
}
