/*
 * FII 首頁互動：手機選單、立繪視差、區塊淡入。
 * 選單永遠啟用；動態效果在使用者開啟「減少動態效果」時不啟用。沒有 JavaScript 時內容照常顯示。
 */
(function () {
  // 0. 手機選單（漢堡）
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // 1. 視差：把捲動距離寫進 --p，CSS 依各層的速度移動
  var art = document.querySelector('.hero-art');
  if (art) {
    var ticking = false;
    var update = function () {
      var y = Math.min(window.scrollY, window.innerHeight * 1.2);
      art.style.setProperty('--p', y.toFixed(1));
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  // 2. 淡入：區塊進入畫面時加上 is-in；同一組的卡片依序延遲出現
  var groups = [
    ['.covers > div:first-child'],
    ['.cover'],
    ['.covers .center'],
    ['.mm-card'],
    ['.support .text', '.support .btn'],
    ['.about .head', '.about .card'],
    ['.team .mark', '.team .text']
  ];
  var targets = [];
  groups.forEach(function (sels) {
    var i = 0;
    sels.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('reveal');
        el.style.setProperty('--delay', (i * 0.12) + 's');
        targets.push(el);
        i++;
      });
    });
  });
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(function (el) { io.observe(el); });
})();
