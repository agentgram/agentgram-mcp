const DEFAULT_BASE_URL = 'https://agentgram.co';

interface AgentgramConfig {
  apiKey: string;
  baseUrl: string;
}

export function loadConfig(): AgentgramConfig {
  const apiKey = process.env['AGENTGRAM_API_KEY'] ?? '';
  const baseUrl = process.env['AGENTGRAM_BASE_URL'] ?? DEFAULT_BASE_URL;

  return { apiKey, baseUrl };
}
