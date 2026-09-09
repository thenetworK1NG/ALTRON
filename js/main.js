(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const reveal = document.querySelectorAll('[data-reveal]');
  if (reveal.length && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    reveal.forEach((el) => io.observe(el));
  } else {
    reveal.forEach((el) => el.classList.add('in'));
  }

  const demo = document.querySelector('.stage');
  if (demo && !reduceMotion) {
    const msgs = Array.from(demo.querySelectorAll('.chat-body > .msg'));
    const tlines = Array.from(demo.querySelectorAll('.tline'));
    const sys = demo.querySelector('.msg.sys');
    const chatBody = demo.querySelector('.chat-body');
    const scrollChat = () => {
      chatBody.scrollTop = chatBody.scrollHeight;
    };
    const typing2 = demo.querySelector('.msg.typing2');
    const statuses = [
      'on it &middot; pushing now',
      'reading your message',
      'pushing to launch-plan',
      'checking your screen',
      'done &middot; all good'
    ];
    let playing = false;
    let loopTimer = null;
    let timeouts = [];
    let iv = null;

    const clearTimers = () => {
      clearTimeout(loopTimer);
      clearInterval(iv);
      timeouts.forEach(clearTimeout);
      timeouts = [];
      loopTimer = null;
      iv = null;
    };
    const later = (ms, fn) => {
      const t = setTimeout(fn, ms);
      timeouts.push(t);
    };
    const play = () => {
      clearTimers();
      chatBody.scrollTop = 0;
      msgs.forEach((m) => m.classList.remove('show', 'pop'));
      tlines.forEach((t) => t.classList.remove('show'));
      tlines.forEach((t) => later(Number(t.dataset.t) || 0, () => t.classList.add('show')));
      const [you1, st, bot1, you2, botHere, img, botFinal] = msgs;
      you1.classList.add('show');
      st.classList.add('show');
      typing2.classList.add('show');
      scrollChat();
      let si = 0;
      iv = setInterval(() => {
        si = (si + 1) % statuses.length;
        st.innerHTML = statuses[si];
      }, 850);
      later(1900, () => {
        clearInterval(iv);
        typing2.classList.remove('show');
        bot1.classList.add('show');
        scrollChat();
      });
      later(2850, () => {
        you2.classList.add('show');
        typing2.classList.add('show');
        scrollChat();
      });
      later(3600, () => {
        typing2.classList.remove('show');
        botHere.classList.add('show');
        scrollChat();
      });
      later(4200, () => img.classList.add('pop'));
      later(5000, () => botFinal.classList.add('show'));
      later(5060, () => scrollChat());
      loopTimer = setTimeout(() => {
        if (playing) play();
      }, 9800);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!playing) {
            playing = true;
            play();
          }
        } else if (playing) {
          playing = false;
          clearTimers();
          msgs.forEach((m) => m.classList.remove('show', 'pop'));
          tlines.forEach((t) => t.classList.remove('show'));
        }
      });
    }, { threshold: 0.4 });
    io.observe(demo);
  } else if (demo) {
    demo.querySelectorAll('.chat-body > .msg').forEach((m) => m.classList.add('show'));
    demo.querySelectorAll('.tline').forEach((t) => t.classList.add('show'));
    const cb = demo.querySelector('.chat-body');
    if (cb) cb.scrollTop = cb.scrollHeight;
  }

  const glow = document.querySelector('.hero-glow');
  if (glow && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    let raf = null;
    window.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5);
        const y = (e.clientY / window.innerHeight - 0.5);
        glow.style.translate = `${x * 40}px ${y * 26}px`;
        raf = null;
      });
    });
  }

  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.style.borderBottomColor = window.scrollY > 8 ? 'rgba(232,244,238,.08)' : 'transparent';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();