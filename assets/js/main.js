/* Family Art Painting: interactions */
(function () {
  'use strict';

  // Form delivery. Paste a Formspree (https://formspree.io/f/xxxx) or similar endpoint here.
  // Left empty, the form opens the visitor's email app with the request filled in.
  var FORM_ENDPOINT = '';
  // Address kept in parts so e-mail harvesters reading the source find nothing
  var FORM_EMAIL = ['contactus', 'familyartpainting.com'].join('@');
  // Antispam: a person needs at least this long to fill three steps
  var MIN_FILL_MS = 4000;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* Header: solid after the hero starts moving, hides on fast scroll down */
  var header = $('[data-header]');
  var lastY = window.scrollY;
  function onHeaderScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-solid', y > 40);
    var goingDown = y > lastY + 4;
    var goingUp = y < lastY - 4;
    if (!header.classList.contains('is-open')) {
      if (goingDown && y > 600) header.classList.add('is-hidden');
      else if (goingUp) header.classList.remove('is-hidden');
    }
    lastY = y;
  }

  /* Mobile menu */
  var toggle = $('[data-menu-toggle]');
  function setMenu(open) {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', function () { setMenu(!header.classList.contains('is-open')); });
  $$('[data-nav] a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && header.classList.contains('is-open')) { setMenu(false); toggle.focus(); } });

  /* Current section in nav */
  var navLinks = $$('.nav-list a[href^="#"]');
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['about', 'services', 'work', 'reviews', 'process', 'faq'].forEach(function (id) { var el = document.getElementById(id); if (el) navIO.observe(el); });
  }

  /* Hero multiplane: the camera sinks toward the house as you scroll, planes drift with the pointer */
  var scene = $('[data-scene]');
  var planes = scene ? $$('.plane', scene) : [];
  var heroCopy = $('[data-hero-copy]');
  var hero = $('.hero');
  var pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      pointer.tx = (e.clientX - r.left) / r.width - 0.5;
      pointer.ty = (e.clientY - r.top) / r.height - 0.5;
    });
    hero.addEventListener('pointerleave', function () { pointer.tx = 0; pointer.ty = 0; });
  }
  function renderHero() {
    var h = hero.offsetHeight;
    var y = Math.min(window.scrollY, h);
    var p = y / h;
    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;
    planes.forEach(function (pl) {
      var d = parseFloat(pl.getAttribute('data-depth')) || 0;
      var sink = y * d * 0.9;
      var scale = 1 + p * d * 0.9;
      var px = -pointer.x * d * 60;
      var py = -pointer.y * d * 24;
      pl.style.transform = 'translate3d(' + px.toFixed(2) + 'px,' + (sink + py).toFixed(2) + 'px,0) scale(' + scale.toFixed(4) + ')';
      if (d > 0.5) pl.style.filter = 'blur(' + (p * 6).toFixed(2) + 'px)';
    });
    if (heroCopy) {
      heroCopy.style.transform = 'translate3d(0,' + (y * -0.12).toFixed(1) + 'px,0)';
      heroCopy.style.opacity = String(Math.max(0, 1 - p * 1.4));
    }
  }

  /* Cel layers: photos drift at their own depth */
  var cels = $$('[data-cel]');
  var cardPhotos = $$('.card-photo');
  function renderCels() {
    var vh = window.innerHeight;
    cels.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      var mid = r.top + r.height / 2 - vh / 2;
      var d = parseFloat(el.getAttribute('data-cel'));
      el.style.transform = 'translate3d(0,' + (mid * d).toFixed(1) + 'px,0)';
    });
    // The photo plane inside each service card drifts against the card's text plane
    cardPhotos.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh || r.width === 0) return;
      var mid = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.setProperty('--py', (mid * -28).toFixed(1) + 'px');
    });
  }

  /* Process path draws itself */
  var track = $('.process-track');
  var steps = $$('.step');
  function renderProcess() {
    if (!track) return;
    var r = track.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.4)));
    track.style.setProperty('--p', p.toFixed(3));
    steps.forEach(function (s, i) { s.classList.toggle('is-lit', p >= [0.02, 0.48, 0.92][i]); });
  }

  var ticking = false;
  function frame() {
    ticking = false;
    onHeaderScroll();
    if (!reduceMotion) { renderHero(); renderCels(); }
    renderProcess();
    if (!reduceMotion && (Math.abs(pointer.tx - pointer.x) > 0.001 || Math.abs(pointer.ty - pointer.y) > 0.001)) request();
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  hero.addEventListener('pointermove', request);
  request();

  /* Reveal headings and blocks once */
  var revealTargets = $$('.section-head, .about-copy, .compare-side, .why-copy, .faq-head, .contact-info, .season');
  if ('IntersectionObserver' in window && !reduceMotion) {
    revealTargets.forEach(function (el, i) {
      el.setAttribute('data-reveal', '');
      if (el.classList.contains('season') || el.classList.contains('review')) {
        var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
        el.style.transitionDelay = (idx * 0.08) + 's';
      }
    });
    document.documentElement.classList.add('reveal-on');
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); rio.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    revealTargets.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
      rio.observe(el);
    });
  }

  /* Reviews: an endless ribbon. A copy of the list follows the original so the loop has no seam. */
  var reviewTrack = $('.review-track');
  if (reviewTrack) {
    var reviewList = $('.review-list', reviewTrack);
    var reviewCopy = reviewList.cloneNode(true);
    reviewCopy.setAttribute('aria-hidden', 'true');
    reviewCopy.setAttribute('inert', '');
    reviewTrack.appendChild(reviewCopy);
    var setReviewSpeed = function () {
      // About 40px per second whatever the screen width
      reviewTrack.style.setProperty('--review-duration', Math.max(40, reviewList.offsetWidth / 40).toFixed(1) + 's');
    };
    setReviewSpeed();
    window.addEventListener('resize', setReviewSpeed);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        reviewTrack.classList.toggle('is-offscreen', !entries[0].isIntersecting);
      }).observe(reviewTrack);
    }
  }

  /* Service tabs */
  var tablist = $('[data-tabs]');
  if (tablist) {
    var tabs = $$('[role="tab"]', tablist);
    var ink = $('.tab-ink', tablist);
    var moveInk = function (tab) {
      ink.style.width = tab.offsetWidth + 'px';
      ink.style.transform = 'translateX(' + tab.offsetLeft + 'px)';
    };
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        panel.hidden = !on;
        if (on) {
          panel.classList.remove('is-entering');
          void panel.offsetWidth;
          panel.classList.add('is-entering');
          var row = $('.cards', panel); if (row) row.scrollLeft = 0;
        }
      });
      moveInk(tab);
      if (focus) tab.focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') n = tabs[0];
        if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
    var current = function () { return $('[aria-selected="true"]', tablist); };
    moveInk(current());
    window.addEventListener('resize', function () { moveInk(current()); });
    if (document.fonts) document.fonts.ready.then(function () { moveInk(current()); });
  }

  /* Service links prefill step one of the form */
  window.setEstimateService = function (v) {
    var radio = $$('input[name="service"]').filter(function (r) { return r.value === v; })[0];
    var other = $('input[name="service"][data-other]');
    var otherSel = $('#f-service-other');
    if (radio) radio.checked = true;
    else if (other && otherSel) { other.checked = true; otherSel.value = v; }
    var ev = document.createEvent('Event'); ev.initEvent('change', true, true);
    (radio || other).dispatchEvent(ev);
  };
  $$('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () { window.setEstimateService(a.getAttribute('data-service')); });
  });

  /* Before and after: a roller sweeps between the two photos */
  var compare = $('[data-compare]');
  if (compare) {
    var frameEl = $('.compare-frame', compare);
    var before = $('[data-before]', compare);
    var after = $('[data-after]', compare);
    var toggleBtns = $$('[data-show]', compare);
    var moveTimer;
    var show = function (which) {
      toggleBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-show') === which)); });
      frameEl.classList.add('is-moving');
      frameEl.style.setProperty('--reveal', which === 'after' ? '100' : '0');
      clearTimeout(moveTimer);
      moveTimer = setTimeout(function () { frameEl.classList.remove('is-moving'); }, 1100);
    };
    toggleBtns.forEach(function (b) { b.addEventListener('click', function () { show(b.getAttribute('data-show')); }); });
    $$('.thumb', compare).forEach(function (t) {
      t.addEventListener('click', function () {
        $$('.thumb', compare).forEach(function (o) { o.classList.remove('is-active'); o.removeAttribute('aria-current'); });
        t.classList.add('is-active'); t.setAttribute('aria-current', 'true');
        before.src = t.getAttribute('data-b'); before.alt = t.getAttribute('data-ba');
        after.src = t.getAttribute('data-a'); after.alt = t.getAttribute('data-aa');
        $('[data-compare-title]', compare).textContent = t.getAttribute('data-title');
        frameEl.style.transition = 'none';
        frameEl.style.setProperty('--reveal', '0');
        toggleBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-show') === 'before')); });
        void frameEl.offsetWidth;
        frameEl.style.transition = '';
        setTimeout(function () { show('after'); }, 650);
      });
    });
    // First time the frame scrolls in: show the before, then roll the after across
    if ('IntersectionObserver' in window && !reduceMotion) {
      var cio = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        cio.disconnect();
        frameEl.style.transition = 'none';
        frameEl.style.setProperty('--reveal', '0');
        toggleBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-show') === 'before')); });
        void frameEl.offsetWidth;
        frameEl.style.transition = '';
        setTimeout(function () { show('after'); }, 900);
      }, { threshold: 0.55 });
      cio.observe(frameEl);
    }
  }

  /* Mobile action bar steps aside when the form is on screen */
  var bar = $('.action-bar');
  var form = $('[data-form]');
  if (bar && form && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      bar.classList.toggle('is-hidden', entries[0].isIntersecting);
    }, { threshold: 0.15 }).observe(form);
  }

  /* Estimate form */
  if (form) {
    var status = $('[data-form-status]', form);
    var submit = $('[data-submit]', form);
    var rules = {
      name: function (v) { return v.trim().length >= 2; },
      phone: function (v) { return v.replace(/\D/g, '').length >= 10; },
      email: function (v) { return !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
      town: function (v) { return v.trim().length >= 2; }
    };
    var check = function (input) {
      var rule = rules[input.name];
      if (!rule) return true;
      var ok = rule(input.value);
      var field = input.closest('.field');
      field.classList.toggle('has-error', !ok);
      input.setAttribute('aria-invalid', String(!ok));
      var err = $('.field-error', field);
      if (err) { if (!ok) input.setAttribute('aria-describedby', err.id); else input.removeAttribute('aria-describedby'); }
      return ok;
    };
    $$('input', form).forEach(function (input) {
      input.addEventListener('blur', function () { if (input.value) check(input); });
      input.addEventListener('input', function () { if (input.closest('.field') && input.closest('.field').classList.contains('has-error')) check(input); });
    });
    /* Antispam clock starts at the first real interaction with the form */
    var startedField = $('[data-started]', form);
    var startClock = function () { if (!startedField.value) startedField.value = String(Date.now()); };
    ['pointerdown', 'keydown', 'focusin'].forEach(function (ev) { form.addEventListener(ev, startClock, { once: true }); });

    /* Steps */
    var steps = $$('.form-step', form);
    var marks = $$('.form-progress li', form);
    var backBtn = $('[data-back]', form);
    var nextBtn = $('[data-next]', form);
    var stepIndex = 0;
    var otherField = $('[data-other-field]', form);
    $$('input[name="service"]', form).forEach(function (r) {
      r.addEventListener('change', function () {
        otherField.hidden = !$('input[name="service"][data-other]', form).checked;
        form.classList.remove('svc-error');
      });
    });
    var validStep = function (i) {
      if (i === 0) {
        var ok = !!$('input[name="service"]:checked', form);
        form.classList.toggle('svc-error', !ok);
        if (!ok) $('input[name="service"]', form).focus();
        return ok;
      }
      var bad = $$('input', steps[i]).filter(function (inp) { return !check(inp); });
      if (bad.length) bad[0].focus();
      return !bad.length;
    };
    var go = function (i, focus) {
      stepIndex = i;
      steps.forEach(function (s, k) { s.hidden = k !== i; s.classList.toggle('is-active', k === i); });
      marks.forEach(function (m, k) {
        m.classList.toggle('is-stepIndex', k === i);
        m.classList.toggle('is-done', k < i);
        if (k === i) m.setAttribute('aria-stepIndex', 'step'); else m.removeAttribute('aria-stepIndex');
      });
      form.style.setProperty('--step', String(i));
      backBtn.hidden = i === 0;
      nextBtn.hidden = i === steps.length - 1;
      submit.hidden = i !== steps.length - 1;
      status.textContent = ''; status.className = 'form-status';
      if (focus) { var first = $('input:not([type=radio]), textarea, input[type=radio]', steps[i]); if (first) first.focus({ preventScroll: true }); }
    };
    nextBtn.addEventListener('click', function () { if (validStep(stepIndex)) go(stepIndex + 1, true); });
    backBtn.addEventListener('click', function () { go(stepIndex - 1, true); });
    form.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT' && stepIndex < steps.length - 1) { e.preventDefault(); nextBtn.click(); }
    });

    var phoneInput = $('#f-phone');
    phoneInput.addEventListener('input', function () {
      var d = phoneInput.value.replace(/\D/g, '').slice(0, 11);
      if (d.length === 11 && d[0] === '1') d = d.slice(1);
      var out = d;
      if (d.length > 6) out = '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6, 10);
      else if (d.length > 3) out = '(' + d.slice(0, 3) + ') ' + d.slice(3);
      phoneInput.value = out;
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // Antispam: bots fill the hidden field, submit instantly, or paste links.
      // They get a fake success so they do not retry.
      var started = parseInt(form.querySelector('[data-started]').value, 10) || 0;
      var msg = (form.message.value || '') + ' ' + (form.name.value || '');
      var links = (msg.match(/https?:\/\/|www\./gi) || []).length;
      var spam = form._gotcha.value || !started || Date.now() - started < MIN_FILL_MS || links > 1 || /https?:|www\./i.test(form.name.value);
      var bad = $$('input', form).filter(function (i) { return !check(i); });
      if (bad.length) {
        status.className = 'form-status is-error';
        status.textContent = 'Please check the highlighted fields.';
        bad[0].focus();
        return;
      }
      var data = new FormData(form);
      data.delete('_started');
      if (spam) { form.reset(); go(0); status.className = 'form-status is-ok'; status.textContent = 'Thank you! We got your request.'; return; }
      data.delete('_gotcha');
      if (data.get('service') === 'Other' && data.get('service_detail')) data.set('service', data.get('service_detail'));
      data.delete('service_detail');
      submit.disabled = true;
      submit.classList.add('is-loading');
      status.className = 'form-status';
      status.textContent = 'Sending your request...';

      var done = function () {
        submit.disabled = false;
        submit.classList.remove('is-loading');
        form.classList.add('is-sent');
        form.reset();
        startedField.value = '';
        ['pointerdown', 'keydown', 'focusin'].forEach(function (ev) { form.addEventListener(ev, startClock, { once: true }); });
        otherField.hidden = true;
        go(0);
        status.className = 'form-status is-ok';
        status.textContent = 'Thank you, ' + data.get('name').split(' ')[0] + '! We got your request and will reach out by ' + String(data.get('contact_pref')).toLowerCase() + ' soon. Need us sooner? Call (774) 828-0102.';
      };
      var fail = function () {
        submit.disabled = false;
        submit.classList.remove('is-loading');
        status.className = 'form-status is-error';
        status.textContent = 'Something went wrong sending the form. Please call or text (774) 828-0102.';
      };

      if (FORM_ENDPOINT) {
        fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (r) { if (r.ok) done(); else fail(); })
          .catch(fail);
      } else {
        var lines = [];
        data.forEach(function (v, k) { if (v) lines.push(k.replace('_', ' ') + ': ' + v); });
        window.location.href = 'mailto:' + FORM_EMAIL + '?subject=' + encodeURIComponent('Free estimate request from ' + data.get('name')) + '&body=' + encodeURIComponent(lines.join('\n'));
        setTimeout(done, 600);
      }
    });
  }

  /* E-mail links are assembled here, never written whole in the HTML */
  $$('[data-mail]').forEach(function (a) {
    var parts = a.getAttribute('data-mail').split('|');
    var addr = parts[0] + '@' + parts[1];
    a.href = 'mailto:' + addr;
    var t = $('[data-mail-text]', a);
    if (t) t.textContent = addr;
  });

  var year = $('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();

/* Before and after sliders: drag, tap, or arrow keys move the cut */
(function () {
  'use strict';
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-ba]'));
  if (!cards.length) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  cards.forEach(function (card) {
    var range = card.querySelector('.ba-range');
    var set = function (v) {
      v = Math.max(0, Math.min(100, v));
      card.style.setProperty('--pos', v.toFixed(1));
      range.value = String(Math.round(v));
      card.classList.toggle('hide-before', v < 8);
      card.classList.toggle('hide-after', v > 92);
    };
    var fromEvent = function (e) {
      var r = card.getBoundingClientRect();
      return ((e.clientX - r.left) / r.width) * 100;
    };
    var dragging = false, startX = 0, startY = 0, decided = false;
    card.addEventListener('pointerdown', function (e) {
      dragging = true; decided = e.pointerType === 'mouse'; startX = e.clientX; startY = e.clientY;
      if (decided) { card.classList.add('is-dragging'); card.setPointerCapture(e.pointerId); set(fromEvent(e)); }
    });
    card.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      if (!decided) {
        // On touch, only take over once the gesture is clearly horizontal so the page still scrolls
        var dx = Math.abs(e.clientX - startX), dy = Math.abs(e.clientY - startY);
        if (dx < 6 && dy < 6) return;
        if (dy > dx) { dragging = false; return; }
        decided = true; card.classList.add('is-dragging'); card.setPointerCapture(e.pointerId);
      }
      set(fromEvent(e));
    });
    var end = function (e) {
      if (dragging && !decided && e.type === 'pointerup') set(fromEvent(e));
      dragging = false; card.classList.remove('is-dragging');
    };
    card.addEventListener('pointerup', end);
    card.addEventListener('pointercancel', end);
    range.addEventListener('input', function () { set(parseFloat(range.value)); });
    card.addEventListener('click', function () { range.focus({ preventScroll: true }); });
  });

  // First time the grid scrolls in, sweep each cut once so visitors see it moves
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var card = en.target, t0 = null;
        var step = function (t) {
          if (card.classList.contains('is-dragging')) return;
          if (t0 === null) t0 = t;
          var k = Math.min(1, (t - t0) / 1400);
          var v = 50 + Math.sin(k * Math.PI * 2) * 22 * (1 - k);
          card.style.setProperty('--pos', v.toFixed(1));
          if (k < 1) requestAnimationFrame(step);
        };
        setTimeout(function () { requestAnimationFrame(step); }, 200 + cards.indexOf(card) % 3 * 140);
      });
    }, { threshold: 0.6 });
    cards.forEach(function (c) { io.observe(c); });
  }
})();

/* Flag the current Massachusetts season */
(function () {
  var m = new Date().getMonth();
  var key = m === 11 || m < 2 ? 'winter' : m < 5 ? 'spring' : m < 8 ? 'summer' : 'fall';
  var el = document.querySelector('[data-season="' + key + '"]');
  if (el) el.classList.add('is-now');
  document.querySelectorAll('.season-link[data-service]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (window.setEstimateService) window.setEstimateService(a.getAttribute('data-service'));
    });
  });
})();

/* Seasons: hovering a column lights its stretch of the street */
(function () {
  var strip = document.querySelector('.season-strip');
  var list = document.querySelector('.season-list');
  if (!strip || !list) return;
  var now = list.querySelector('.season.is-now');
  if (now) { var q = strip.querySelector('[data-q="' + now.getAttribute('data-season') + '"]'); if (q) q.classList.add('is-now'); }
  var set = function (key) {
    strip.classList.toggle('is-hovering', !!key);
    list.classList.toggle('is-hovering', !!key);
    strip.querySelectorAll('.season-q').forEach(function (el) { el.classList.toggle('is-hot', el.getAttribute('data-q') === key); });
    list.querySelectorAll('.season').forEach(function (el) { el.classList.toggle('is-hot', el.getAttribute('data-season') === key); });
  };
  list.querySelectorAll('.season').forEach(function (el) {
    el.addEventListener('mouseenter', function () { set(el.getAttribute('data-season')); });
    el.addEventListener('focusin', function () { set(el.getAttribute('data-season')); });
  });
  list.addEventListener('mouseleave', function () { set(null); });
  list.addEventListener('focusout', function (e) { if (!list.contains(e.relatedTarget)) set(null); });
})();
