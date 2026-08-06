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
  const groupKey = 'suzuran-newsroom';
  const nameKey = 'suzuran-investigator-name';
  const versionKey = 'suzuran-name-system-version';
  const overlayId = 'suzuran-group-selection';

  const registered = () =>
    localStorage.getItem(versionKey) === '2' &&
    Boolean(localStorage.getItem(nameKey));

  const validGroup = () => groups.includes(localStorage.getItem(groupKey));

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
        #${overlayId} .option{min-height:108px;padding:18px 10px;border:1px solid #55442f;color:#2d2117;background:rgba(255,255,255,.16);font:700 clamp(22px,5vw,30px) 'Noto Serif TC',serif;letter-spacing:.12em;cursor:pointer}
        #${overlayId} .option.selected{color:#f2e4c2;background:#8f251d;outline:3px double #8f251d;outline-offset:3px}
        #${overlayId} .confirm{width:100%;min-height:50px;margin-top:22px;border:1px solid #2d2117;color:#f2e4c2;background:#2d2117;font:14px 'Noto Serif TC',serif;letter-spacing:.08em;cursor:pointer}
        #${overlayId} .confirm:disabled{cursor:not-allowed;opacity:.42}
        #${overlayId} .note{display:block;margin-top:15px;color:#756650;font-size:11px;line-height:1.7;text-align:center}
        @media(max-width:560px){#${overlayId}{padding:14px}#${overlayId} .card{padding:28px 20px}#${overlayId} .options{grid-template-columns:1fr}#${overlayId} .option{min-height:68px}}
      </style>
      <section class="card" role="dialog" aria-modal="true" aria-labelledby="group-title">
        <p class="eyebrow">TEAM REGISTRATION / 調查小隊登記</p>
        <h1 id="group-title">請選擇所屬組別</h1>
        <p class="desc">姓名登記已完成。請選擇你的調查小隊，後續案件進度將以同一組別共用。</p>
        <div class="options" role="radiogroup" aria-label="組別">
          ${groups.map(group => `<button class="option" type="button" role="radio" aria-checked="false" data-group="${group}">${group}</button>`).join('')}
        </div>
        <button class="confirm" type="button" disabled>確認組別並進入市役所</button>
        <small class="note">請與同組成員選擇完全相同的組別。</small>
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
    }));
    confirm.addEventListener('click', () => {
      if (!groups.includes(selected)) return;
      localStorage.setItem(groupKey, selected);
      removeOverlay();
    });
    document.body.appendChild(overlay);
  }

  const check = () => requestAnimationFrame(render);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', check, {once:true});
  else check();
  new MutationObserver(check).observe(document.documentElement, {childList:true,subtree:true});
  addEventListener('storage', check);
})();
