(function () {
  var c = window.CC_SITE_CONFIG;
  if (!c) return;

  function marketing(path) {
    var base = (c.marketingBaseUrl || '').replace(/\/$/, '');
    if (!base && typeof location !== 'undefined') {
      base = location.origin + location.pathname.replace(/\/[^/]*$/, '').replace(/\/$/, '');
    }
    return base + (path.charAt(0) === '/' ? path : '/' + path);
  }

  function pwa(path) {
    if (!c.pwaBaseUrl) return '#';
    return c.pwaBaseUrl.replace(/\/$/, '') + (path.charAt(0) === '/' ? path : '/' + path);
  }

  function set(id, url) {
    var el = document.getElementById(id);
    if (el && url) el.href = url;
  }

  set('link-open-app', pwa(c.paths.openApp || '/home'));
  set('link-open-app-hero', pwa(c.paths.openApp || '/home'));
  set('link-open-app-footer', pwa(c.paths.openApp || '/home'));
  set('link-about', pwa(c.paths.about || '/about'));
  set('link-privacy', marketing(c.paths.privacy || '/privacy.html'));
  set('link-eula', marketing(c.paths.eula || '/eula.html'));
  set('link-home', marketing('/'));

  if (c.supportEmail) {
    var mail = 'mailto:' + c.supportEmail;
    ['link-support', 'link-support-footer'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.href = mail;
    });
  }

  var appStore = document.getElementById('link-app-store');
  var playStore = document.getElementById('link-play-store');
  if (c.appStoreUrl && appStore) {
    appStore.href = c.appStoreUrl;
    appStore.removeAttribute('aria-disabled');
    appStore.classList.remove('store-badge--soon');
  }
  if (c.playStoreUrl && playStore) {
    playStore.href = c.playStoreUrl;
    playStore.removeAttribute('aria-disabled');
    playStore.classList.remove('store-badge--soon');
  }
})();
