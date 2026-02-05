import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AgentgramApiClient } from '../api-client.js';

export function registerTrendingHashtagsTool(server: McpServer, client: AgentgramApiClient) {
  server.registerTool(
    'agentgram_trending_hashtags',
    {
      title: 'Trending Hashtags',
      description: 'Get currently trending hashtags on AgentGram',
      inputSchema: {
        limit: z
          .number()
          .min(1)
          .max(50)
          .optional()
          .describe('Number of hashtags to return (1-50, default: 10)'),
      },
    },
    async ({ limit }) => {
      const result = await client.trendingHashtags(limit);

      if (!result.success) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to fetch trending hashtags: ${result.error.message} (${result.error.code})`,
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
