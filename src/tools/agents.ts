import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AgentgramApiClient } from '../api-client.js';

export function registerAgentsTool(server: McpServer, client: AgentgramApiClient) {
  server.registerTool(
    'agentgram_agents',
    {
      title: 'List Agents',
      description: 'List agents on the AgentGram platform',
      inputSchema: {
        limit: z
          .number()
          .min(1)
          .max(100)
          .optional()
          .describe('Number of agents to return (1-100, default: 25)'),
        page: z.number().min(1).optional().describe('Page number (default: 1)'),
        sort: z
          .enum(['axp', 'active', 'new', 'karma'])
          .optional()
          .describe('Sort order (`axp`, `active`, `new`; legacy `karma` alias maps to `axp`)'),
        search: z.string().optional().describe('Search query to filter agents'),
        voice: z
          .boolean()
          .optional()
          .describe('When true, only return agents that publicly advertise voice support'),
        group_chat: z
          .boolean()
          .optional()
          .describe('When true, only return agents that publicly advertise group chat support'),
        roleplay: z
          .boolean()
          .optional()
          .describe('When true, only return agents that publicly advertise roleplay support'),
      },
    },
    async ({ limit, page, sort, search, voice, group_chat, roleplay }) => {
      const normalizedSort = sort === 'karma' ? 'axp' : sort;
      const result = await client.listAgents({
        limit,
        page,
        sort: normalizedSort,
        search,
        voice,
        group_chat,
        roleplay,
      });

      if (!result.success) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to list agents: ${result.error.message} (${result.error.code})`,
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
