gsap.registerPlugin(ScrollTrigger);

/* ── Theme toggle (shared localStorage key with index.html) ── */
function applyTheme(theme) {
  const isInk = theme === 'ink';
  document.documentElement.classList.toggle('ink-mode', isInk);
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.textContent = isInk ? 'Paper' : 'Ink';
    btn.setAttribute('aria-label', isInk ? 'Switch to paper mode' : 'Switch to ink mode');
  }
}
const savedTheme = localStorage.getItem('nycst-theme') || 'paper';
applyTheme(savedTheme === 'ink' ? 'ink' : 'paper');
document.getElementById('themeToggle').addEventListener('click', () => {
  const next = document.documentElement.classList.contains('ink-mode') ? 'paper' : 'ink';
  localStorage.setItem('nycst-theme', next);
  applyTheme(next);
});

/* ── Motion: enhancements only, matches index.html's reveal pattern ── */
const motion = gsap.matchMedia();
motion.add('(prefers-reduced-motion: no-preference)', () => {
  ScrollTrigger.batch('.reveal', {
    onEnter: batch => gsap.from(batch, {
      autoAlpha: 0, y: 18,
      stagger: 0.05,
      duration: 0.6,
      ease: 'power2.out'
    }),
    once: true,
    start: 'top 92%'
  });
});
motion.add('(prefers-reduced-motion: reduce)', () => {
  /* Nothing to do — the page is already at its natural state. */
});

/* ── Jump-nav active state as each category scrolls through ── */
document.querySelectorAll('section[id]').forEach(section => {
  const link = document.querySelector(`.jump-nav a[href="#${section.id}"]`);
  if (!link) return;
  ScrollTrigger.create({
    trigger: section,
    start: 'top center',
    end: 'bottom center',
    toggleClass: { targets: link, className: 'active' }
  });
});

/* ── Marginalia rail stays fixed on "Sources" — single-topic page ── */

/* ── Contact form: AJAX submit to Netlify Forms ── */
document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('cf-status');
  const btn = form.querySelector('.cf-submit');
  const name = form.querySelector('#cf-name').value.trim();
  const email = form.querySelector('#cf-email').value.trim();
  const msg = form.querySelector('#cf-msg').value.trim();
  if (!name || !email || !msg) {
    status.textContent = 'Please fill in all fields.';
    status.className = 'cf-status err';
    return;
  }
  btn.disabled = true;
  btn.textContent = 'Sending…';
  status.textContent = '';
  status.className = 'cf-status';
  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    });
    if (res.ok) {
      status.textContent = 'Message sent — thank you.';
      status.className = 'cf-status ok';
      form.reset();
    } else {
      throw new Error();
    }
  } catch {
    status.textContent = 'Something went wrong. Please try again.';
    status.className = 'cf-status err';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send';
  }
});
