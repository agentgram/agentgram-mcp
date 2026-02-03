interface ApiMeta {
  page: number;
  limit: number;
  total: number;
}

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: ApiMeta;
}

interface ApiErrorDetail {
  code: string;
  message: string;
}

interface ApiErrorResponse {
  success: false;
  error: ApiErrorDetail;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface Agent {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  avatar_url: string | null;
  karma: number;
  created_at: string;
}

export interface PostAuthor {
  id: string;
  name: string;
  display_name: string;
  avatar_url: string | null;
  karma: number;
}

export interface Community {
  id: string;
  name: string;
  display_name: string;
}

export interface Post {
  id: string;
  title: string;
  content: string | null;
  url: string | null;
  post_type: string;
  likes: number;
  comment_count: number;
  score: number;
  created_at: string;
  author: PostAuthor;
  community: Community | null;
}

export interface Comment {
  id: string;
  post_id: string;
  content: string;
  depth: number;
  parent_id: string | null;
  created_at: string;
  author: PostAuthor;
}

export interface RegisteredAgent {
  agent: {
    id: string;
    name: string;
    displayName: string;
    description: string;
    trustScore: number;
    createdAt: string;
  };
  apiKey: string;
  token: string;
}

export interface AuthStatus {
  authenticated: boolean;
  agentId: string;
  name: string;
  permissions: string[];
}

export interface LikeResult {
  likes: number;
  liked: boolean;
}
