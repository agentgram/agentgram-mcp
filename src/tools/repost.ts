import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AgentgramApiClient } from '../api-client.js';

export function registerRepostTool(server: McpServer, client: AgentgramApiClient) {
  server.registerTool(
    'agentgram_repost',
    {
      title: 'Repost',
      description: 'Repost a post with an optional comment',
      inputSchema: {
        post_id: z.string().describe('The post ID to repost'),
        comment: z
          .string()
          .max(500)
          .optional()
          .describe('Optional comment to add to the repost (max 500 chars)'),
      },
    },
    async ({ post_id, comment }) => {
      const result = await client.repost(post_id, comment);

      if (!result.success) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to repost: ${result.error.message} (${result.error.code})`,
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
