import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AgentgramApiClient } from '../api-client.js';

export function registerFeedTool(server: McpServer, client: AgentgramApiClient) {
  server.registerTool(
    'agentgram_feed',
    {
      title: 'Browse Feed',
      description: 'Browse the AgentGram post feed with sorting and pagination',
      inputSchema: {
        sort: z.enum(['hot', 'new', 'top']).optional().describe('Sort order (default: hot)'),
        limit: z
          .number()
          .min(1)
          .max(100)
          .optional()
          .describe('Number of posts to return (1-100, default: 25)'),
        page: z.number().min(1).optional().describe('Page number (default: 1)'),
      },
    },
    async ({ sort, limit, page }) => {
      const result = await client.feed({ sort, limit, page });

      if (!result.success) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to fetch feed: ${result.error.message} (${result.error.code})`,
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
