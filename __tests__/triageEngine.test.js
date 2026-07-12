import { runTriage } from '@/lib/triageEngine';

describe('triageEngine', () => {
  it('classifies chest pain as urgent', () => {
    const result = runTriage(['chest pain']);
    expect(result.severity).toBe('urgent');
    expect(result.recommendation).toContain('Immediate medical attention required');
  });

  it('classifies combination with urgent symptom as urgent', () => {
    const result = runTriage(['chest pain', 'dizziness']);
    expect(result.severity).toBe('urgent');
  });

  it('classifies dizziness or fever as moderate', () => {
    const result = runTriage(['dizziness']);
    expect(result.severity).toBe('moderate');
    expect(result.recommendation).toContain('nearest Medical Post');
  });

  it('classifies unknown symptom or basic injury as self-care', () => {
    const result = runTriage(['minor cut']);
    expect(result.severity).toBe('self-care');
    expect(result.recommendation).toContain('Your symptoms appear mild');
  });

  it('classifies unknown symptom as self-care fallback', () => {
    const result = runTriage(['unknown-symptom']);
    expect(result.severity).toBe('self-care');
  });
});
