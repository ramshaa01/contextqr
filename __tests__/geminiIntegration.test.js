import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as parseSymptomsPOST } from '../app/api/parse-symptoms/route';
import { POST as generateResponsePOST } from '../app/api/generate-response/route';
import { POST as askPOST } from '../app/api/ask/route';
import * as geminiClient from '../lib/geminiClient';

// Mock the gemini client
vi.mock('../lib/geminiClient', () => {
  return {
    callGemini: vi.fn(),
    Type: { ARRAY: 'ARRAY', STRING: 'STRING' }
  };
});

describe('GenAI Integration API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('/api/parse-symptoms', () => {
    it('returns parsed tags when Gemini succeeds with valid JSON', async () => {
      // Mock successful Gemini response
      geminiClient.callGemini.mockResolvedValueOnce(JSON.stringify(['chest pain', 'dizziness']));

      const req = {
        json: vi.fn().mockResolvedValue({ freeTextInput: 'my chest hurts and the room is spinning' })
      };

      const res = await parseSymptomsPOST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.tags).toEqual(['chest pain', 'dizziness']);
      expect(geminiClient.callGemini).toHaveBeenCalledTimes(1);
    });

    it('triggers fallback error response when Gemini returns malformed JSON', async () => {
      // Mock malformed response
      geminiClient.callGemini.mockResolvedValueOnce('I am an AI, here are some tags: chest pain');

      const req = {
        json: vi.fn().mockResolvedValue({ freeTextInput: 'my chest hurts' })
      };

      const res = await parseSymptomsPOST(req);
      const data = await res.json();

      expect(res.status).toBe(500);
      expect(data.error).toBe('Failed to parse symptoms');
      // Ensure the app does not crash, just returns 500 error gracefully
    });

    it('triggers fallback error response when Gemini times out/throws', async () => {
      geminiClient.callGemini.mockRejectedValueOnce(new Error('Gemini API timeout'));

      const req = {
        json: vi.fn().mockResolvedValue({ freeTextInput: 'my chest hurts' })
      };

      const res = await parseSymptomsPOST(req);
      const data = await res.json();

      expect(res.status).toBe(500);
      expect(data.error).toBe('Failed to parse symptoms');
    });
  });

  describe('/api/generate-response', () => {
    it('returns natural language string when Gemini succeeds', async () => {
      geminiClient.callGemini.mockResolvedValueOnce("Welcome! Please head to your gate.");

      const req = {
        json: vi.fn().mockResolvedValue({
          primary: 'Proceed to gate.',
          secondary: ['Have ticket ready.'],
          timeContext: 'pre-match',
          zoneType: 'gate'
        })
      };

      const res = await generateResponsePOST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.text).toBe("Welcome! Please head to your gate.");
    });

    it('triggers fallback error response when Gemini throws', async () => {
      geminiClient.callGemini.mockRejectedValueOnce(new Error('Gemini API timeout'));

      const req = {
        json: vi.fn().mockResolvedValue({
          primary: 'Proceed to gate.',
          secondary: ['Have ticket ready.']
        })
      };

      const res = await generateResponsePOST(req);
      const data = await res.json();

      // Gracefully return 500, client handles fallback to static primary string
      expect(res.status).toBe(500);
      expect(data.error).toBe('Failed to generate response');
    });
  });

  describe('/api/ask', () => {
    it('returns natural language answer when Gemini succeeds', async () => {
      geminiClient.callGemini.mockResolvedValueOnce("The nearest burger stall is at Section 102.");

      const req = {
        json: vi.fn().mockResolvedValue({
          userQuery: 'Where can I get a burger?',
          currentContext: { stalls: [{ name: 'Burger Station', stallId: 's102' }] }
        })
      };

      const res = await askPOST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.text).toBe("The nearest burger stall is at Section 102.");
    });

    it('triggers graceful fallback response when Gemini fails/times out', async () => {
      geminiClient.callGemini.mockRejectedValueOnce(new Error('Gemini API timeout'));

      const req = {
        json: vi.fn().mockResolvedValue({
          userQuery: 'Where can I get a burger?'
        })
      };

      const res = await askPOST(req);
      const data = await res.json();

      expect(res.status).toBe(500);
      expect(data.error).toBe('Failed to process query');
      expect(data.text).toBe("I'm sorry, I'm having trouble connecting to the stadium network right now. Please ask a member of staff for assistance.");
    });
  });
});
