// ══════════════════════════════════════════════════════════════
//  FEEDBACK — Modal form for collecting user feedback
//  Submits to a Google Apps Script endpoint that writes to a
//  private Google Sheet.
// ══════════════════════════════════════════════════════════════

import { track, announce } from './utils.js';

// Replace this URL after deploying the Google Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzLUgLAV3oFvnwaTwlTDq0-rIc3x3pb26U-IVfXtYjGBCsM-HAz7AycVaOX2hBCxxrHkg/exec';

// ── State ──
let isOpen = false;
let selectedRating = 0;
let isSubmitting = false;

// ── DOM refs (set in init) ──
let scrimEl, modalEl, formEl, starsEl, messageEl, errorEl, submitBtn, closeBtn;

// ── Modal open/close ──

function openModal() {
  if (isOpen) return;
  isOpen = true;
  scrimEl.classList.add('visible');
  modalEl.classList.add('visible');
  document.body.style.overflow = 'hidden';
  // Focus the first interactive element
  const firstInput = modalEl.querySelector('select, input, textarea');
  if (firstInput) firstInput.focus();
  track('feedback_open');
  announce('Feedback form opened');
}

function closeModal() {
  if (!isOpen) return;
  isOpen = false;
  scrimEl.classList.remove('visible');
  modalEl.classList.remove('visible');
  document.body.style.overflow = '';
  // Return focus to feedback button
  const btn = document.getElementById('feedbackBtn');
  if (btn) btn.focus();
}

function resetForm() {
  if (formEl) formEl.reset();
  selectedRating = 0;
  isSubmitting = false;
  updateStars(0);
  clearError();
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Feedback';
  }
  // Reset to form view (in case we were showing success)
  const successEl = modalEl.querySelector('.feedback-success');
  if (successEl) successEl.remove();
  if (formEl) formEl.style.display = '';
}

// ── Star Rating ──

function updateStars(rating) {
  if (!starsEl) return;
  const stars = starsEl.querySelectorAll('.feedback-star');
  stars.forEach((star, i) => {
    star.classList.toggle('active', i < rating);
    star.setAttribute('aria-checked', i < rating ? 'true' : 'false');
  });
}

function handleStarClick(index) {
  selectedRating = index + 1;
  updateStars(selectedRating);
}

function handleStarHover(index) {
  if (!starsEl) return;
  const stars = starsEl.querySelectorAll('.feedback-star');
  stars.forEach((star, i) => {
    star.classList.toggle('hovered', i <= index);
  });
}

function handleStarLeave() {
  if (!starsEl) return;
  const stars = starsEl.querySelectorAll('.feedback-star');
  stars.forEach((star) => star.classList.remove('hovered'));
}

function handleStarKeydown(e, index) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
    e.preventDefault();
    const next = Math.min(index + 1, 4);
    handleStarClick(next);
    starsEl.querySelectorAll('.feedback-star')[next].focus();
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
    e.preventDefault();
    const prev = Math.max(index - 1, 0);
    handleStarClick(prev);
    starsEl.querySelectorAll('.feedback-star')[prev].focus();
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleStarClick(index);
  }
}

// ── Validation ──

function showError(msg) {
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.classList.add('visible');
  }
}

function clearError() {
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
}

function validate() {
  const category = formEl.querySelector('#fb-category').value;
  const message = formEl.querySelector('#fb-message').value.trim();

  if (!category) {
    showError('Please select a category.');
    formEl.querySelector('#fb-category').focus();
    return false;
  }
  if (message.length < 5) {
    showError('Message must be at least 5 characters.');
    formEl.querySelector('#fb-message').focus();
    return false;
  }
  clearError();
  return true;
}

// ── Submission ──

async function handleSubmit(e) {
  e.preventDefault();
  if (isSubmitting) return;
  if (!validate()) return;

  // Honeypot check (client-side early exit)
  const honeypot = formEl.querySelector('#fb-hp').value;
  if (honeypot) {
    showSuccess();
    return;
  }

  isSubmitting = true;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  const data = {
    category: formEl.querySelector('#fb-category').value,
    rating: selectedRating || '',
    message: formEl.querySelector('#fb-message').value.trim(),
    email: formEl.querySelector('#fb-email').value.trim(),
    url: window.location.href,
    timestamp: new Date().toISOString(),
    honeypot: honeypot
  };

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(data),
      mode: 'no-cors'
    });
    // no-cors means we can't read the response, so assume success
    track('feedback_submit', { category: data.category });
    showSuccess();
  } catch {
    isSubmitting = false;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Feedback';
    showError('Something went wrong. Please try again.');
  }
}

function showSuccess() {
  formEl.style.display = 'none';
  const success = document.createElement('div');
  success.className = 'feedback-success';
  const icon = document.createElement('div');
  icon.className = 'feedback-success-icon';
  icon.textContent = '\u2713';
  const title = document.createElement('p');
  title.className = 'feedback-success-title';
  title.textContent = 'Thank you!';
  const desc = document.createElement('p');
  desc.className = 'feedback-success-desc';
  desc.textContent = 'Your feedback helps improve this tool.';
  success.appendChild(icon);
  success.appendChild(title);
  success.appendChild(desc);
  modalEl.querySelector('.feedback-modal-body').appendChild(success);
  announce('Feedback submitted successfully');
  setTimeout(() => {
    closeModal();
    // Reset after close animation
    setTimeout(() => resetForm(), 300);
  }, 2000);
}

// ── Focus Trap ──

function trapFocus(e) {
  if (!isOpen) return;
  if (e.key === 'Tab') {
    const focusable = modalEl.querySelectorAll(
      'button, [href], input:not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
  if (e.key === 'Escape') {
    closeModal();
  }
}

// ── Build modal DOM ──

function buildModalDOM() {
  // Header
  const header = document.createElement('div');
  header.className = 'feedback-modal-header';
  const h2 = document.createElement('h2');
  h2.id = 'feedback-title';
  h2.textContent = 'Send Feedback';
  const closeButton = document.createElement('button');
  closeButton.className = 'feedback-close-btn';
  closeButton.setAttribute('aria-label', 'Close feedback form');
  closeButton.textContent = '\u00D7';
  header.appendChild(h2);
  header.appendChild(closeButton);

  // Body
  const body = document.createElement('div');
  body.className = 'feedback-modal-body';
  const form = document.createElement('form');
  form.id = 'feedbackForm';
  form.noValidate = true;

  // Category field
  const catField = createField('Category', true);
  const select = document.createElement('select');
  select.id = 'fb-category';
  select.required = true;
  [['', 'Select...'], ['bug', 'Bug Report'], ['feature', 'Feature Request'],
   ['content', 'Content Issue'], ['general', 'General Feedback']].forEach(([val, label]) => {
    const opt = document.createElement('option');
    opt.value = val;
    opt.textContent = label;
    select.appendChild(opt);
  });
  catField.appendChild(select);
  form.appendChild(catField);

  // Rating field
  const ratingField = createField('Rating', false);
  const starsDiv = document.createElement('div');
  starsDiv.className = 'feedback-stars';
  starsDiv.id = 'feedbackStars';
  starsDiv.setAttribute('role', 'radiogroup');
  starsDiv.setAttribute('aria-label', 'Rating');
  for (let i = 0; i < 5; i++) {
    const star = document.createElement('button');
    star.type = 'button';
    star.className = 'feedback-star';
    star.setAttribute('role', 'radio');
    star.setAttribute('aria-checked', 'false');
    star.setAttribute('aria-label', `${i + 1} star${i > 0 ? 's' : ''}`);
    star.tabIndex = i === 0 ? 0 : -1;
    star.textContent = '\u2605';
    starsDiv.appendChild(star);
  }
  ratingField.appendChild(starsDiv);
  form.appendChild(ratingField);

  // Message field
  const msgField = createField('Message', true);
  const textarea = document.createElement('textarea');
  textarea.id = 'fb-message';
  textarea.rows = 4;
  textarea.placeholder = "What's on your mind?";
  textarea.required = true;
  textarea.minLength = 5;
  textarea.setAttribute('aria-describedby', 'fb-error');
  msgField.appendChild(textarea);
  form.appendChild(msgField);

  // Email field
  const emailField = createField('Email', false);
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'fb-email';
  emailInput.placeholder = 'For follow-up only';
  emailField.appendChild(emailInput);
  form.appendChild(emailField);

  // Honeypot
  const hp = document.createElement('input');
  hp.type = 'text';
  hp.id = 'fb-hp';
  hp.tabIndex = -1;
  hp.setAttribute('aria-hidden', 'true');
  hp.autocomplete = 'off';
  hp.className = 'fb-honeypot';
  form.appendChild(hp);

  // Error
  const error = document.createElement('div');
  error.className = 'fb-error';
  error.id = 'fb-error';
  error.setAttribute('role', 'alert');
  error.setAttribute('aria-live', 'assertive');
  form.appendChild(error);

  // Submit
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'fb-submit';
  submit.id = 'fb-submit';
  submit.textContent = 'Send Feedback';
  form.appendChild(submit);

  body.appendChild(form);
  modalEl.appendChild(header);
  modalEl.appendChild(body);
}

function createField(labelText, required) {
  const field = document.createElement('div');
  field.className = 'fb-field';
  const label = document.createElement('label');
  label.textContent = labelText + ' ';
  if (required) {
    const span = document.createElement('span');
    span.className = 'fb-required';
    span.textContent = '*';
    label.appendChild(span);
  } else if (labelText === 'Email') {
    const span = document.createElement('span');
    span.className = 'fb-optional';
    span.textContent = '(optional)';
    label.appendChild(span);
  }
  field.appendChild(label);
  return field;
}

// ── Init ──

export function initFeedback() {
  scrimEl = document.getElementById('feedbackScrim');
  modalEl = document.getElementById('feedbackModal');
  if (!scrimEl || !modalEl) return;

  // Build modal content via DOM API (no innerHTML)
  buildModalDOM();

  // Cache refs
  formEl = document.getElementById('feedbackForm');
  starsEl = document.getElementById('feedbackStars');
  messageEl = document.getElementById('fb-message');
  errorEl = document.getElementById('fb-error');
  submitBtn = document.getElementById('fb-submit');
  closeBtn = modalEl.querySelector('.feedback-close-btn');

  // Set label for attributes
  const labels = formEl.querySelectorAll('label');
  const labelTargets = ['fb-category', null, 'fb-message', 'fb-email'];
  labels.forEach((label, i) => {
    if (labelTargets[i]) label.setAttribute('for', labelTargets[i]);
  });

  // Event listeners
  document.getElementById('feedbackBtn').addEventListener('click', openModal);
  scrimEl.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  formEl.addEventListener('submit', handleSubmit);
  modalEl.addEventListener('keydown', trapFocus);

  // Star rating events
  const stars = starsEl.querySelectorAll('.feedback-star');
  stars.forEach((star, i) => {
    star.addEventListener('click', () => handleStarClick(i));
    star.addEventListener('mouseenter', () => handleStarHover(i));
    star.addEventListener('mouseleave', handleStarLeave);
    star.addEventListener('keydown', (e) => handleStarKeydown(e, i));
  });

  // Clear error on input
  messageEl.addEventListener('input', clearError);
  formEl.querySelector('#fb-category').addEventListener('change', clearError);
}
