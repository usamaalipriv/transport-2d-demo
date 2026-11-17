/* Transport 2D Sénégal demo: shared behaviour. No dependencies. */
(function () {
  'use strict';
  var PHONE = '221781300198';
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var waLink = function (text) { return 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(text); };

  /* Interface text in the page's language (html lang="en" or "fr") */
  var NB = ' '; // French puts a non-breaking space before : ? ! ;
  var T = (document.documentElement.lang || '').slice(0, 2) === 'fr' ? {
    close: 'Fermer', menu: 'Menu',
    regionWa: function (n) { return 'Bonjour Transport 2D Sénégal. J’ai besoin d’un transport de carburant vers la région de ' + n + '. Pouvez-vous confirmer que vous livrez dans cette région et ce qu’il vous faut pour établir un devis' + NB + '?'; },
    regionField: function (n) { return 'Région de ' + n; },
    regionSelected: function (n) { return 'Région de ' + n + ' sélectionnée.'; },
    needs: function (k) { return k === 0 ? 'Aucun besoin sélectionné' : k === 1 ? '1 besoin sélectionné' : k + ' besoins sélectionnés'; },
    thisStatus: 'ce statut',
    valueMissing: function (l) { return 'Renseignez ce champ' + NB + ': ' + l + '.'; },
    typeMismatch: 'Saisissez une adresse e-mail, par exemple nom@entreprise.sn.',
    patternMismatch: 'Utilisez uniquement des chiffres, des espaces et un + facultatif, au moins 8 chiffres.',
    rangeUnderflow: 'Saisissez un nombre supérieur à zéro.',
    badInput: 'Saisissez un nombre.',
    choose: function (l) { return 'Faites un choix' + NB + ': ' + l + '.'; },
    attach: function (l) { return 'Joignez le fichier demandé' + NB + ': ' + l + '.'; },
    maxFiles: function (n) { return 'Joignez ' + n + ' fichiers au maximum.'; },
    badType: function (f, a) { return f + ' n’est pas un type de fichier accepté (' + a + ').'; },
    tooBig: function (f, mb) { return f + ' dépasse ' + mb + ' Mo.'; },
    tick: 'Cochez cette case pour continuer.',
    waIntro: 'Bonjour Transport 2D Sénégal. Je viens d’envoyer une demande sur votre site.',
    sending: 'Envoi en cours'
  } : {
    close: 'Close', menu: 'Menu',
    regionWa: function (n) { return 'Hello Transport 2D Sénégal. I need fuel transport to the ' + n + ' region. Can you confirm whether you deliver there and what you need from me for a quote?'; },
    regionField: function (n) { return n + ' region'; },
    regionSelected: function (n) { return n + ' region selected.'; },
    needs: function (k) { return k === 0 ? 'No needs selected yet' : k === 1 ? '1 need selected' : k + ' needs selected'; },
    thisStatus: 'this status',
    valueMissing: function (l) { return 'Fill in ' + l.toLowerCase() + '.'; },
    typeMismatch: 'Enter an email address like name@company.sn.',
    patternMismatch: 'Use digits, spaces and an optional + only, at least 8 digits.',
    rangeUnderflow: 'Enter a number above zero.',
    badInput: 'Enter a number.',
    choose: function (l) { return 'Choose ' + l.toLowerCase() + '.'; },
    attach: function (l) { return 'Attach your ' + l + '.'; },
    maxFiles: function (n) { return 'Attach up to ' + n + ' files.'; },
    badType: function (f, a) { return f + ' is not an accepted file type (' + a + ').'; },
    tooBig: function (f, mb) { return f + ' is larger than ' + mb + ' MB.'; },
    tick: 'Tick this box to continue.',
    waIntro: 'Hello Transport 2D Sénégal. I just sent a request on your website.',
    sending: 'Sending'
  };

  /* Analytics hook (brief 16.1: record WhatsApp clicks). Pushes to dataLayer if a tag manager is added later. */
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-track]');
    if (a) window.dataLayer.push({ event: a.getAttribute('data-track') + '_click', page: location.pathname, label: (a.textContent || '').trim().slice(0, 60) });
  });

  /* Mobile menu */
  var menuBtn = $('.menu-btn');
  var menu = $('#mobile-menu');
  if (menuBtn && menu) {
    var setMenu = function (open) {
      menuBtn.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
      $('.site-header').classList.toggle('is-open', open);
      $('.menu-label', menuBtn).textContent = open ? T.close : T.menu;
      if (open) { var first = $('a', menu); if (first) first.focus(); }
    };
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); }
    });
    window.matchMedia('(min-width: 1321px)').addEventListener('change', function (mq) { if (mq.matches) setMenu(false); });
  }

  /* Header: transparent over the opening photo, solid navy once the page has scrolled */
  var onScroll = function () { document.body.classList.toggle('is-scrolled', window.scrollY > 24); };
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });
  onScroll();

  /* Reveal: blocks marked data-reveal fade up once when they enter the screen.
     Section heads and service blocks on inner pages get the same treatment. */
  $$('main .section-head, main .service-block, main .split > *').forEach(function (el) {
    if (!el.closest('.page-intro') && !el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', '');
  });
  var reveals = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        rio.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { rio.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Floating WhatsApp button: step aside when a form's buttons or the footer are on screen */
  var float = $('.wa-float');
  if (float && 'IntersectionObserver' in window) {
    var visible = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) visible.add(en.target); else visible.delete(en.target); });
      float.classList.toggle('is-hidden', visible.size > 0);
    }, { threshold: 0 });
    $$('.form-actions, .site-footer, .form-success').forEach(function (el) { io.observe(el); });
    float._io = io;
  }

  /* Service areas map */
  var panel = $('#region-panel');
  var mapRoot = $('.map-interactive');
  if (panel && mapRoot) {
    var picker = $('#region-picker');
    var regions = $$('.region', mapRoot);
    var select = function (iso, opts) {
      var link = regions.filter(function (r) { return r.getAttribute('data-region') === iso; })[0];
      regions.forEach(function (r) { r.classList.toggle('is-active', r === link); });
      $$('.region-label', mapRoot).forEach(function (t) { t.classList.toggle('is-active', link && t.getAttribute('data-for') === iso); });
      if (!link) {
        $('[data-empty]', panel).hidden = false;
        $('[data-filled]', panel).hidden = true;
        if (picker) picker.value = '';
        return;
      }
      var name = link.getAttribute('data-label');
      $('[data-empty]', panel).hidden = true;
      $('[data-filled]', panel).hidden = false;
      $('[data-region-name]', panel).textContent = name;
      $('[data-region-wa]', panel).href = waLink(T.regionWa(name));
      $('[data-region-quote]', panel).href = 'quote.html?delivery=' + encodeURIComponent(T.regionField(name));
      if (picker) picker.value = iso;
      if (opts && opts.announce) { var live = $('#region-live'); if (live) live.textContent = T.regionSelected(name); }
    };
    mapRoot.addEventListener('click', function (e) {
      var r = e.target.closest('.region');
      if (!r) return;
      e.preventDefault();
      var iso = r.getAttribute('data-region');
      history.replaceState(null, '', '#r-' + iso);
      select(iso, { announce: true });
      if (window.matchMedia('(max-width: 900px)').matches) panel.scrollIntoView({ block: 'nearest' });
    });
    if (picker) picker.addEventListener('change', function () {
      history.replaceState(null, '', picker.value ? '#r-' + picker.value : location.pathname);
      select(picker.value, { announce: true });
    });
    var fromHash = function () { var m = location.hash.match(/^#r-(SN-[A-Z]{2})$/); if (m) select(m[1]); };
    window.addEventListener('hashchange', fromHash);
    fromHash();
  }

  /* Service selection tool (services page) */
  var selector = $('#service-selector');
  if (selector) {
    var boxes = $$('input[type="checkbox"]', selector);
    var count = $('.selector-count', selector);
    var go = $('#selector-go', selector);
    var update = function () {
      var picked = boxes.filter(function (b) { return b.checked; }).map(function (b) { return b.value; });
      count.textContent = T.needs(picked.length);
      go.href = 'quote.html' + (picked.length ? '?services=' + picked.map(encodeURIComponent).join(',') : '');
    };
    boxes.forEach(function (b) { b.addEventListener('change', update); });
    update();
  }

  /* Prefill quote form from the URL (?services=a,b&service=a&delivery=…) */
  var params = new URLSearchParams(location.search);
  var quoteForm = $('#quote-form');
  if (quoteForm) {
    var wanted = (params.get('services') || params.get('service') || '').split(',').filter(Boolean);
    wanted.forEach(function (v) {
      var box = quoteForm.querySelector('input[name="services"][value="' + CSS.escape(v) + '"]');
      if (box) box.checked = true;
    });
    var delivery = params.get('delivery');
    if (delivery && quoteForm.elements.delivery_location) quoteForm.elements.delivery_location.value = delivery.slice(0, 120);
  }

  /* Document library filter */
  var lib = $('#doc-library');
  if (lib) {
    var rows = $$('tbody tr', lib);
    var filters = $$('.filter', lib);
    var empty = $('.empty', lib);
    var table = $('table', lib);
    var emptyText = $('[data-empty-status]', lib);
    filters.forEach(function (btn) {
      var status = btn.getAttribute('data-status');
      var n = rows.filter(function (r) { return status === 'all' || r.getAttribute('data-status') === status; }).length;
      var c = $('.count', btn); if (c) c.textContent = '(' + n + ')';
      btn.addEventListener('click', function () {
        filters.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        var shown = 0;
        rows.forEach(function (r) {
          var show = status === 'all' || r.getAttribute('data-status') === status;
          r.hidden = !show; if (show) shown++;
        });
        table.hidden = shown === 0;
        empty.hidden = shown !== 0;
        if (emptyText) emptyText.textContent = btn.getAttribute('data-label') || T.thisStatus;
      });
    });
  }

  /* Forms: validation, file checks, loading, success, WhatsApp hand-off */
  var MESSAGES = {
    valueMissing: T.valueMissing,
    typeMismatch: function () { return T.typeMismatch; },
    patternMismatch: function () { return T.patternMismatch; },
    rangeUnderflow: function () { return T.rangeUnderflow; },
    badInput: function () { return T.badInput; }
  };
  var labelFor = function (el) {
    var field = el.closest('.field');
    var l = null;
    if (field) {
      // Radio groups are named by the group label, not by their first option
      l = (el.type === 'radio' || el.type === 'checkbox') ? field.querySelector('.label') : (el.id && field.querySelector('label[for="' + el.id + '"]'));
      l = l || field.querySelector('.label') || field.querySelector('label');
    }
    return l ? l.textContent.replace('*', '').replace(/\(.*?\)/g, '').trim() : el.name;
  };
  var setError = function (el, msg) {
    var field = el.closest('.field') || el.closest('.consent');
    if (!field) return;
    var out = field.querySelector('.field-error');
    if (!out) { out = document.createElement('p'); out.className = 'field-error'; out.id = (el.id || el.name) + '-error'; field.appendChild(out); }
    // Two controls can share one field (quantity + unit): only the control that set the error may clear it
    if (!msg && out.getAttribute('data-owner') && out.getAttribute('data-owner') !== el.name) return;
    out.setAttribute('data-owner', msg ? el.name : '');
    out.textContent = msg || '';
    field.classList.toggle('has-error', !!msg);
    if (msg) {
      el.setAttribute('aria-invalid', 'true');
      var ids = (el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      if (ids.indexOf(out.id) < 0) ids.push(out.id);
      el.setAttribute('aria-describedby', ids.join(' '));
    } else {
      el.removeAttribute('aria-invalid');
    }
  };
  var checkFiles = function (input) {
    var max = parseFloat(input.getAttribute('data-max-mb') || '10');
    var allowed = (input.getAttribute('data-types') || '').split(',').filter(Boolean);
    var files = Array.prototype.slice.call(input.files || []);
    var maxCount = parseInt(input.getAttribute('data-max-files') || '5', 10);
    if (input.required && files.length === 0) return T.attach(labelFor(input));
    if (files.length > maxCount) return T.maxFiles(maxCount);
    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      var ext = (f.name.split('.').pop() || '').toLowerCase();
      if (allowed.length && allowed.indexOf(ext) < 0) return T.badType(f.name, allowed.join(', ').toUpperCase());
      if (f.size > max * 1024 * 1024) return T.tooBig(f.name, max);
    }
    return '';
  };
  var validate = function (el) {
    if (el.type === 'file') { var fe = checkFiles(el); setError(el, fe); return !fe; }
    if (el.type === 'checkbox' && el.required) {
      var ok = el.checked;
      setError(el, ok ? '' : (el.getAttribute('data-required-msg') || T.tick));
      return ok;
    }
    if (el.willValidate === false) return true;
    var v = el.validity;
    if (v.valid) { setError(el, ''); return true; }
    var key = ['valueMissing', 'typeMismatch', 'patternMismatch', 'rangeUnderflow', 'badInput'].filter(function (k) { return v[k]; })[0];
    var msg = key ? MESSAGES[key](labelFor(el)) : el.validationMessage;
    if (key === 'valueMissing' && (el.type === 'radio' || el.tagName === 'SELECT')) msg = T.choose(labelFor(el));
    setError(el, msg);
    return false;
  };
  var summaryText = function (form) {
    var lines = [form.getAttribute('data-wa-intro') || T.waIntro];
    $$('[data-summary]', form).forEach(function (el) {
      var val = '';
      if (el.type === 'checkbox' || el.type === 'radio') {
        if (!el.checked) return;
        val = el.getAttribute('data-summary-value') || el.value;
        var key = el.getAttribute('data-summary');
        var existing = lines.filter(function (l) { return l.indexOf(key + ': ') === 0; })[0];
        if (existing) { lines[lines.indexOf(existing)] = existing + ', ' + val; return; }
        lines.push(key + ': ' + val); return;
      }
      val = (el.value || '').trim();
      if (el.tagName === 'SELECT' && el.selectedIndex > 0) val = el.options[el.selectedIndex].text;
      if (el.tagName === 'SELECT' && el.selectedIndex <= 0) val = '';
      if (!val) return;
      var unit = el.getAttribute('data-unit-from') ? form.elements[el.getAttribute('data-unit-from')] : null;
      if (unit && unit.value) val += ' ' + unit.options[unit.selectedIndex].text;
      lines.push(el.getAttribute('data-summary') + ': ' + val.slice(0, 300));
    });
    return lines.join('\n');
  };

  $$('form[data-demo-form]').forEach(function (form) {
    var controls = $$('input, select, textarea', form).filter(function (el) { return el.type !== 'hidden' && !el.closest('.hp'); });
    controls.forEach(function (el) {
      var textLike = ['checkbox', 'radio', 'file'].indexOf(el.type) < 0;
      el.addEventListener('blur', function () { if (textLike && (el.closest('.has-error') || el.value)) validate(el); });
      el.addEventListener('change', function () { if (el.type === 'file' || el.type === 'checkbox' || el.closest('.has-error')) validate(el); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.querySelector('.hp input') && form.querySelector('.hp input').value) return; // spam trap
      var bad = controls.filter(function (el) { return !validate(el); });
      var summary = $('.error-summary', form);
      if (bad.length) {
        var list = $('ul', summary);
        list.innerHTML = '';
        var seen = {};
        bad.forEach(function (el) {
          if (seen[el.name]) return; seen[el.name] = 1;
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = '#' + el.id;
          var errEl = (el.closest('.field') || el.closest('.consent')).querySelector('.field-error');
          a.textContent = errEl ? errEl.textContent : labelFor(el);
          a.addEventListener('click', function (ev) { ev.preventDefault(); el.focus(); });
          li.appendChild(a); list.appendChild(li);
        });
        summary.hidden = false;
        summary.focus();
        return;
      }
      summary.hidden = true;

      var btn = $('button[type="submit"]', form);
      var original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner" aria-hidden="true"></span>' + T.sending;
      form.setAttribute('aria-busy', 'true');

      window.setTimeout(function () {
        var text = summaryText(form);
        var success = document.getElementById(form.getAttribute('data-success'));
        $('[data-wa-summary]', success).href = waLink(text);
        form.hidden = true;
        form.removeAttribute('aria-busy');
        btn.disabled = false;
        btn.innerHTML = original;
        success.hidden = false;
        success.focus();
        window.dataLayer.push({ event: 'form_submit', form: form.id });
        if (float && float._io) float._io.observe(success);
      }, 900);
    });

    var again = document.querySelector('[data-reset="' + form.id + '"]');
    if (again) again.addEventListener('click', function () {
      form.reset();
      controls.forEach(function (el) { setError(el, ''); });
      document.getElementById(form.getAttribute('data-success')).hidden = true;
      form.hidden = false;
      var first = controls[0]; if (first) first.focus();
    });
  });
})();
