/* ==========================================================================
   ASTROVIA — app.js   Bootstrap. Builds the interface, then starts the engine.
   ========================================================================== */
(function (global) {
  'use strict';
  var A = (global.ASTROVIA = global.ASTROVIA || {});
  A.assetBase = 'assets/';

  function start() {
    try { A.ui.init(); } catch (e) { console.error('UI failed to start', e); }
    if (A.settings.get('lite')) {
      // Simple view requested: skip the 3D engine entirely.
      document.documentElement.classList.add('no-3d');
      A.bus.emit('engine:failed', { reason: 'lite', message: 'Simple view' });
      return;
    }
    try { A.engine.init(); } catch (e) {
      console.error(e);
      document.documentElement.classList.add('no-3d');
      A.bus.emit('engine:failed', { reason: 'error', message: String(e && e.message || e) });
    }
  }

  function boot() {
    // From file:// the browser blocks image textures read through WebGL, so use the embedded copy.
    if (location.protocol === 'file:') {
      var s = document.createElement('script');
      s.src = 'assets/earth-data.js';
      s.onload = start; s.onerror = start;
      document.head.appendChild(s);
    } else start();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})(window);
