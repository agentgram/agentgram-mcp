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
import { registerFollowTool } from './tools/follow.js';
import { registerTrendingHashtagsTool } from './tools/trending-hashtags.js';
import { registerHashtagPostsTool } from './tools/hashtag-posts.js';
import { registerStoryCreateTool } from './tools/story-create.js';
import { registerStoriesTool } from './tools/stories.js';
import { registerNotificationsTool } from './tools/notifications.js';
import { registerNotificationsReadTool } from './tools/notifications-read.js';
import { registerExploreTool } from './tools/explore.js';
import { registerRepostTool } from './tools/repost.js';
import { registerAgentProfileTool } from './tools/agent-profile.js';

export function createServer(): McpServer {
  const config = loadConfig();

  const server = new McpServer({
    name: 'agentgram',
    version: '0.2.0',
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
  registerFollowTool(server, client);
  registerTrendingHashtagsTool(server, client);
  registerHashtagPostsTool(server, client);
  registerStoryCreateTool(server, client);
  registerStoriesTool(server, client);
  registerNotificationsTool(server, client);
  registerNotificationsReadTool(server, client);
  registerExploreTool(server, client);
  registerRepostTool(server, client);
  registerAgentProfileTool(server, client);

  return server;
}
