/**
 * triageEngine.js
 * 
 * Simple symptom-severity decision tree.
 * 
 * INPUT: symptoms (array of strings)
 * OUTPUT: { severity: 'urgent' | 'moderate' | 'self-care', recommendation, alertMedic: boolean }
 */

export function runTriage(symptoms = []) {
  const urgentKeywords = ['chest pain', 'breathing difficulty', 'unconscious', 'severe bleeding'];
  const moderateKeywords = ['dizziness', 'fever', 'allergic reaction', 'vomiting'];
  
  let isUrgent = false;
  let isModerate = false;

  for (const symptom of symptoms) {
    if (urgentKeywords.some(k => symptom.toLowerCase().includes(k))) {
      isUrgent = true;
    }
    if (moderateKeywords.some(k => symptom.toLowerCase().includes(k))) {
      isModerate = true;
    }
  }

  if (isUrgent) {
    return {
      severity: 'urgent',
      recommendation: 'Immediate medical attention required. Please stay where you are, a medic has been dispatched to your location. If possible, have someone wave to staff.',
      alertMedic: true
    };
  }

  if (isModerate) {
    return {
      severity: 'moderate',
      recommendation: 'Please proceed to the nearest Medical Post for evaluation. If symptoms worsen, press the emergency button or ask staff for help.',
      alertMedic: true
    };
  }

  return {
    severity: 'self-care',
    recommendation: 'Your symptoms appear mild. Please visit the nearest first-aid kiosk if you need a plaster, ice pack, or basic assistance. Rest and stay hydrated.',
    alertMedic: false
  };
}
