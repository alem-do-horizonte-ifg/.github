/* ═══════════════════════════════════════════
   ALÉM DO HORIZONTE — script.js
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── 1. STARS ───
    const starsContainer = document.getElementById('stars');
    if (starsContainer) {
        for (let i = 0; i < 120; i++) {
            const s = document.createElement('div');
            s.className = 'star';
            const size = Math.random() * 2.5 + 0.5;
            s.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 70}%;
                --op: ${Math.random() * 0.6 + 0.2};
                --d: ${Math.random() * 4 + 2}s;
                --delay: ${Math.random() * 5}s;
            `;
            starsContainer.appendChild(s);
        }
    }

    // ─── 2. NAVBAR SCROLL ───
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        navbar?.classList.toggle('scrolled', y > 60);
        backToTop?.classList.toggle('visible', y > 400);
    }, { passive: true });

    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ─── 3. HAMBURGER ───
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    hamburger?.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    // Close menu on link click (mobile)
    navLinks?.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => navLinks.classList.remove('open'));
    });

    // ─── 4. REVEAL ON SCROLL ───
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => revealObserver.observe(el));

    // ─── 5. STAT COUNTER ───
    const statNums = document.querySelectorAll('.stat-num[data-target]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                const duration = 1400;
                const start = performance.now();

                function tick(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // easeOutCubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(eased * target);
                    if (progress < 1) requestAnimationFrame(tick);
                    else el.textContent = target;
                }
                requestAnimationFrame(tick);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNums.forEach(el => counterObserver.observe(el));

    // ─── 6. COPY BUTTONS ───
    document.querySelectorAll('.terminal').forEach(terminal => {
        const btn = terminal.querySelector('.copy-btn');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const code = terminal.querySelector('code')?.innerText?.trim() || '';
            navigator.clipboard.writeText(code).then(() => {
                btn.textContent = '✓ Copiado';
                btn.classList.add('success');
                setTimeout(() => {
                    btn.textContent = 'Copiar';
                    btn.classList.remove('success');
                }, 2200);
            }).catch(() => {
                btn.textContent = 'Erro';
                setTimeout(() => { btn.textContent = 'Copiar'; }, 2000);
            });
        });
    });

    // ─── 7. TUTORIAL SCROLL SPY ───
    const tocLinks = document.querySelectorAll('.toc-link');
    const tutorialSteps = document.querySelectorAll('.tutorial-step');

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                tocLinks.forEach(l => l.classList.remove('active'));
                const id = entry.target.getAttribute('id');
                const active = document.querySelector(`.toc-link[href="#${id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });

    tutorialSteps.forEach(s => spyObserver.observe(s));

    // ─── 8. STATIC TABLE FILTER ───
    const searchInput = document.getElementById('searchInput');
    const filterCount = document.getElementById('filter-count');
    const tableRows   = document.querySelectorAll('#corpo-tabela tr');

    function updateCount(visible, total) {
        if (filterCount) {
            filterCount.textContent = visible < total
                ? `Exibindo ${visible} de ${total} dispositivos`
                : '';
        }
    }

    searchInput?.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase().trim();
        let visible = 0;
        tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const match = !q || text.includes(q);
            row.classList.toggle('hidden', !match);
            if (match) visible++;
        });
        updateCount(visible, tableRows.length);
    });

    // ─── 9. ACTIVE NAV LINK ───
    const sections = document.querySelectorAll('section[id], header[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navAnchors.forEach(a => {
                    a.classList.toggle('active-nav', a.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => navObserver.observe(s));

});

// ─────────────────────────────────────────────────────────────
// THIS BLOCK RUNS OUTSIDE DOMContentLoaded (appended after it)
// ─────────────────────────────────────────────────────────────
(function() {

// ─── 10. SPLASH SCREEN ───────────────────────────────────────
const splash     = document.getElementById('splash');
const terminal   = document.getElementById('splashTerminal');
const bar        = document.getElementById('splashBar');
const skipBtn    = document.getElementById('splashSkip');

if (!splash) return; // safety guard

// Prevent body scroll while splash is active
document.body.style.overflow = 'hidden';

const lines = [
    { text: '> Inicializando sistema...', delay: 0 },
    { text: '> Kernel: Linux armbian 6.1.0-meson64 aarch64', delay: 320 },
    { text: '> CPU: Amlogic S905X3 @ 1.9GHz [4 cores]', delay: 600 },
    { text: '> RAM: 1908MB disponível', delay: 850 },
    { text: '> Montando eMMC... OK', delay: 1100 },
    { text: '> Carregando módulos: [network] [usb] [hdmi]', delay: 1380 },
    { text: '> Serviços: Pi-hole ✓  SSH ✓  Samba ✓', delay: 1680 },
    { text: '> IFG · Boxeadores de TV\'s · Campus Goiânia', delay: 1980 },
    { text: '> Bem-vindo ao ALÉM DO HORIZONTE ■', delay: 2350 },
];

const TOTAL_DURATION = 3600; // ms total before auto-dismiss
let dismissed = false;
let timeouts = [];

function dismiss() {
    if (dismissed) return;
    dismissed = true;
    // Clear all pending timeouts
    timeouts.forEach(t => clearTimeout(t));
    // Animate bar to 100% instantly, then fade out
    bar.style.transition = 'width 0.3s linear';
    bar.style.width = '100%';
    document.body.style.overflow = '';
    setTimeout(() => splash.classList.add('hidden'), 320);
}

// Skip on click or keypress
splash.addEventListener('click', dismiss);
document.addEventListener('keydown', dismiss, { once: true });
skipBtn?.addEventListener('click', dismiss);

// Type each line
let cursor = document.createElement('span');
cursor.className = 'cursor';

lines.forEach((line, i) => {
    const t = setTimeout(() => {
        if (dismissed) return;
        // Remove cursor from last position
        if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
        // Add new line
        const div = document.createElement('div');
        div.textContent = line.text.replace(' ■', '');
        terminal.appendChild(div);
        // Re-add cursor
        if (line.text.endsWith(' ■')) {
            div.appendChild(cursor);
        } else {
            terminal.appendChild(cursor);
        }
        // Auto-scroll terminal
        terminal.scrollTop = terminal.scrollHeight;
        // Advance progress bar
        const pct = Math.round(((i + 1) / lines.length) * 88);
        bar.style.width = pct + '%';
    }, line.delay);
    timeouts.push(t);
});

// Auto-dismiss after full duration
const autoT = setTimeout(dismiss, TOTAL_DURATION);
timeouts.push(autoT);


// ─── 11. FAQ ACCORDION ───────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const answer   = btn.nextElementSibling;
        const expanded = btn.getAttribute('aria-expanded') === 'true';

        // Close all others
        document.querySelectorAll('.faq-question').forEach(other => {
            if (other !== btn) {
                other.setAttribute('aria-expanded', 'false');
                other.nextElementSibling.classList.remove('open');
            }
        });

        // Toggle this one
        btn.setAttribute('aria-expanded', String(!expanded));
        answer.classList.toggle('open', !expanded);
    });
});


// ─── 12. INVENTORY LIVE COUNTER ──────────────────────────────
function calcInventoryStats() {
    const rows = document.querySelectorAll('#corpo-tabela tr');
    let total   = rows.length;
    let done    = 0;   // all 3 steps ✔
    let partial = 0;   // at least 1 step ✔

    rows.forEach(row => {
        const cells = row.querySelectorAll('.status-cell');
        const okCount = [...cells].filter(c => c.classList.contains('ok')).length;
        if (okCount === 3) done++;
        else if (okCount > 0) partial++;
    });

    return { total, done, partial };
}

function animateCounter(el, target, suffix = '') {
    if (!el) return;
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.floor(eased * target);
        el.textContent = val + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
}

// Run once the counter bar enters the viewport
const counterBar = document.querySelector('.inv-counter-bar');
if (counterBar) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            counterObserver.unobserve(entry.target);

            const { total, done, partial } = calcInventoryStats();
            const pending = total - done;
            const pct = Math.round((done / total) * 100);

            animateCounter(document.getElementById('cnt-total'),   total);
            animateCounter(document.getElementById('cnt-done'),    done);
            animateCounter(document.getElementById('cnt-pending'), pending);
            animateCounter(document.getElementById('cnt-pct'),     pct, '%');
        });
    }, { threshold: 0.5 });

    counterObserver.observe(counterBar);
}

// Also hook into results-metrics .metric-num counters
document.querySelectorAll('.metric-num[data-target]').forEach(el => {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            obs.unobserve(entry.target);
            const target = parseInt(el.dataset.target, 10);
            animateCounter(el, target);
        });
    }, { threshold: 0.5 });
    obs.observe(el);
});

})(); // end IIFE
