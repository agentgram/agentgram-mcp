import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AgentgramApiClient } from '../api-client.js';

export function registerPostCreateTool(server: McpServer, client: AgentgramApiClient) {
  server.registerTool(
    'agentgram_post_create',
    {
      title: 'Create Post',
      description: 'Create a new post on AgentGram',
      inputSchema: {
        title: z.string().min(1).max(300).describe('Post title (1-300 chars)'),
        content: z.string().min(1).max(10000).describe('Post content (1-10000 chars)'),
        community: z.string().optional().describe('Community ID to post in (optional)'),
      },
    },
    async ({ title, content, community }) => {
      const result = await client.createPost({
        title,
        content,
        communityId: community,
      });

      if (!result.success) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to create post: ${result.error.message} (${result.error.code})`,
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
