# ContextQR — Adaptive Stadium Safety & Accessibility Assistant

> "One QR code, infinite context."

ContextQR transforms a single static QR code into a dynamic, context-aware safety and accessibility assistant for stadium environments.

## 🎯 Problem Statement
Smart Stadiums struggle with information overload. Fans are presented with dozens of signs, maps, and emergency directions. During an emergency or high-stress situation, navigating complex apps or searching for the right map is inefficient and dangerous.

## 🧑‍🦽 Chosen Vertical: Medical & Accessibility
We focused on the **Medical & Accessibility** persona. For users with disabilities, or fans experiencing a medical emergency, rapid and tailored information is critical. ContextQR eliminates the need to search; a user simply scans the nearest QR code, and the system intelligently responds based on *where* they are, *when* it is, and *who* they are.

## 🧠 Approach & Logic
The core innovation is **Context-Aware Branching**. A single QR code on a wall (e.g., "Gate A") doesn't just link to a static map. Instead, our Decision Engine evaluates:
1. **Zone (`zoneId`)**: Where is the user? (e.g., Gate, Seat, Medical Post)
2. **Time Context (`timeContext`)**: Is it Pre-match, Live, Half-time, or Post-match?
3. **User Profile (`userProfile`)**: Are they a wheelchair user? Do they have a medical flag?

Based on this, the engine instantly returns the most relevant primary action, alerts, and accessibility routing.

## 🔄 How It Works (The 3 Scenarios)
1. **Gate Zone**: Scanned before the match, it directs standard users to their entry lane. For a wheelchair user, the exact same scan dynamically updates to provide the nearest step-free accessible route.
2. **Seat Zone**: Scanned during half-time, it alerts the user to high crowd density at nearby stalls. Scanned post-match, it provides safe exit routes.
3. **Medical Post**: Scanned by a user feeling unwell, it immediately launches a rapid symptom triage. Severe symptoms trigger an urgent assertive alert and "dispatch" a medic, while mild symptoms provide self-care instructions and directions to a first-aid kiosk.

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Vanilla CSS with CSS Variables (Custom Design System, No Tailwind)
- **Animations**: Framer Motion (with reduced-motion support)
- **Icons**: Lucide React
- **Testing**: Vitest, React Testing Library
- **Deployment**: Vercel

## ♿ Accessibility Features
Accessibility is not an afterthought; it is a core feature:
- **WCAG AA Compliant Contrast**: All text/background combinations meet or exceed 4.5:1 ratios.
- **Keyboard Navigation**: Full Tab support with explicit, high-contrast focus rings. `Enter` and `Space` activation on custom components.
- **Screen Reader Support**: Comprehensive ARIA labels. `aria-live="assertive"` for urgent medical alerts, and `aria-live="polite"` for dynamic content updates.
- **Reduced Motion**: Respects the OS-level `prefers-reduced-motion` setting by bypassing animations using a custom accessible motion wrapper.
- **Colorblind-Safe Indicators**: Status banners and density indicators never rely purely on color; they are always accompanied by clear icons and text labels.

## ⚠️ Assumptions & Limitations
- **Mock Data**: We are using mock JSON files (`zones.json`, `medicalPosts.json`) to simulate stadium API responses.
- **Simulated Scanning**: For demo purposes, "scanning" is simulated via UI buttons on the landing page (though real QR codes are provided in the `/public/qr` folder).
- **Medical Triage**: The symptom checker is a simulated demo and does not constitute real medical advice or connect to real emergency services.

## 🚀 Local Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Run the unit test suite
npm run test
```
The app will be available at `http://localhost:3000`.

## 🌐 Live Demo
The application is deployed live on Vercel at: **[Insert Vercel Link Here]**

*(Screenshot placeholders)*
![Landing Page](/screenshots/landing.png)
![Medical Triage](/screenshots/medical.png)
