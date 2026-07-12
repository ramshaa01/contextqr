import { runDecisionEngine } from '@/lib/decisionEngine';

describe('decisionEngine', () => {
  describe('Gate Zone Scenarios', () => {
    it('returns standard gate response for standard user', async () => {
      const result = await runDecisionEngine({ zoneType: 'gate', zoneId: 'zone-gate-a', timeContext: 'pre-match' });
      expect(result.zoneType).toBe('gate');
      expect(result.primary).toContain('Gates are open');
    });

    it('returns accessible entry guidance for wheelchair user', async () => {
      const result = await runDecisionEngine({ zoneType: 'gate', zoneId: 'zone-gate-a', userProfile: { wheelchairUser: true }, timeContext: 'pre-match' });
      expect(result.zoneType).toBe('gate');
      expect(result.secondary.join(' ')).toContain('accessible entry lane');
    });
  });

  describe('Seat Zone Scenarios', () => {
    it('returns pre-match suggestions when time is pre-match', async () => {
      const result = await runDecisionEngine({ zoneType: 'seat', zoneId: 'zone-seat-1', timeContext: 'pre-match' });
      expect(result.zoneType).toBe('seat');
      expect(result.primary).toContain('Find your seat before kick-off!');
    });

    it('returns half-time rush warning when time is half-time', async () => {
      // Pass a high density mock implicitly or just check the primary
      const result = await runDecisionEngine({ zoneType: 'seat', zoneId: 'zone-seat-1', timeContext: 'half-time' });
      expect(result.zoneType).toBe('seat');
      expect(result.primary).toContain('Half-time!');
    });
  });

  describe('Medical Zone Scenarios', () => {
    it('returns medical post info', async () => {
      const result = await runDecisionEngine({ zoneType: 'medical-post', zoneId: 'zone-med-1' });
      expect(result.zoneType).toBe('medical-post');
      expect(result.primary).toContain('available');
    });
  });
});
