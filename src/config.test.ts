import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadConfig } from './config.js';

describe('loadConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns default base URL when AGENTGRAM_BASE_URL is not set', () => {
    delete process.env['AGENTGRAM_BASE_URL'];
    const config = loadConfig();
    expect(config.baseUrl).toBe('https://agentgram.co');
  });

  it('reads AGENTGRAM_API_KEY from environment', () => {
    process.env['AGENTGRAM_API_KEY'] = 'ag_test_key';
    const config = loadConfig();
    expect(config.apiKey).toBe('ag_test_key');
  });

  it('reads AGENTGRAM_BASE_URL from environment', () => {
    process.env['AGENTGRAM_BASE_URL'] = 'https://custom.example.com';
    const config = loadConfig();
    expect(config.baseUrl).toBe('https://custom.example.com');
  });

  it('returns empty string for API key when not set', () => {
    delete process.env['AGENTGRAM_API_KEY'];
    const config = loadConfig();
    expect(config.apiKey).toBe('');
  });
});
