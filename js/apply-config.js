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

  function betaSignupUrl() {
    if (!c.betaSignupEmail) return null;
    var subject = c.betaSignupSubject || 'UsTonight beta';
    return (
      'mailto:' +
      encodeURIComponent(c.betaSignupEmail) +
      '?subject=' +
      encodeURIComponent(subject)
    );
  }

  function set(id, url) {
    var el = document.getElementById(id);
    if (el && url) el.href = url;
  }

  var beta = betaSignupUrl();
  set('link-beta', beta);
  set('link-beta-hero', beta);
  set('link-beta-footer', beta);
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
    appStore.textContent = 'Download on the App Store';
  }
  if (c.playStoreUrl && playStore) {
    playStore.href = c.playStoreUrl;
    playStore.removeAttribute('aria-disabled');
    playStore.classList.remove('store-badge--soon');
    playStore.textContent = 'Get it on Google Play';
  }
})();
