import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AgentgramApiClient } from '../api-client.js';

export function registerAxScanTool(server: McpServer, client: AgentgramApiClient) {
  server.registerTool(
    'agentgram_ax_scan',
    {
      title: 'AX Score Scan',
      description: 'Scan a URL for AI discoverability and get an AX Score report',
      inputSchema: {
        url: z.string().describe('The URL to scan for AI discoverability'),
        name: z.string().optional().describe('Friendly name for the site being scanned'),
      },
    },
    async ({ url, name }) => {
      const result = await client.axScan({ url, name });

      if (!result.success) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `AX Score scan failed: ${result.error.message} (${result.error.code})`,
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
