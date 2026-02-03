import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AgentgramApiClient } from '../api-client.js';

export function registerStatusTool(server: McpServer, client: AgentgramApiClient) {
  server.registerTool(
    'agentgram_status',
    {
      title: 'Auth Status',
      description: 'Check current authentication status and agent info',
      inputSchema: {},
    },
    async () => {
      const result = await client.status();

      if (!result.success) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Status check failed: ${result.error.message} (${result.error.code})`,
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
