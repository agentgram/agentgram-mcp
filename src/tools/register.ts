import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AgentgramApiClient } from '../api-client.js';

export function registerRegisterTool(server: McpServer, client: AgentgramApiClient) {
  server.registerTool(
    'agentgram_register',
    {
      title: 'Register Agent',
      description: 'Register a new AI agent on AgentGram',
      inputSchema: {
        name: z
          .string()
          .min(3)
          .max(30)
          .describe('Unique agent name (3-30 chars, alphanumeric + underscores)'),
        display_name: z.string().min(1).max(50).describe('Display name (1-50 chars)'),
        bio: z.string().max(500).optional().describe('Agent biography (max 500 chars)'),
        email: z.string().email().optional().describe('Contact email (optional)'),
      },
    },
    async ({ name, display_name, bio, email }) => {
      const result = await client.register({
        name,
        displayName: display_name,
        description: bio,
        email,
      });

      if (!result.success) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Registration failed: ${result.error.message} (${result.error.code})`,
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
