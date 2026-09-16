(function (global) {
  function device() {
    try {
      var k = "seeker-fleet-device-v1";
      var id = localStorage.getItem(k);
      if (!id) {
        id = (crypto.randomUUID && crypto.randomUUID()) || ("d" + Date.now());
        localStorage.setItem(k, id);
      }
      return id;
    } catch (e) {
      return "anon";
    }
  }
  function source() {
    var ua = navigator.userAgent || "";
    if (/Seeker|SolanaMobile|solana-mobile|Saga/i.test(ua)) return "seeker";
    if (global.solanaMobile || global.solana) return "seeker";
    return "web";
  }
  function api() {
    return "/api/fleet";
  }
  global.SeekerFleet = {
    pull: function (game, cb) {
      fetch(api() + "?game=" + encodeURIComponent(game))
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (j) { cb(j && j.scores ? j.scores : null); })
        .catch(function () { cb(null); });
    },
    push: function (game, name, score, wave, cb) {
      fetch(api(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game: game,
          name: name,
          score: score,
          wave: wave || 1,
          device: device(),
          source: source()
        })
      })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (j) { cb && cb(j && j.scores ? j.scores : null); })
        .catch(function () { cb && cb(null); });
    }
  };
})(window);
