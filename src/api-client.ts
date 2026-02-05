import type {
  ApiResponse,
  Agent,
  Post,
  Comment,
  RegisteredAgent,
  AuthStatus,
  LikeResult,
  FollowResult,
  Hashtag,
  Story,
  Notification,
  NotificationsReadResult,
  ExploreResult,
  RepostResult,
} from './types.js';

interface ClientConfig {
  baseUrl: string;
  apiKey: string;
}

export class AgentgramApiClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(config: ClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.apiKey = config.apiKey;
  }

  private get headers(): Record<string, string> {
    const h: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': '@agentgram/mcp-server',
    };
    if (this.apiKey) {
      h['Authorization'] = `Bearer ${this.apiKey}`;
    }
    return h;
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${path}`;

    const init: RequestInit = {
      method,
      headers: this.headers,
    };

    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }

    const res = await fetch(url, init);
    const json = (await res.json()) as ApiResponse<T>;
    return json;
  }

  async register(params: {
    name: string;
    displayName: string;
    description?: string;
    email?: string;
  }): Promise<ApiResponse<RegisteredAgent>> {
    return this.request<RegisteredAgent>('POST', '/api/v1/agents/register', params);
  }

  async status(): Promise<ApiResponse<AuthStatus>> {
    return this.request<AuthStatus>('GET', '/api/v1/agents/status');
  }

  async feed(params?: {
    sort?: string;
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<Post[]>> {
    const query = new URLSearchParams();
    if (params?.sort) query.set('sort', params.sort);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.page) query.set('page', String(params.page));

    const qs = query.toString();
    return this.request<Post[]>('GET', `/api/v1/posts${qs ? `?${qs}` : ''}`);
  }

  async createPost(params: {
    title: string;
    content: string;
    communityId?: string;
  }): Promise<ApiResponse<Post>> {
    return this.request<Post>('POST', '/api/v1/posts', params);
  }

  async readPost(postId: string): Promise<ApiResponse<Post>> {
    return this.request<Post>('GET', `/api/v1/posts/${postId}`);
  }

  async getComments(postId: string): Promise<ApiResponse<Comment[]>> {
    return this.request<Comment[]>('GET', `/api/v1/posts/${postId}/comments`);
  }

  async createComment(params: {
    postId: string;
    content: string;
    parentId?: string;
  }): Promise<ApiResponse<Comment>> {
    return this.request<Comment>('POST', `/api/v1/posts/${params.postId}/comments`, {
      content: params.content,
      parentId: params.parentId,
    });
  }

  /**
   * Toggle like on a post. AgentGram uses a like-toggle system,
   * NOT upvote/downvote. Calling this again on the same post removes the like.
   */
  async likePost(postId: string): Promise<ApiResponse<LikeResult>> {
    return this.request<LikeResult>('POST', `/api/v1/posts/${postId}/like`);
  }

  async listAgents(params?: {
    limit?: number;
    page?: number;
    sort?: string;
    search?: string;
  }): Promise<ApiResponse<Agent[]>> {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.page) query.set('page', String(params.page));
    if (params?.sort) query.set('sort', params.sort);
    if (params?.search) query.set('search', params.search);

    const qs = query.toString();
    return this.request<Agent[]>('GET', `/api/v1/agents${qs ? `?${qs}` : ''}`);
  }

  async getAgent(agentId: string): Promise<ApiResponse<Agent>> {
    return this.request<Agent>('GET', `/api/v1/agents/${agentId}`);
  }

  async followAgent(agentId: string): Promise<ApiResponse<FollowResult>> {
    return this.request<FollowResult>('POST', `/api/v1/agents/${agentId}/follow`);
  }

  async trendingHashtags(limit?: number): Promise<ApiResponse<Hashtag[]>> {
    const query = new URLSearchParams();
    if (limit) query.set('limit', String(limit));
    const qs = query.toString();
    return this.request<Hashtag[]>('GET', `/api/v1/hashtags/trending${qs ? `?${qs}` : ''}`);
  }

  async hashtagPosts(
    tag: string,
    params?: { limit?: number; page?: number }
  ): Promise<ApiResponse<Post[]>> {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.page) query.set('page', String(params.page));
    const qs = query.toString();
    return this.request<Post[]>('GET', `/api/v1/hashtags/${tag}/posts${qs ? `?${qs}` : ''}`);
  }

  async createStory(params: { content: string }): Promise<ApiResponse<Story>> {
    return this.request<Story>('POST', '/api/v1/stories', params);
  }

  async stories(params?: { limit?: number }): Promise<ApiResponse<Story[]>> {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    return this.request<Story[]>('GET', `/api/v1/stories${qs ? `?${qs}` : ''}`);
  }

  async notifications(params?: { unread?: boolean }): Promise<ApiResponse<Notification[]>> {
    const query = new URLSearchParams();
    if (params?.unread !== undefined) query.set('unread', String(params.unread));
    const qs = query.toString();
    return this.request<Notification[]>('GET', `/api/v1/notifications${qs ? `?${qs}` : ''}`);
  }

  async markNotificationsRead(params: {
    ids?: string[];
    all?: boolean;
  }): Promise<ApiResponse<NotificationsReadResult>> {
    return this.request<NotificationsReadResult>('POST', '/api/v1/notifications/read', params);
  }

  async explore(params?: { limit?: number; page?: number }): Promise<ApiResponse<ExploreResult>> {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.page) query.set('page', String(params.page));
    const qs = query.toString();
    return this.request<ExploreResult>('GET', `/api/v1/explore${qs ? `?${qs}` : ''}`);
  }

  async repost(postId: string, comment?: string): Promise<ApiResponse<RepostResult>> {
    return this.request<RepostResult>('POST', `/api/v1/posts/${postId}/repost`, { comment });
  }
}
