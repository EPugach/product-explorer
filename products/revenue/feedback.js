// ══════════════════════════════════════════════════════════════
//  Revenue Cloud Feedback — Thin wrapper around shared feedback module
// ══════════════════════════════════════════════════════════════

import { initFeedback as _initFeedback } from '../../app/js/feedback-shared.js';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzLUgLAV3oFvnwaTwlTDq0-rIc3x3pb26U-IVfXtYjGBCsM-HAz7AycVaOX2hBCxxrHkg/exec';

export function initFeedback() {
  _initFeedback(SCRIPT_URL);
}
