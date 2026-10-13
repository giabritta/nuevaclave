(function () {
  'use strict';

  var oggi = new Date();
  var oggiISO = oggi.getFullYear() + '-' + String(oggi.getMonth() + 1).padStart(2, '0') + '-' + String(oggi.getDate()).padStart(2, '0');

  // Stato di un evento rispetto ad oggi: 'futuro' | 'in-corso' | 'passato'
  function stato(el) {
    var s = el.getAttribute('data-start'), e = el.getAttribute('data-end') || s;
    if (e < oggiISO) return 'passato';
    if (s <= oggiISO) return 'in-corso';
    return 'futuro';
  }
  var etichette = { 'futuro': 'In arrivo', 'in-corso': 'In corso', 'passato': 'Concluso' };

  document.querySelectorAll('[data-start]').forEach(function (el) {
    var st = stato(el);
    el.classList.add('is-' + st);
    var b = el.querySelector('[data-badge]');
    if (b) b.textContent = etichette[st];
  });

  // Pagina eventi: sposta i passati in archivio (dal più recente)
  var up = document.querySelector('[data-list="upcoming"]');
  var past = document.querySelector('[data-list="past"]');
  if (up && past) {
    var passati = Array.prototype.filter.call(up.children, function (c) { return c.classList.contains('is-passato'); });
    passati.reverse().forEach(function (c) { past.appendChild(c); });
    if (!up.children.length) document.querySelector('[data-empty]').hidden = false;
  }

  // Home: striscia "prossimo evento"
  var strip = document.querySelector('[data-next-events]');
  if (strip) {
    var next = Array.prototype.find.call(strip.querySelectorAll('.strip-item'), function (a) {
      return a.getAttribute('data-end') >= oggiISO;
    });
    if (next) next.hidden = false; else strip.hidden = true;
  }

  // Header e menu mobile
  var header = document.querySelector('[data-header]');
  var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 40); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-nav]');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
    document.body.classList.toggle('nav-open', open);
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', false); document.body.classList.remove('nav-open');
    });
  });

  // Slideshow hero
  var slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var i = 0;
    setInterval(function () {
      slides[i].classList.remove('is-active');
      i = (i + 1) % slides.length;
      slides[i].classList.add('is-active');
    }, 6000);
  }

  // Lightbox
  var links = document.querySelectorAll('[data-lightbox]');
  if (links.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = '<button class="lb-close" aria-label="Chiudi">×</button><img alt="">';
    document.body.appendChild(lb);
    var img = lb.querySelector('img');
    var chiudi = function () { lb.classList.remove('is-open'); };
    links.forEach(function (a) {
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        img.src = a.getAttribute('href');
        img.alt = (a.querySelector('img') || {}).alt || '';
        lb.classList.add('is-open');
      });
    });
    lb.addEventListener('click', chiudi);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') chiudi(); });
  }

  // Condivisione evento
  var share = document.querySelector('[data-share]');
  if (share) {
    var hint = share.querySelector('[data-share-hint]');
    var mostra = function (msg) { hint.textContent = msg; hint.hidden = false; };
    var url = share.dataset.url, testo = share.dataset.text;

    share.querySelector('[data-copy]').addEventListener('click', function () {
      var ok = function () { mostra('Link copiato! Incollalo dove vuoi.'); };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(ok, function () { prompt('Copia il link:', url); });
      else prompt('Copia il link:', url);
    });

    // Instagram non accetta link da web: su smartphone condividiamo la locandina come file
    share.querySelector('[data-share-ig]').addEventListener('click', function () {
      var scarica = function () {
        var a = document.createElement('a');
        a.href = share.dataset.image; a.download = share.dataset.filename;
        document.body.appendChild(a); a.click(); a.remove();
        mostra('Locandina scaricata: pubblicala su Instagram come post o storia e aggiungi il link dell\'evento (copiato) nello sticker "Link".');
        if (navigator.clipboard) navigator.clipboard.writeText(url).catch(function () {});
      };
      fetch(share.dataset.image).then(function (r) { return r.blob(); }).then(function (blob) {
        var file = new File([blob], share.dataset.filename, { type: blob.type || 'image/jpeg' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          if (navigator.clipboard) navigator.clipboard.writeText(url).catch(function () {});
          return navigator.share({ files: [file], title: share.dataset.title, text: testo + ' ' + url });
        }
        scarica();
      }).catch(function (e) { if (!e || e.name !== 'AbortError') scarica(); });
    });
  }

  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = oggi.getFullYear(); });
})();
