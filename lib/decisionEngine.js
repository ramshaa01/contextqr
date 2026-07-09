/**
 * decisionEngine.js — ContextQR Core Intelligence
 *
 * Takes context inputs and returns a structured, context-aware response.
 * No ML required — this is a clean, well-commented decision tree.
 *
 * INPUT:  { zone, timeContext, userProfile }
 * OUTPUT: { primaryAction, secondaryInfo, alerts, nearestMedic, route, severity }
 *
 * zone: 'gate' | 'seat' | 'medical-post'
 * timeContext: 'pre-match' | 'half-time' | 'post-match' | 'live'
 * userProfile: { wheelchair, hearingImpaired, visuallyImpaired, medicalFlag, language }
 */

// --- Time Context Detection ---
// Determines match phase from current time (can be overridden in tests)
export function detectTimeContext(matchStartTime = null) {
  const now = new Date();

  // If no match start time provided, use a mock schedule
  if (!matchStartTime) {
    const hour = now.getHours();
    // Mock: match starts at 18:00
    if (hour < 17)      return 'pre-match';
    if (hour < 18)      return 'pre-match';
    if (hour === 18)    return 'pre-match';
    if (hour === 19)    return 'live';
    if (hour === 20)    return 'half-time'; // half-time at ~20:00 mock
    if (hour === 21)    return 'live';
    return 'post-match';
  }

  const startMs = new Date(matchStartTime).getTime();
  const elapsed = (now.getTime() - startMs) / 60000; // minutes elapsed

  if (elapsed < -30)          return 'pre-match';
  if (elapsed < 0)            return 'pre-match';
  if (elapsed < 45)           return 'live';       // first half
  if (elapsed < 60)           return 'half-time';  // half-time break ~45-60 min
  if (elapsed < 105)          return 'live';       // second half
  return 'post-match';
}

// --- Zone-Specific Decision Trees ---

function gateDecision(timeContext, userProfile) {
  const actions = {
    primary: '',
    secondary: [],
    alerts: [],
    tips: [],
  };

  // Time-based primary action
  switch (timeContext) {
    case 'pre-match':
      actions.primary = 'Gates are open. Proceed to your entry lane.';
      actions.secondary = ['Show your ticket QR at the scanner', 'Allow extra time — crowds expected'];
      actions.tips = ['Food & beverage stalls open on all concourses', 'Match kicks off at 18:00'];
      break;

    case 'half-time':
      actions.primary = 'Half-time — re-entry gates open on the west side.';
      actions.secondary = ['Re-entry requires your original ticket', 'Allow 10 min before second half starts'];
      actions.tips = ['Stalls have shorter queues via Gate B south'];
      break;

    case 'post-match':
      actions.primary = 'Match has ended. Follow exit signs for your gate.';
      actions.secondary = ['Gate A: exit northbound', 'Gate B: exit southbound'];
      actions.alerts = ['High crowd density expected — please move calmly'];
      break;

    default: // live
      actions.primary = 'Match is live. Late entry — please proceed quickly.';
      actions.secondary = ['Staff will escort you to your seat', 'Please silence your phone'];
      break;
  }

  // Accessibility overlays — applied on top of base logic
  if (userProfile?.wheelchair) {
    actions.secondary = [
      'Use the accessible entry lane (marked with blue ♿)',
      'Staff assistance available at Gate A north end',
      ...actions.secondary,
    ];
    actions.tips = ['Ramps and elevators marked on the stadium map', ...actions.tips];
  }

  if (userProfile?.visuallyImpaired) {
    actions.secondary = [
      'Audio guide stations at Gate A and Gate B entrance',
      ...actions.secondary,
    ];
  }

  if (userProfile?.hearingImpaired) {
    actions.tips = [
      'Visual PA screens show all announcements',
      'BSL interpreter at Gate A info desk',
      ...actions.tips,
    ];
  }

  return actions;
}

function seatDecision(timeContext, userProfile) {
  const actions = {
    primary: '',
    secondary: [],
    alerts: [],
    tips: [],
  };

  switch (timeContext) {
    case 'pre-match':
      actions.primary = 'Find your seat before kick-off — you have time!';
      actions.secondary = ['Your section: West Stand, Row 12', 'Nearest food stall: Concourse W1 (50m north)'];
      actions.tips = ['Crowd density: Medium — no wait at stalls', 'Merchandise available at Level 1 kiosk'];
      break;

    case 'half-time':
      actions.primary = 'Half-time! Stalls and toilets are nearby.';
      actions.secondary = ['Nearest food stall: 1 min walk north', 'Nearest toilet: 30 sec east'];
      actions.alerts = ['Stall queues at 8–12 min — food courts recommended'];
      actions.tips = ['Score: Check the stadium app for live stats'];
      break;

    case 'live':
      actions.primary = 'Match is live — enjoy the game!';
      actions.secondary = ['Medical help: tap the red button below', 'Staff located every 20 rows'];
      actions.tips = ['In emergency: call +1-800-STADIUM or find nearest red vest'];
      break;

    case 'post-match':
      actions.primary = 'Match over! Your nearest exit is Gate A (north).';
      actions.secondary = ['Estimated exit time: 15 min based on current crowd', 'Bus shuttle: Gate A north side'];
      actions.alerts = ['High density — wait 10 min for crowd to thin if not urgent'];
      break;

    default:
      actions.primary = 'Welcome to your seat. Enjoy the match!';
      break;
  }

  if (userProfile?.wheelchair) {
    actions.secondary = ['Your accessible seating area: Row AA companion section', ...actions.secondary];
    actions.tips = ['Elevator access: Level 1 east elevator (2 min away)', ...actions.tips];
  }

  return actions;
}

function medicalPostDecision(timeContext, userProfile) {
  const actions = {
    primary: 'Medical Post is staffed and ready to help.',
    secondary: ['Check in at the front desk', 'Describe your symptoms to the paramedic'],
    alerts: [],
    tips: ['All consultations are private and confidential'],
    postInfo: {
      name: 'Medical Post 1 — North Concourse',
      waitMinutes: 3,
      availability: 'available',
      staffCount: 3,
    },
  };

  // Half-time usually has higher demand
  if (timeContext === 'half-time') {
    actions.postInfo.waitMinutes = 8;
    actions.alerts = ['Higher than usual volume during half-time — paramedics still available'];
  }

  if (timeContext === 'post-match') {
    actions.postInfo.waitMinutes = 5;
    actions.secondary = ['If urgent — priority lane available', ...actions.secondary];
  }

  if (userProfile?.medicalFlag) {
    actions.alerts = [
      '⚠ Medical flag on profile detected — staff have been pre-notified',
      ...actions.alerts,
    ];
    actions.secondary = ['Show your medical alert card to staff', ...actions.secondary];
  }

  return actions;
}

// --- Main Decision Engine ---

/**
 * runDecisionEngine({ zone, timeContext, userProfile })
 * Returns a structured response object for the frontend to render.
 */
export function runDecisionEngine({ zone, timeContext, userProfile = {} }) {
  // Validate zone
  const validZones = ['gate', 'seat', 'medical-post'];
  if (!validZones.includes(zone)) {
    return {
      error: true,
      message: `Unknown zone: "${zone}". Valid zones: gate, seat, medical-post.`,
    };
  }

  // Validate timeContext
  const validTimes = ['pre-match', 'half-time', 'live', 'post-match'];
  const resolvedTime = validTimes.includes(timeContext)
    ? timeContext
    : detectTimeContext();

  // Dispatch to zone-specific decision tree
  let zoneActions;
  switch (zone) {
    case 'gate':         zoneActions = gateDecision(resolvedTime, userProfile); break;
    case 'seat':         zoneActions = seatDecision(resolvedTime, userProfile); break;
    case 'medical-post': zoneActions = medicalPostDecision(resolvedTime, userProfile); break;
  }

  // Build and return the unified response
  return {
    zone,
    timeContext: resolvedTime,
    userProfile,
    timestamp: new Date().toISOString(),
    ...zoneActions,
    meta: {
      decisionVersion: '1.0.0',
      accessibilityFlagsApplied: Object.keys(userProfile).filter(k => userProfile[k] === true),
    },
  };
}
