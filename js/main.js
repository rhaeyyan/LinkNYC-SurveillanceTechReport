gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Theme toggle (paper default, ink as inverted alternate) ── */
let kioskMap  = null;
let kioskTile = null;

function applyTheme(theme) {
  const isInk = theme === 'ink';
  document.documentElement.classList.toggle('ink-mode', isInk);
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.textContent = isInk ? 'Paper' : 'Ink';
    btn.setAttribute('aria-label', isInk ? 'Switch to paper mode' : 'Switch to ink mode');
  }
  if (kioskMap && kioskTile) {
    kioskMap.removeLayer(kioskTile);
    const url = isInk
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    kioskTile = L.tileLayer(url, {
      attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: 'abcd', maxZoom: 18
    }).addTo(kioskMap);
  }
}

const savedTheme = localStorage.getItem('nycst-theme') || 'paper';
applyTheme(savedTheme === 'ink' ? 'ink' : 'paper');

document.getElementById('themeToggle').addEventListener('click', () => {
  const next = document.documentElement.classList.contains('ink-mode') ? 'paper' : 'ink';
  localStorage.setItem('nycst-theme', next);
  applyTheme(next);
});

/* ── Motion: enhancements only ──────────────────────────────────────
   Content is fully rendered by default. GSAP layers animation *from*
   an initial offset state and never gates visibility. If JS fails to
   load (or the user prefers reduced motion), everything is still legible. */
const motion = gsap.matchMedia();

motion.add('(prefers-reduced-motion: no-preference)', () => {
  /* No hero entrance animation — the editorial register reads "this has
     always been on the page" rather than "watch this appear." */

  /* Pull-stat: count-up for numeric values, soft scale for ranges */
  document.querySelectorAll('.pull-stat .n').forEach(el => {
    const text    = el.textContent.trim();
    const isRange = text.includes('–') || text.includes('-');
    const num     = parseFloat(text.replace(/[^0-9.]/g, ''));
    const suffix  = text.replace(/^[0-9.]+/, '').trim();

    if (isRange || isNaN(num)) {
      gsap.from(el, {
        scale: 0.9, autoAlpha: 0, duration: 0.7, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true }
      });
      return;
    }
    ScrollTrigger.create({
      trigger: el, start: 'top 92%', once: true,
      onEnter() {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: num, duration: 1.6, ease: 'power2.out',
          onUpdate() {
            el.textContent = (num % 1 !== 0
              ? obj.val.toFixed(1)
              : Math.round(obj.val).toLocaleString()) + suffix;
          }
        });
      }
    });
  });

  /* Generic .reveal batch — gsap.from preserves natural visibility */
  ScrollTrigger.batch('.reveal', {
    onEnter: batch => gsap.from(batch, {
      autoAlpha: 0, y: 18,
      stagger: 0.07,
      duration: 0.65,
      ease: 'power2.out'
    }),
    once: true,
    start: 'top 92%'
  });
});

motion.add('(prefers-reduced-motion: reduce)', () => {
  /* Nothing to do — the page is already at its natural state. */
});

/* ── Nav active state (cheap, runs in both motion modes) ── */
document.querySelectorAll('section[id]').forEach(section => {
  const link = document.querySelector(`.nav-links a[href="#${section.id}"]`);
  if (!link) return;
  ScrollTrigger.create({
    trigger: section,
    start: 'top center',
    end: 'bottom center',
    toggleClass: { targets: link, className: 'active' }
  });
});

/* ── Marginalia rail: update §-number + name on section change ── */
const railSections = [
  { id: 'hero',            num: '00', name: 'Cover'      },
  { id: 'intro',           num: '01', name: 'Background' },
  { id: 'double-standard', num: '02', name: 'The Finding'},
  { id: 'inside',          num: '03', name: 'The Machine'},
  { id: 'map',             num: '04', name: 'The Map'    },
  { id: 'audit',           num: '05', name: 'The Audit'  },
  { id: 'equity',          num: '06', name: 'Who Pays'   },
  { id: 'fix',             num: '07', name: 'The Fix'    },
  { id: 'act',             num: '08', name: 'Act Now'    },
];
const railNum  = document.querySelector('.rail .r-num');
const railName = document.querySelector('.rail .r-name');
if (railNum && railName) {
  railSections.forEach(({ id, num, name }) => {
    const el = document.getElementById(id);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 40%',
      end:   'bottom 40%',
      onEnter()      { railNum.textContent = '§ ' + num; railName.textContent = name; },
      onEnterBack()  { railNum.textContent = '§ ' + num; railName.textContent = name; }
    });
  });
}

/* ── Copy letter ── */
function copyLetter(btn) {
  navigator.clipboard.writeText(document.getElementById('letterText').textContent).then(() => {
    const status = document.getElementById('copyStatus');
    btn.textContent = 'Copied to clipboard';
    btn.classList.add('copied');
    if (status) status.textContent = 'Letter copied to clipboard.';
    setTimeout(() => {
      btn.textContent = 'Copy letter to clipboard';
      btn.classList.remove('copied');
      if (status) status.textContent = '';
    }, 2800);
  });
}
document.getElementById('copyBtn').addEventListener('click', function() {
  copyLetter(this);
});

/* ── Kiosk map: editorial palette ──────────────────────────────────
   Hard-coded alarm hex so the kiosk dots stay visible against either
   the light or the dark CARTO basemap. Theme-agnostic by design — the
   dots don't need to redraw on toggle.                                */
const KIOSK_ALARM = '#B0271A';
const GEN = {
  /* Link 1.0 — older, more numerous: solid alarm fill                  */
  'Link1.0':          { solid: true,  range: 70  },
  'LINK1.0':          { solid: true,  range: 70  },
  /* Link5G — newer, larger pole: hollow alarm outline                  */
  'Link5G_Ad':        { solid: false, range: 120 },
  'Link5G_NonAd':     { solid: false, range: 120 },
  /* Legacy payphones — small muted dot (very few left in the dataset)  */
  'Public Payphones': { solid: true,  range: 40, color: '#7d756a' }
};

async function loadKiosks() {
  kioskMap = L.map('kioskMap', { preferCanvas: true, scrollWheelZoom: false })
    .setView([40.7308, -73.9852], 11);
  kioskMap.attributionControl.setPrefix('');
  const isInk = document.documentElement.classList.contains('ink-mode');
  const tileUrl = isInk
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  kioskTile = L.tileLayer(tileUrl, {
    attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: 'abcd', maxZoom: 18
  }).addTo(kioskMap);

  try {
    const res = await fetch('https://data.cityofnewyork.us/resource/s4kf-3yrf.json?$limit=5000');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    let plotted = 0;
    data.forEach(k => {
      const lat = parseFloat(k.latitude), lng = parseFloat(k.longitude);
      const gen  = k.planned_kiosk_type || 'Unknown';
      const meta = GEN[gen] || { solid: true, range: 70 };
      if (isNaN(lat) || isNaN(lng)) return;

      /* Alarm-tinted detection halo — accumulates on canvas so dense
         zones glow visibly under either basemap.                        */
      L.circle([lat, lng], {
        radius: meta.range || 70,
        fillColor: KIOSK_ALARM,
        fillOpacity: 0.055,
        color: 'transparent', weight: 0, interactive: false
      }).addTo(kioskMap);

      const color = meta.color || KIOSK_ALARM;
      L.circleMarker([lat, lng], {
        radius: gen.startsWith('Link5G') ? 4.5 : 3,
        color: color,
        fillColor: meta.solid ? color : 'transparent',
        fillOpacity: meta.solid ? 0.95 : 0,
        weight: meta.solid ? 0 : 1.4
      }).addTo(kioskMap).bindPopup(
        `<div><strong>${k.link_site_id || ''}</strong><br>${k.street_address || ''}<br>
          <em>${gen}</em><br>Status: ${k.link_installation_status || 'n/a'}</div>`
      );
      plotted++;
    });

    const countStr = `${plotted.toLocaleString()} kiosks plotted — live from NYC Open Data`;
    document.getElementById('kioskCountLine').textContent = countStr;
    ['heroKioskCount', 'statKiosks', 'compareCount', 'gapCount'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = plotted.toLocaleString();
    });

  } catch(err) {
    document.getElementById('kioskCountLine').textContent = 'Could not load live data: ' + err.message;
  }

  /* Map scrollytelling: pan/zoom as each narrative panel enters view */
  const mapViews = [
    { center: [40.7580, -73.9855], zoom: 13 }, /* panel 01 — Manhattan concentration */
    { center: [40.7308, -73.9852], zoom: 11 }, /* panel 02 — all five boroughs        */
    { center: [40.8448, -73.8648], zoom: 12 }, /* panel 03 — the Bronx                */
  ];
  document.querySelectorAll('.map-step').forEach((step, i) => {
    const view = mapViews[i];
    if (!view) return;
    const fly = () => kioskMap.flyTo(view.center, view.zoom, { animate: !prefersReduced, duration: 1 });
    ScrollTrigger.create({
      trigger: step,
      start: 'top 55%',
      end: 'bottom 45%',
      toggleClass: { targets: step, className: 'map-step-active' },
      onEnter:     fly,
      onEnterBack: fly
    });
  });
}
loadKiosks();

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
