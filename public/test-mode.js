(() => {
  const TEST_QUERY = 'test';
  const TEST_VALUE = '1';
  const SESSION_KEY = 'suzuran-test-mode-active';
  const TEST_PREFIX = '__suzuran_test__:';
  const SUPABASE_HOST = 'unyntuezvovodpklishf.supabase.co';
  const SUPABASE_PATH = '/rest/v1/newsroom_progress';

  const storageProto = Storage.prototype;
  const originalStorage = {
    getItem: storageProto.getItem,
    setItem: storageProto.setItem,
    removeItem: storageProto.removeItem,
  };

  const currentUrl = new URL(window.location.href);
  const requested = currentUrl.searchParams.get(TEST_QUERY) === TEST_VALUE;

  if (requested) {
    window.sessionStorage.setItem(SESSION_KEY, '1');
  }

  const enabled = requested || window.sessionStorage.getItem(SESSION_KEY) === '1';
  if (!enabled) return;

  window.__SUZURAN_TEST_MODE__ = true;
  document.documentElement.dataset.suzuranTestMode = '1';

  if (!requested) {
    currentUrl.searchParams.set(TEST_QUERY, TEST_VALUE);
    window.history.replaceState(null, '', currentUrl);
  }

  const testKey = key => TEST_PREFIX + String(key);
  const shouldIsolate = (storage, key) =>
    storage === window.localStorage && String(key).startsWith('suzuran-');

  storageProto.getItem = function getItem(key) {
    return originalStorage.getItem.call(
      this,
      shouldIsolate(this, key) ? testKey(key) : key,
    );
  };

  storageProto.setItem = function setItem(key, value) {
    return originalStorage.setItem.call(
      this,
      shouldIsolate(this, key) ? testKey(key) : key,
      value,
    );
  };

  storageProto.removeItem = function removeItem(key) {
    return originalStorage.removeItem.call(
      this,
      shouldIsolate(this, key) ? testKey(key) : key,
    );
  };

  const rawGet = key => originalStorage.getItem.call(window.localStorage, key);
  const rawSet = (key, value) => originalStorage.setItem.call(window.localStorage, key, value);
  const rawRemove = key => originalStorage.removeItem.call(window.localStorage, key);

  const sharedKey = newsroom => `${TEST_PREFIX}shared:${newsroom}`;

  const readSharedProgress = newsroom => {
    try {
      const value = JSON.parse(rawGet(sharedKey(newsroom)) || '[]');
      return Array.isArray(value)
        ? value.map(Number).filter(Number.isInteger)
        : [];
    } catch {
      return [];
    }
  };

  const writeSharedProgress = (newsroom, progress) => {
    rawSet(
      sharedKey(newsroom),
      JSON.stringify([...new Set(progress.map(Number).filter(Number.isInteger))]),
    );
  };

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const sourceUrl =
      typeof input === 'string' || input instanceof URL
        ? String(input)
        : input?.url;

    let parsed;
    try {
      parsed = new URL(sourceUrl, window.location.href);
    } catch {
      return originalFetch(input, init);
    }

    const isProgressRequest =
      parsed.hostname === SUPABASE_HOST &&
      parsed.pathname.endsWith(SUPABASE_PATH);

    if (!isProgressRequest) {
      return originalFetch(input, init);
    }

    const method = String(init.method || input?.method || 'GET').toUpperCase();

    if (method === 'GET') {
      const newsroom = (parsed.searchParams.get('newsroom') || '').replace(/^eq\./, '');
      const rows = readSharedProgress(newsroom).map(caseIndex => ({
        case_index: caseIndex,
      }));

      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    }

    if (method === 'POST') {
      let body = {};
      try {
        body = JSON.parse(init.body || '{}');
      } catch {
        body = {};
      }

      const newsroom = String(body.newsroom || '').trim();
      const caseIndex = Number(body.case_index);

      if (newsroom && Number.isInteger(caseIndex)) {
        writeSharedProgress(newsroom, [
          ...readSharedProgress(newsroom),
          caseIndex,
        ]);
      }

      return new Response('', {status: 201});
    }

    return new Response('', {status: 204});
  };

  const clearTestData = () => {
    Object.keys(window.localStorage)
      .filter(key => key.startsWith(TEST_PREFIX))
      .forEach(rawRemove);
  };

  // In test mode, ?reset=1 must never trigger the production reset logic
  // inside group-selection.js. Handle it here and remove the flag first.
  if (currentUrl.searchParams.get('reset') === '1') {
    clearTestData();
    currentUrl.searchParams.delete('reset');
    currentUrl.searchParams.set(TEST_QUERY, TEST_VALUE);
    window.history.replaceState(null, '', currentUrl);
  }

  const mountControls = () => {
    if (document.getElementById('suzuran-test-controls')) return;

    const controls = document.createElement('aside');
    controls.id = 'suzuran-test-controls';
    controls.setAttribute('aria-label', '測試模式工具');
    controls.innerHTML = `
      <style>
        #suzuran-test-controls {
          position: fixed;
          right: 14px;
          bottom: 14px;
          z-index: 100001;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border: 1px solid #6d251d;
          background: #f4e4b8;
          box-shadow: 0 6px 24px rgba(35, 25, 15, .22);
          color: #3b2a1e;
          font: 700 12px/1.2 system-ui, sans-serif;
        }
        #suzuran-test-controls strong { white-space: nowrap; }
        #suzuran-test-controls button {
          min-height: 32px;
          padding: 6px 10px;
          border: 1px solid #3b2a1e;
          background: #fff8e7;
          color: #3b2a1e;
          font: 700 12px/1 system-ui, sans-serif;
          cursor: pointer;
        }
        #suzuran-test-controls button[data-action="reset"] {
          background: #8f251d;
          color: #fff8e7;
          border-color: #8f251d;
        }
        @media (max-width: 560px) {
          #suzuran-test-controls {
            right: 8px;
            bottom: 8px;
            left: 8px;
            justify-content: center;
            flex-wrap: wrap;
          }
        }
      </style>
      <strong>🧪 測試模式・不寫入 Supabase</strong>
      <button type="button" data-action="reset">重置測試</button>
      <button type="button" data-action="exit">退出</button>
    `;

    controls.querySelector('[data-action="reset"]').addEventListener('click', () => {
      if (!window.confirm('要清除所有測試進度並從頭開始嗎？正式玩家資料與 Supabase 不會受影響。')) return;
      clearTestData();
      const clean = new URL(window.location.href);
      clean.search = '';
      clean.searchParams.set(TEST_QUERY, TEST_VALUE);
      clean.hash = '';
      window.location.replace(clean);
    });

    controls.querySelector('[data-action="exit"]').addEventListener('click', () => {
      window.sessionStorage.removeItem(SESSION_KEY);
      const clean = new URL(window.location.href);
      clean.searchParams.delete(TEST_QUERY);
      clean.searchParams.delete('reset');
      window.location.replace(clean);
    });

    document.body.appendChild(controls);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountControls, {once: true});
  } else {
    mountControls();
  }
})();
