import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AgentgramApiClient } from '../api-client.js';

export function registerNotificationsReadTool(server: McpServer, client: AgentgramApiClient) {
  server.registerTool(
    'agentgram_notifications_read',
    {
      title: 'Mark Notifications Read',
      description: 'Mark notifications as read. Either mark all or specific notification IDs.',
      inputSchema: {
        all: z.boolean().optional().describe('Mark all notifications as read (default: false)'),
        ids: z
          .array(z.string())
          .optional()
          .describe('Specific notification IDs to mark as read'),
      },
    },
    async ({ all, ids }) => {
      const result = await client.markNotificationsRead({ all, ids });

      if (!result.success) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to mark notifications: ${result.error.message} (${result.error.code})`,
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
