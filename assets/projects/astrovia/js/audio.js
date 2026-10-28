/* ==========================================================================
   ASTROVIA — audio.js
   Optional generated ambience (Web Audio, no files): a slow evolving drone and a
   soft "whoosh" whose level follows the travel speed. OFF by default; only
   starts after the visitor turns it on (a user gesture). Everything on the
   site works without sound.
   ========================================================================== */
(function (global) {
  'use strict';
  var A = (global.ASTROVIA = global.ASTROVIA || {});
  var bus = A.bus, settings = A.settings;
  var ctx = null, master = null, whoosh = null, whooshGain = null, started = false, warp = 0;

  function build() {
    var AC = global.AudioContext || global.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);

    // drone: three detuned sines through a slow low-pass
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520; lp.Q.value = 0.6; lp.connect(master);
    [55, 82.5, 110.4, 164.8].forEach(function (f, i) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = i === 3 ? 'triangle' : 'sine'; o.frequency.value = f; g.gain.value = [0.34, 0.2, 0.12, 0.05][i];
      var lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = 0.04 + i * 0.023; lg.gain.value = g.gain.value * 0.5;
      lfo.connect(lg); lg.connect(g.gain);
      o.connect(g); g.connect(lp); o.start(); lfo.start();
    });
    var sweep = ctx.createOscillator(), sg = ctx.createGain();
    sweep.frequency.value = 0.02; sg.gain.value = 180; sweep.connect(sg); sg.connect(lp.frequency); sweep.start();

    // whoosh: filtered noise
    var len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0), last = 0;
    for (var i = 0; i < len; i++) { var w = Math.random() * 2 - 1; last = (last + 0.04 * w) / 1.04; d[i] = last * 3.2; }
    whoosh = ctx.createBufferSource(); whoosh.buffer = buf; whoosh.loop = true;
    var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 420; bp.Q.value = 0.5;
    whooshGain = ctx.createGain(); whooshGain.gain.value = 0;
    whoosh.connect(bp); bp.connect(whooshGain); whooshGain.connect(master); whoosh.start();
    started = true;
    return true;
  }

  function apply() {
    var on = !!settings.get('sound');
    if (on && !started && !build()) { settings.set('sound', false); return; }
    if (!ctx) return;
    if (on) {
      if (ctx.state === 'suspended') ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 1.6);
    } else {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      setTimeout(function () { if (ctx && !settings.get('sound') && ctx.state === 'running') ctx.suspend(); }, 700);
    }
  }

  bus.on('settings:change', function (d) { if (d.key === 'sound') apply(); });
  bus.on('journey:progress', function (d) {
    warp = d.warp || 0;
    if (!ctx || !settings.get('sound') || settings.effectiveMotion() === 'reduced') return;
    whooshGain.gain.setTargetAtTime(warp * 0.5, ctx.currentTime, 0.15);
  });
  document.addEventListener('visibilitychange', function () {
    if (!ctx || !settings.get('sound')) return;
    if (document.hidden) ctx.suspend(); else ctx.resume();
  });
  A.audio = { isOn: function () { return !!settings.get('sound'); } };
})(window);
