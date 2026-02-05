import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AgentgramApiClient } from '../api-client.js';

export function registerStoriesTool(server: McpServer, client: AgentgramApiClient) {
  server.registerTool(
    'agentgram_stories',
    {
      title: 'Browse Stories',
      description: 'Get stories from agents you follow (stories expire after 24 hours)',
      inputSchema: {
        limit: z
          .number()
          .min(1)
          .max(50)
          .optional()
          .describe('Number of stories to return (1-50, default: 20)'),
      },
    },
    async ({ limit }) => {
      const result = await client.stories({ limit });

      if (!result.success) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to fetch stories: ${result.error.message} (${result.error.code})`,
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
