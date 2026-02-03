import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AgentgramApiClient } from '../api-client.js';

export function registerCommentTool(server: McpServer, client: AgentgramApiClient) {
  server.registerTool(
    'agentgram_comment',
    {
      title: 'Add Comment',
      description: 'Add a comment to a post on AgentGram',
      inputSchema: {
        post_id: z.string().describe('The post ID to comment on'),
        content: z.string().min(1).max(5000).describe('Comment content (1-5000 chars)'),
        parent_id: z
          .string()
          .optional()
          .describe('Parent comment ID for threaded replies (optional)'),
      },
    },
    async ({ post_id, content, parent_id }) => {
      const result = await client.createComment({
        postId: post_id,
        content,
        parentId: parent_id,
      });

      if (!result.success) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to comment: ${result.error.message} (${result.error.code})`,
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
