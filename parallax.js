/* 首頁立繪視差：捲動時立繪與光圈以不同速度移動。偏好減少動態的使用者不啟用。 */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var art = document.querySelector('.hero-art');
  if (!art) return;
  var ticking = false;
  function update() {
    var y = Math.min(window.scrollY, window.innerHeight * 1.2);
    art.style.setProperty('--p', y.toFixed(1));
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();
