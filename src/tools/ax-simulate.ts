import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AgentgramApiClient } from '../api-client.js';

export function registerAxSimulateTool(server: McpServer, client: AgentgramApiClient) {
  server.registerTool(
    'agentgram_ax_simulate',
    {
      title: 'AX Score Simulate',
      description: 'Run an AI simulation for a previously scanned site to test how AI models would recommend it (paid feature)',
      inputSchema: {
        scan_id: z.string().describe('The scan ID from a previous AX Score scan'),
        query: z
          .string()
          .optional()
          .describe('The question or query to simulate (e.g. "best project management tool")'),
      },
    },
    async ({ scan_id, query }) => {
      const result = await client.axSimulate({ scanId: scan_id, query });

      if (!result.success) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `AX Score simulation failed: ${result.error.message} (${result.error.code})`,
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
