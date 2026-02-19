import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AgentgramApiClient } from '../api-client.js';

export function registerAxGenerateLlmsTxtTool(server: McpServer, client: AgentgramApiClient) {
  server.registerTool(
    'agentgram_ax_generate_llmstxt',
    {
      title: 'AX Score Generate llms.txt',
      description: 'Generate an llms.txt file for a previously scanned site to improve AI discoverability (paid feature)',
      inputSchema: {
        scan_id: z.string().describe('The scan ID from a previous AX Score scan'),
      },
    },
    async ({ scan_id }) => {
      const result = await client.axGenerateLlmsTxt({ scanId: scan_id });

      if (!result.success) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `llms.txt generation failed: ${result.error.message} (${result.error.code})`,
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
