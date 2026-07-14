import fs from 'fs/promises';
import path from 'path';

/**
 * decisionEngine.js — ContextQR Core Intelligence
 *
 * Accepts contextual inputs (zone ID, match phase, user accessibility profile)
 * and returns a fully structured, context-aware guidance response.
 *
 * DESIGN PRINCIPLES:
 *  - Fully deterministic — no ML, no randomness, no external dependencies
 *  - Safe-to-fail — each branch has a sensible default if data is unavailable
 *  - Accessibility-first — wheelchair, visual, and hearing overlays always applied on top
 *
 * INPUT:  { zoneId: string, zoneType: string, timeContext: string, userProfile: object }
 * OUTPUT: { primary: string, secondary: string[], alerts: string[], tips: string[], ...zoneSpecific }
 */

/** Reads a JSON mock data file from /data directory. Returns parsed object. */
async function readMockData(filename) {
  const filePath = path.join(process.cwd(), 'data', filename);
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

/**
 * detectTimeContext — Derives match phase from the current wall-clock time.
 * Can be overridden by passing an explicit matchStartTime (ISO string).
 *
 * Returns one of: 'pre-match' | 'live' | 'half-time' | 'post-match'
 */
export function detectTimeContext(matchStartTime = null) {
  const now = new Date();

  if (!matchStartTime) {
    // No explicit start time: use mock schedule based on hour-of-day
    const hour = now.getHours();
    if (hour < 19)  return 'pre-match';   // before 7pm → gates opening
    if (hour === 19) return 'live';        // 7pm = kick-off
    if (hour === 20) return 'half-time';  // ~8pm = half-time break
    if (hour === 21) return 'live';        // 9pm = second half
    return 'post-match';                  // 10pm+ = after final whistle
  }

  // Explicit start time provided — calculate elapsed minutes since kick-off
  const startMs = new Date(matchStartTime).getTime();
  const elapsed = (now.getTime() - startMs) / 60000; // convert ms → minutes

  if (elapsed < -30) return 'pre-match'; // >30 min before kick-off
  if (elapsed < 0)   return 'pre-match'; // within 30 min pre-kick-off
  if (elapsed < 45)  return 'live';      // first half (0–45 min)
  if (elapsed < 60)  return 'half-time'; // break window (~45–60 min)
  if (elapsed < 105) return 'live';      // second half (60–105 min)
  return 'post-match';                   // full time
}

// ─── Zone-Specific Decision Trees ────────────────────────────────────────────
// Each function takes (zoneData, timeContext, userProfile) and returns an actions object.
// Accessibility overlays are always applied *after* the base time-based logic.

/**
 * gateDecision — Entry gate logic.
 * Base behaviour switches on match phase; accessibility flags add extra items on top.
 */
async function gateDecision(zoneData, timeContext, userProfile) {
  const actions = {
    primary: '',
    secondary: [],
    alerts: [],
    tips: [],
    accessibleRoute: null
  };

  // Time-based primary action
  switch (timeContext) {
    case 'pre-match':
      actions.primary = `Welcome to ${zoneData.name}. Gates are open. Proceed to your entry lane.`;
      actions.secondary = ['Show your ticket QR at the scanner', 'Allow extra time — crowds expected'];
      actions.tips = ['Food & beverage stalls open on all concourses', 'Match kicks off at 18:00'];
      break;

    case 'half-time':
      actions.primary = `Half-time at ${zoneData.name} — re-entry gates open on the west side.`;
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

  // Accessibility overlays — appended on top of base time-context logic, never replacing it
  if (userProfile?.wheelchairUser) {
    actions.secondary = [
      'Use the accessible entry lane (marked with blue ♿)',
      'Staff assistance available at the gate',
      ...actions.secondary,
    ];
    actions.tips = ['Ramps and elevators marked on the stadium map', ...actions.tips];
    
    // Check if there is an accessible route
    // Try to load a pre-computed accessible route from JSON data
    try {
      const routes = await readMockData('accessibilityRoutes.json');
      const route = routes.find(r => r.fromZone === zoneData.zoneId && r.wheelchairAccessible);
      if (route) {
        actions.accessibleRoute = {
          routeId: route.routeId,
          toZone: route.toZone,
          estimatedTime: route.estimatedTimeWheelchair,
          steps: route.steps
        };
      }
    } catch (e) {
      console.error("Failed to load accessibility routes", e);
    }
  }

  if (userProfile?.visuallyImpaired) {
    actions.secondary = [
      'Audio guide stations at entrance',
      ...actions.secondary,
    ];
  }

  if (userProfile?.hearingImpaired) {
    actions.tips = [
      'Visual PA screens show all announcements',
      ...actions.tips,
    ];
  }

  return actions;
}

/**
 * seatDecision — Inside-stadium seat-area logic.
 * Half-time triggers the most complex branching: crowd density
 * determines whether a specific nearby stall recommendation is safe to give.
 */
async function seatDecision(zoneData, timeContext, userProfile) {
  const actions = {
    primary: '',
    secondary: [],
    alerts: [],
    tips: [],
    nearbyStall: null
  };

  switch (timeContext) {
    case 'pre-match':
      actions.primary = `Welcome to ${zoneData.name}. Find your seat before kick-off!`;
      actions.secondary = [`Your section: ${zoneData.name}`, `Nearby stalls: ${zoneData.nearbyStalls?.join(', ')}`];
      actions.tips = [`Crowd density: ${zoneData.crowdDensity}`, 'Merchandise available at Level 1 kiosk'];
      break;

    case 'half-time':
      actions.primary = 'Half-time! Stalls and toilets are nearby.';
      actions.secondary = [`Nearest stalls: ${zoneData.nearbyStalls?.join(', ')}`];

      // Dynamic crowd-density branch:
      // High density → warn the user, avoid sending them into a crush
      // Low/medium → safe to recommend the nearest stall directly
      if (zoneData.crowdDensity === 'high') {
         actions.alerts = ['High crowd density nearby. Expect 10+ min wait at stalls.'];
      } else {
         actions.tips = ['Score: Check the stadium app for live stats', `Crowd density is ${zoneData.crowdDensity}. Good time to visit stalls!`];
         actions.nearbyStall = zoneData.nearbyStalls?.[0]; // return a specific low-density stall
      }
      break;

    case 'live':
      actions.primary = 'Match is live — enjoy the game!';
      actions.secondary = ['Medical help: tap the red button below', 'Staff located every 20 rows'];
      actions.tips = ['In emergency: call +1-800-STADIUM or find nearest red vest'];
      break;

    case 'post-match':
      actions.primary = 'Match over! Please exit safely.';
      actions.secondary = ['Estimated exit time: 15 min based on current crowd'];
      actions.alerts = ['High density — wait 10 min for crowd to thin if not urgent'];
      break;

    default:
      actions.primary = 'Welcome to your seat. Enjoy the match!';
      break;
  }

  if (userProfile?.wheelchairUser) {
    actions.secondary = ['Your accessible seating area: Row AA companion section', ...actions.secondary];
    actions.tips = ['Elevator access: Level 1 east elevator (2 min away)', ...actions.tips];
  }

  return actions;
}

/**
 * medicalPostDecision — Medical assistance point logic.
 * Reads live post availability from mock JSON data.
 * Wait-time inflation applies automatically during high-demand phases.
 */
async function medicalPostDecision(zoneData, timeContext, userProfile) {
  let postInfo = {
    name: zoneData.name || 'Medical Post',
    waitMinutes: 3,
    availability: 'available',
    staffCount: 2,
  };

  try {
    const posts = await readMockData('medicalPosts.json');
    // For simplicity, we just grab a generic medical post if specific isn't found
    const post = posts.find(p => p.zoneNearby.includes(zoneData.zoneId)) || posts[0];
    if (post) {
       postInfo = { ...postInfo, ...post };
    }
  } catch (e) {
    console.error("Failed to load medical posts", e);
  }

  const actions = {
    primary: `${postInfo.name} is ${postInfo.availability}.`,
    secondary: ['Check in at the front desk', 'Describe your symptoms to the paramedic'],
    alerts: [],
    tips: ['All consultations are private and confidential'],
    postInfo,
  };

  // Half-time usually has higher demand
  if (timeContext === 'half-time') {
    actions.postInfo.waitMinutes += 5; // inflate wait time
    actions.alerts = ['Higher than usual volume during half-time — paramedics still available'];
  }

  if (timeContext === 'post-match') {
    actions.secondary = ['If urgent — priority lane available', ...actions.secondary];
  }

  if (userProfile?.medicalFlag || userProfile?.hasReportedSymptom) {
    actions.alerts = [
      '⚠ Medical flag on profile detected — staff have been pre-notified',
      ...actions.alerts,
    ];
    actions.secondary = ['Show your medical alert card to staff', ...actions.secondary];
  }

  return actions;
}

// ─── Main Entry Point ────────────────────────────────────────────────────────

/**
 * runDecisionEngine({ zoneId, zoneType, timeContext, userProfile })
 *
 * Orchestrates zone data loading, time resolution, and zone-specific decision dispatch.
 * Returns a unified response object ready for the frontend to render.
 *
 * Fallback strategy: if any data file fails to load, the function still returns
 * a valid (if less personalised) response using the zoneId/zoneType as a label.
 */
export async function runDecisionEngine({ zoneId, zoneType, timeContext, userProfile = {} }) {
  // Resolve timeContext: use provided value if valid, otherwise auto-detect from wall clock
  const validTimes = ['pre-match', 'half-time', 'live', 'post-match'];
  const resolvedTime = validTimes.includes(timeContext) ? timeContext : detectTimeContext();

  // Load zone data from JSON; fall back to a minimal synthetic object if the file fails
  let zoneData = { zoneId, zoneType: zoneType || 'gate', name: `Zone ${zoneId}` };
  try {
    const zones = await readMockData('zones.json');
    // If we have a specific zoneId, try to find it. Otherwise just find any matching zoneType for mock purposes.
    let foundZone = null;
    if (zoneId) {
       foundZone = zones.find(z => z.zoneId === zoneId || z.zoneType === zoneId); // fallback for simplicity
    } else {
       foundZone = zones.find(z => z.zoneType === zoneType);
    }
    
    if (foundZone) {
      zoneData = foundZone;
    }
  } catch (e) {
    console.error("Error loading zones", e);
  }

  // Dispatch to zone-specific decision tree
  let zoneActions;
  switch (zoneData.zoneType) {
    case 'gate':         zoneActions = await gateDecision(zoneData, resolvedTime, userProfile); break;
    case 'seat':         zoneActions = await seatDecision(zoneData, resolvedTime, userProfile); break;
    case 'medical-post': zoneActions = await medicalPostDecision(zoneData, resolvedTime, userProfile); break;
    default:
      return {
        error: true,
        message: `Unknown zone type: "${zoneData.zoneType}". Valid types: gate, seat, medical-post.`,
      };
  }

  // Build and return the unified response
  return {
    zoneType: zoneData.zoneType,
    zoneData,
    timeContext: resolvedTime,
    userProfile,
    timestamp: new Date().toISOString(),
    ...zoneActions,
    meta: {
      decisionVersion: '1.1.0',
      accessibilityFlagsApplied: Object.keys(userProfile).filter(k => userProfile[k] === true),
    },
  };
}
