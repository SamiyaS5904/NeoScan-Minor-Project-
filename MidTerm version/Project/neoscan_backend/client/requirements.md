## Packages
framer-motion | Page transitions, scroll-triggered animations, and glassmorphism effects
recharts | Dashboard analytics charts and trend data visualization
lucide-react | Icons for the medical/dashboard UI

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
}
Authentication uses a dummy token stored in localStorage ('neoscan_token').
Protected routes check for this token before rendering.
The camera uses HTML5 MediaDevices API; requires HTTPS or localhost to function.
