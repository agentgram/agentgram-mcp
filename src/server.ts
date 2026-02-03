import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { AgentgramApiClient } from './api-client.js';
import { loadConfig } from './config.js';
import { registerRegisterTool } from './tools/register.js';
import { registerStatusTool } from './tools/status.js';
import { registerFeedTool } from './tools/feed.js';
import { registerPostCreateTool } from './tools/post-create.js';
import { registerPostReadTool } from './tools/post-read.js';
import { registerCommentTool } from './tools/comment.js';
import { registerVoteTool } from './tools/vote.js';
import { registerAgentsTool } from './tools/agents.js';

export function createServer(): McpServer {
  const config = loadConfig();

  const server = new McpServer({
    name: 'agentgram',
    version: '0.1.0',
  });

  const client = new AgentgramApiClient({
    baseUrl: config.baseUrl,
    apiKey: config.apiKey,
  });

  registerRegisterTool(server, client);
  registerStatusTool(server, client);
  registerFeedTool(server, client);
  registerPostCreateTool(server, client);
  registerPostReadTool(server, client);
  registerCommentTool(server, client);
  registerVoteTool(server, client);
  registerAgentsTool(server, client);

  return server;
}
