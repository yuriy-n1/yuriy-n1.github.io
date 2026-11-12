/* ==========================================================================
   YURIY-N1 // CYBERPUNK INTERACTIVE SYSTEM SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCyberCanvas();
  initTypewriter();
  initSystemClock();
  initCrtToggle();
  initScrollReveal();
  initCopyButtons();
  initInteractiveCli();
  initTransmissionForm();

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

/* --------------------------------------------------------------------------
   1. Cyber-Matrix / Neural Particle Canvas
   -------------------------------------------------------------------------- */
function initCyberCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(75, Math.floor((width * height) / 18000));
  const colors = ['#00f0ff', '#00ff9d', '#b829ff', '#ff0055'];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.65,
      vy: (Math.random() - 0.5) * 0.65,
      size: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Connect nearby nodes
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 135) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - dist / 135) * 0.22})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}

/* --------------------------------------------------------------------------
   2. Hero Terminal Typewriter Effect
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Aspiring Software Developer | B.A.Sc. Software Engineering @ uOttawa',
    'Seeking Summer 2027 Software Engineering Co-op Term',
    'Co-Creator of FundSave (Java Swing OOP) & LifeRing (Kotlin)',
    'Merivale High School Alumnus & TDSB ICS3U/4U Graduate',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function tick() {
    const currentPhrase = phrases[phraseIdx];
    if (isDeleting) {
      charIdx--;
      el.textContent = currentPhrase.substring(0, charIdx);
    } else {
      charIdx++;
      el.textContent = currentPhrase.substring(0, charIdx);
    }

    let delay = isDeleting ? 26 : 50;

    if (!isDeleting && charIdx === currentPhrase.length) {
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(tick, delay);
  }

  setTimeout(tick, 1000);
}

/* --------------------------------------------------------------------------
   3. Live UTC HUD Clock
   -------------------------------------------------------------------------- */
function initSystemClock() {
  const clockEl = document.getElementById('sys-clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const hh = String(now.getUTCHours()).padStart(2, '0');
    const mm = String(now.getUTCMinutes()).padStart(2, '0');
    const ss = String(now.getUTCSeconds()).padStart(2, '0');
    clockEl.textContent = `${hh}:${mm}:${ss} UTC`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* --------------------------------------------------------------------------
   4. CRT Overlay Toggle
   -------------------------------------------------------------------------- */
function initCrtToggle() {
  const btn = document.getElementById('toggle-crt');
  const stateSpan = document.getElementById('crt-state');
  if (!btn || !stateSpan) return;

  btn.addEventListener('click', () => {
    const enabled = document.body.classList.toggle('crt-enabled');
    stateSpan.textContent = enabled ? 'ON' : 'OFF';
    btn.setAttribute('aria-pressed', String(enabled));
  });
}

/* --------------------------------------------------------------------------
   5. Scroll Reveal Observer
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   6. Copy-to-Clipboard Contact Chip
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const value = btn.getAttribute('data-copy') || 'neyra.yuriy@gmail.com';
      const label = btn.querySelector('.copy-label');
      try {
        await navigator.clipboard.writeText(value);
        if (label) {
          const orig = label.textContent;
          label.textContent = `COPIED: ${value}`;
          setTimeout(() => {
            label.textContent = orig;
          }, 2000);
        }
      } catch {
        if (label) label.textContent = value;
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. Interactive Bottom Terminal CLI
   -------------------------------------------------------------------------- */
function initInteractiveCli() {
  const form = document.getElementById('cli-form');
  const input = document.getElementById('cli-input');
  const output = document.getElementById('cli-output');
  if (!form || !input || !output) return;

  const commands = {
    help: 'Commands: whoami, fundsave, lifering, education, coop, skills, contact, clear',
    whoami: 'Yuriy Neyra Alvarado (@yuriy-n1) — Software Engineering Student @ uOttawa & Aspiring Software Developer.',
    fundsave: 'FundSave (Java Swing/OOP): Team financial app with abstract Investments class, Stock/Bond/Crypto/GIC polymorphism, Sharpe Ratio calculation, budget Tracker, and File I/O.',
    lifering: 'LifeRing (Kotlin): Space healthcare telemetry app built at Liftoff Hackathon (Nokia & Thales) with User & Professional diagnostic modes.',
    education: 'B.A.Sc. Software Engineering @ University of Ottawa | Merivale High School | TDSB ICS3U & ICS4U (Java OOP).',
    coop: 'Actively seeking a Summer 2027 Software Engineering Co-op role! Reach out via email or LinkedIn.',
    skills: 'Core Stack: Java (OOP, Swing, File I/O), Python, Kotlin, HTML5/CSS3/JS, Git/GitHub.',
    contact: 'LinkedIn: linkedin.com/in/yuriy-neyra-alvarado | Emails: neyra.yuriy@gmail.com & yneyr092@uottawa.ca',
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = input.value.trim();
    if (!raw) return;
    const cmd = raw.toLowerCase();

    if (cmd === 'clear') {
      output.innerHTML = '';
      input.value = '';
      return;
    }

    const cmdLine = document.createElement('div');
    cmdLine.innerHTML = `<span class="text-green">yuriy@uottawa:~$</span> ${escapeHtml(raw)}`;
    output.appendChild(cmdLine);

    const responseLine = document.createElement('div');
    responseLine.style.color = '#00f0ff';
    responseLine.textContent =
      commands[cmd] || `Command not recognized: '${raw}'. Type 'help' for available commands.`;
    output.appendChild(responseLine);

    output.scrollTop = output.scrollHeight;
    input.value = '';
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (char) => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return map[char];
  });
}

/* --------------------------------------------------------------------------
   8. Transmission Contact Form
   -------------------------------------------------------------------------- */
function initTransmissionForm() {
  const form = document.getElementById('transmission-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('sender-name').value.trim();
    const email = document.getElementById('sender-email').value.trim();
    const subject = document.getElementById('sender-subject').value.trim();
    const message = document.getElementById('sender-message').value.trim();

    status.textContent = `>> ENCRYPTING & TRANSMITTING PACKET FROM [${name.toUpperCase()}]...`;

    setTimeout(() => {
      status.textContent = `>> PACKET READY! Launching mail client to neyra.yuriy@gmail.com...`;
      const mailtoUrl = `mailto:neyra.yuriy@gmail.com?cc=yneyr092@uottawa.ca&subject=${encodeURIComponent(
        `[CYBER-DOSSIER] ${subject}`
      )}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
      window.location.href = mailtoUrl;
      form.reset();
    }, 650);
  });
}
