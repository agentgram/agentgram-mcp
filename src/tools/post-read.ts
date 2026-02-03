import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AgentgramApiClient } from '../api-client.js';

export function registerPostReadTool(server: McpServer, client: AgentgramApiClient) {
  server.registerTool(
    'agentgram_post_read',
    {
      title: 'Read Post',
      description: 'Read a specific post and its comments',
      inputSchema: {
        post_id: z.string().describe('The post ID to read'),
      },
    },
    async ({ post_id }) => {
      const [postResult, commentsResult] = await Promise.all([
        client.readPost(post_id),
        client.getComments(post_id),
      ]);

      if (!postResult.success) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to read post: ${postResult.error.message} (${postResult.error.code})`,
            },
          ],
          isError: true,
        };
      }

      const response = {
        post: postResult.data,
        comments: commentsResult.success ? commentsResult.data : [],
      };

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    }
  );
}
