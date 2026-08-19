(() => {
  const resetParams = new URLSearchParams(window.location.search);
  if (resetParams.get('reset') === '1') {
    Object.keys(window.localStorage)
      .filter(key => key.startsWith('suzuran-'))
      .forEach(key => window.localStorage.removeItem(key));

    resetParams.delete('reset');
    const cleanUrl = window.location.pathname
      + (resetParams.toString() ? `?${resetParams.toString()}` : '')
      + window.location.hash;
    window.location.replace(cleanUrl);
    return;
  }

  const groups = ['蘭臺', '見山', '迴聲'];
  const previewValue = '__preview__';
  const groupKey = 'suzuran-newsroom';
  const nameKey = 'suzuran-investigator-name';
  const realNameKey = 'suzuran-investigator-real-name';
  const versionKey = 'suzuran-name-system-version';
  const formalResetKey = 'suzuran-formal-reset-version';
  const formalResetVersion = '2026-08-14-launch';
  const progressModeKey = 'suzuran-progress-mode';
  const testSessionKey = 'suzuran-test-session';
  const previewActiveKey = 'suzuran-preview-mode-active';
  const previewNameKey = 'suzuran-preview-investigator-name';
  const previewRealNameKey = 'suzuran-preview-real-name';
  const overlayId = 'suzuran-group-selection';

  const registered = () =>
    localStorage.getItem(versionKey) === '2' &&
    Boolean(localStorage.getItem(nameKey));

  const validGroup = () => groups.includes(localStorage.getItem(groupKey));
  const testModeActive = () => window.__SUZURAN_TEST_MODE__ === true;

  function clearPreviewSession() {
    sessionStorage.removeItem(previewActiveKey);
    sessionStorage.removeItem(previewNameKey);
    sessionStorage.removeItem(previewRealNameKey);
  }

  function cleanPreviewParam() {
    const url = new URL(window.location.href);
    if (!url.searchParams.has('preview')) return;
    url.searchParams.delete('preview');
    window.history.replaceState(null, '', url);
  }

  function seedPreviewMode() {
    const displayName = sessionStorage.getItem(previewNameKey) || '見習觀察員';
    const realName = sessionStorage.getItem(previewRealNameKey) || '觀賞者';
    const alreadySeeded =
      localStorage.getItem(formalResetKey) === formalResetVersion &&
      registered() &&
      validGroup();

    sessionStorage.setItem(previewActiveKey, '1');
    localStorage.setItem(formalResetKey, formalResetVersion);
    localStorage.setItem(realNameKey, realName);
    localStorage.setItem(nameKey, displayName);
    localStorage.setItem(versionKey, '2');
    localStorage.setItem(groupKey, groups[0]);
    localStorage.removeItem(progressModeKey);
    localStorage.removeItem(testSessionKey);
    cleanPreviewParam();

    if (!alreadySeeded) {
      window.location.reload();
      return true;
    }
    return false;
  }

  const initialParams = new URLSearchParams(window.location.search);
  if (!testModeActive() && initialParams.get('preview') === '1') {
    clearPreviewSession();
    cleanPreviewParam();
  }

  const previewRequested =
    testModeActive() &&
    (initialParams.get('preview') === '1' || sessionStorage.getItem(previewActiveKey) === '1');

  if (previewRequested && seedPreviewMode()) return;

  function removeOverlay() {
    document.getElementById(overlayId)?.remove();
    document.documentElement.classList.remove('group-selection-open');
  }

  function render() {
    if (!registered() || validGroup()) {
      removeOverlay();
      return;
    }
    if (document.getElementById(overlayId)) return;

    document.documentElement.classList.add('group-selection-open');
    const overlay = document.createElement('div');
    overlay.id = overlayId;
    overlay.innerHTML = `
      <style>
        html.group-selection-open,html.group-selection-open body{overflow:hidden!important}
        #${overlayId}{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:24px;color:#2d2117;background:rgba(66,54,38,.95);font-family:'Noto Serif TC','Times New Roman',serif}
        #${overlayId} .card{width:min(680px,100%);padding:clamp(28px,6vw,54px);border:5px double #2d2117;background:#ead9ad;box-shadow:0 18px 60px rgba(20,14,8,.45)}
        #${overlayId} .eyebrow{margin:0 0 12px;color:#8f251d;font-size:11px;letter-spacing:.18em}
        #${overlayId} h1{margin:0;font-size:clamp(30px,7vw,46px);letter-spacing:.08em}
        #${overlayId} .desc{margin:18px 0 26px;font-size:14px;line-height:1.9}
        #${overlayId} .options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
        #${overlayId} .option{display:flex!important;align-items:center!important;justify-content:center!important;text-align:center!important;box-sizing:border-box!important;min-height:108px;padding:18px 10px!important;border:1px solid #55442f!important;color:#2d2117;background:rgba(255,255,255,.16);font:700 clamp(22px,5vw,30px) 'Noto Serif TC',serif;line-height:1.2!important;letter-spacing:.12em;white-space:nowrap!important;cursor:pointer;transform:none!important;text-indent:0!important}
        #${overlayId} .option.selected{display:flex!important;align-items:center!important;justify-content:center!important;text-align:center!important;padding:18px 10px!important;border:1px solid #8f251d!important;color:#f2e4c2;background:#8f251d;outline:none!important;box-shadow:inset 0 0 0 4px #ead9ad,inset 0 0 0 5px #8f251d;transform:none!important;text-indent:0!important}
        #${overlayId} .preview-option{grid-column:1/-1;min-height:78px!important;padding:14px 18px!important;letter-spacing:.04em!important}
        #${overlayId} .preview-option span{display:grid;gap:6px}
        #${overlayId} .preview-option strong{font-size:clamp(18px,4vw,24px);letter-spacing:.08em}
        #${overlayId} .preview-option small{font:500 11px/1.5 system-ui,sans-serif;letter-spacing:.02em;white-space:normal}
        #${overlayId} .confirm{width:100%;min-height:50px;margin-top:22px;border:1px solid #2d2117;color:#f2e4c2;background:#2d2117;font:14px 'Noto Serif TC',serif;letter-spacing:.08em;cursor:pointer}
        #${overlayId} .confirm:disabled{cursor:not-allowed;opacity:.42}
        #${overlayId} .note{display:block;margin-top:15px;color:#756650;font-size:11px;line-height:1.7;text-align:center}
        @media(max-width:560px){#${overlayId}{padding:14px}#${overlayId} .card{padding:28px 20px}#${overlayId} .options{grid-template-columns:1fr}#${overlayId} .option,#${overlayId} .option.selected{min-height:68px;padding:14px 10px!important}#${overlayId} .preview-option{grid-column:auto;min-height:72px!important}}
      </style>
      <section class="card" role="dialog" aria-modal="true" aria-labelledby="group-title">
        <p class="eyebrow">TEAM REGISTRATION / 調查小隊登記</p>
        <h1 id="group-title">請選擇所屬組別</h1>
        <p class="desc">姓名登記已完成。正式參與者請選擇調查小隊；若只是要測試或參考完整玩法，可使用下方的觀賞模式。</p>
        <div class="options" role="radiogroup" aria-label="組別或觀賞模式">
          ${groups.map(group => `<button class="option" type="button" role="radio" aria-checked="false" data-group="${group}">${group}</button>`).join('')}
          <button class="option preview-option" type="button" role="radio" aria-checked="false" data-group="${previewValue}"><span><strong>測試／觀賞模式</strong><small>供後續實習生參考・進度與正式活動完全隔離</small></span></button>
        </div>
        <button class="confirm" type="button" disabled>確認組別並進入市役所</button>
        <small class="note">正式玩家請與同組成員選擇完全相同的組別；觀賞模式可隨時重置，不會改動正式進度。</small>
      </section>`;

    let selected = '';
    const options = [...overlay.querySelectorAll('.option')];
    const confirm = overlay.querySelector('.confirm');
    options.forEach(option => option.addEventListener('click', () => {
      selected = option.dataset.group || '';
      options.forEach(item => {
        const active = item === option;
        item.classList.toggle('selected', active);
        item.setAttribute('aria-checked', String(active));
      });
      confirm.disabled = !selected;
      confirm.textContent = selected === previewValue
        ? '進入測試／觀賞模式'
        : '確認組別並進入市役所';
    }));
    confirm.addEventListener('click', () => {
      if (selected === previewValue) {
        const displayName = localStorage.getItem(nameKey) || '見習觀察員';
        const realName = localStorage.getItem(realNameKey) || displayName;
        sessionStorage.setItem(previewActiveKey, '1');
        sessionStorage.setItem(previewNameKey, displayName);
        sessionStorage.setItem(previewRealNameKey, realName);

        const url = new URL(window.location.href);
        url.searchParams.set('test', '1');
        url.searchParams.set('preview', '1');
        url.searchParams.delete('reset');
        window.location.replace(url);
        return;
      }

      if (!groups.includes(selected)) return;
      localStorage.setItem(groupKey, selected);
      window.location.reload();
    });
    document.body.appendChild(overlay);
  }

  const check = () => requestAnimationFrame(render);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', check, {once:true});
  else check();
  new MutationObserver(check).observe(document.documentElement, {childList:true,subtree:true});
  addEventListener('storage', check);
})();
