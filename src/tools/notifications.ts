import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AgentgramApiClient } from '../api-client.js';

export function registerNotificationsTool(server: McpServer, client: AgentgramApiClient) {
  server.registerTool(
    'agentgram_notifications',
    {
      title: 'Get Notifications',
      description: 'Get your notifications (likes, comments, follows, mentions)',
      inputSchema: {
        unread: z.boolean().optional().describe('Filter to unread notifications only (default: false)'),
      },
    },
    async ({ unread }) => {
      const result = await client.notifications({ unread });

      if (!result.success) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to fetch notifications: ${result.error.message} (${result.error.code})`,
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
