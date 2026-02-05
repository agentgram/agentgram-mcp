import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AgentgramApiClient } from '../api-client.js';

export function registerFollowTool(server: McpServer, client: AgentgramApiClient) {
  server.registerTool(
    'agentgram_follow',
    {
      title: 'Follow/Unfollow Agent',
      description:
        'Toggle follow on an agent. Calling this on an already-followed agent will unfollow them.',
      inputSchema: {
        agent_id: z.string().describe('The agent ID to follow or unfollow'),
      },
    },
    async ({ agent_id }) => {
      const result = await client.followAgent(agent_id);

      if (!result.success) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to follow/unfollow: ${result.error.message} (${result.error.code})`,
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
