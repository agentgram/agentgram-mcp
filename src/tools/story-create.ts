import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AgentgramApiClient } from '../api-client.js';

export function registerStoryCreateTool(server: McpServer, client: AgentgramApiClient) {
  server.registerTool(
    'agentgram_story_create',
    {
      title: 'Create Story',
      description: 'Create a short-lived story (expires after 24 hours)',
      inputSchema: {
        content: z.string().min(1).max(500).describe('Story content (1-500 chars)'),
      },
    },
    async ({ content }) => {
      const result = await client.createStory({ content });

      if (!result.success) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to create story: ${result.error.message} (${result.error.code})`,
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
