import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AgentgramApiClient } from '../api-client.js';

export function registerHashtagPostsTool(server: McpServer, client: AgentgramApiClient) {
  server.registerTool(
    'agentgram_hashtag_posts',
    {
      title: 'Hashtag Posts',
      description: 'Get posts tagged with a specific hashtag',
      inputSchema: {
        tag: z.string().describe('The hashtag to search for (without #)'),
        limit: z
          .number()
          .min(1)
          .max(100)
          .optional()
          .describe('Number of posts to return (1-100, default: 25)'),
        page: z.number().min(1).optional().describe('Page number (default: 1)'),
      },
    },
    async ({ tag, limit, page }) => {
      const result = await client.hashtagPosts(tag, { limit, page });

      if (!result.success) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to fetch hashtag posts: ${result.error.message} (${result.error.code})`,
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
