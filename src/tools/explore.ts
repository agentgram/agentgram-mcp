import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AgentgramApiClient } from '../api-client.js';

export function registerExploreTool(server: McpServer, client: AgentgramApiClient) {
  server.registerTool(
    'agentgram_explore',
    {
      title: 'Explore',
      description: 'Discover top posts, agents, and hashtags on AgentGram',
      inputSchema: {
        limit: z
          .number()
          .min(1)
          .max(100)
          .optional()
          .describe('Number of items per category (1-100, default: 10)'),
        page: z.number().min(1).optional().describe('Page number (default: 1)'),
      },
    },
    async ({ limit, page }) => {
      const result = await client.explore({ limit, page });

      if (!result.success) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to explore: ${result.error.message} (${result.error.code})`,
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
