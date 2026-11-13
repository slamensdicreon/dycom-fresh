// Standalone (handoff) build of the Final Design Direction.
//
// `VITE_DYCOM_STANDALONE=1` at build time produces a static site that runs
// without the review workspace: the Final Design Direction answers at the
// site root (the Design System stays at design-system/), the review access
// gate is not rendered, and photography and company logos are read from
// `VITE_DYCOM_MEDIA_BASE` (a folder copied into the build) instead of the API
// server's App Storage route. The review workspace never sets the flag.
export const STANDALONE = import.meta.env.VITE_DYCOM_STANDALONE === '1';
