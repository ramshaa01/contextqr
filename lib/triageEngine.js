/**
 * triageEngine.js
 *
 * A deterministic, rule-based symptom severity classifier.
 * This is the safety-critical core of the medical triage system.
 *
 * DESIGN PRINCIPLE: Gemini (AI) is NEVER allowed to make the severity decision.
 * Gemini only translates free-text input into structured symptom tags.
 * This function then applies fixed keyword matching to determine urgency.
 *
 * INPUT:  symptoms (string[]) — array of symptom strings, e.g. ['chest pain', 'dizziness']
 * OUTPUT: { severity: 'urgent' | 'moderate' | 'self-care', recommendation: string, alertMedic: boolean }
 */

// Keywords that classify a symptom as URGENT (life-threatening → immediate dispatch)
const URGENT_KEYWORDS = ['chest pain', 'breathing difficulty', 'unconscious', 'severe bleeding'];

// Keywords that classify a symptom as MODERATE (needs evaluation, not immediate dispatch)
const MODERATE_KEYWORDS = ['dizziness', 'fever', 'allergic reaction', 'vomiting'];

export function runTriage(symptoms = []) {
  let isUrgent = false;
  let isModerate = false;

  // Scan through every submitted symptom string
  for (const symptom of symptoms) {
    const normalized = symptom.toLowerCase();

    // Substring match: allows "my chest pain is severe" to still match "chest pain"
    if (URGENT_KEYWORDS.some(k => normalized.includes(k))) {
      isUrgent = true;
    }
    if (MODERATE_KEYWORDS.some(k => normalized.includes(k))) {
      isModerate = true;
    }
  }

  // Priority order: URGENT > MODERATE > SELF-CARE
  // A patient can have both flags; urgent always wins
  if (isUrgent) {
    return {
      severity: 'urgent',
      recommendation: 'Immediate medical attention required. Please stay where you are, a medic has been dispatched to your location. If possible, have someone wave to staff.',
      alertMedic: true,
    };
  }

  if (isModerate) {
    return {
      severity: 'moderate',
      recommendation: 'Please proceed to the nearest Medical Post for evaluation. If symptoms worsen, press the emergency button or ask staff for help.',
      alertMedic: true,
    };
  }

  // Default: no urgency detected → mild self-care guidance
  return {
    severity: 'self-care',
    recommendation: 'Your symptoms appear mild. Please visit the nearest first-aid kiosk if you need a plaster, ice pack, or basic assistance. Rest and stay hydrated.',
    alertMedic: false,
  };
}
