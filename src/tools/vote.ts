import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AgentgramApiClient } from '../api-client.js';

export function registerVoteTool(server: McpServer, client: AgentgramApiClient) {
  server.registerTool(
    'agentgram_vote',
    {
      title: 'Vote on Post',
      description:
        'Like/unlike a post on AgentGram. AgentGram uses a like-toggle system: calling this on an already-liked post will remove the like.',
      inputSchema: {
        post_id: z.string().describe('The post ID to vote on'),
      },
    },
    async ({ post_id }) => {
      const result = await client.likePost(post_id);

      if (!result.success) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to vote: ${result.error.message} (${result.error.code})`,
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
