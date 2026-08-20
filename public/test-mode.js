(() => {
  const TEST_QUERY = 'test';
  const TEST_VALUE = '1';
  const OFFLINE_QUERY = 'offline';
  const SESSION_KEY = 'suzuran-test-mode-active';
  const OFFLINE_SESSION_KEY = 'suzuran-offline-mode-active';
  const TEST_PREFIX = '__suzuran_test__:';
  const SUPABASE_HOST = 'unyntuezvovodpklishf.supabase.co';
  const SUPABASE_PATHS = [
    '/rest/v1/newsroom_progress',
    '/rest/v1/newsroom_test_progress',
  ];

  const storageProto = Storage.prototype;
  const originalStorage = {
    getItem: storageProto.getItem,
    setItem: storageProto.setItem,
    removeItem: storageProto.removeItem,
  };

  const currentUrl = new URL(window.location.href);
  const offlineRequested = currentUrl.searchParams.get(OFFLINE_QUERY) === TEST_VALUE;
  const requested = currentUrl.searchParams.get(TEST_QUERY) === TEST_VALUE;

  if (offlineRequested) {
    window.sessionStorage.setItem(OFFLINE_SESSION_KEY, '1');
  }
  const offlineMode =
    offlineRequested || window.sessionStorage.getItem(OFFLINE_SESSION_KEY) === '1';

  if (requested || offlineMode) {
    window.sessionStorage.setItem(SESSION_KEY, '1');
  }

  const enabled =
    requested || offlineMode || window.sessionStorage.getItem(SESSION_KEY) === '1';
  if (!enabled) return;

  window.__SUZURAN_TEST_MODE__ = true;
  window.__SUZURAN_OFFLINE_MODE__ = offlineMode;
  document.documentElement.dataset.suzuranTestMode = '1';
  if (offlineMode) document.documentElement.dataset.suzuranOfflineMode = '1';

  let urlChanged = false;
  if (!requested) {
    currentUrl.searchParams.set(TEST_QUERY, TEST_VALUE);
    urlChanged = true;
  }
  if (offlineMode && !offlineRequested) {
    currentUrl.searchParams.set(OFFLINE_QUERY, TEST_VALUE);
    urlChanged = true;
  }
  if (urlChanged) {
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

    const isSupabaseRequest = parsed.hostname === SUPABASE_HOST;
    const isProgressRequest =
      isSupabaseRequest &&
      SUPABASE_PATHS.some(path => parsed.pathname.endsWith(path));

    // Offline archive mode never contacts Supabase. Unknown future endpoints are
    // blocked as well so the archived package cannot accidentally affect live data.
    if (offlineMode && isSupabaseRequest && !isProgressRequest) {
      return new Response(JSON.stringify({offline: true}), {
        status: 503,
        headers: {'Content-Type': 'application/json'},
      });
    }

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

    if (method === 'DELETE') {
      const newsroom = (parsed.searchParams.get('newsroom') || '').replace(/^eq\./, '');
      if (newsroom) rawRemove(sharedKey(newsroom));
      return new Response('', {status: 204});
    }

    return new Response('', {status: 204});
  };

  const clearTestData = () => {
    Object.keys(window.localStorage)
      .filter(key => key.startsWith(TEST_PREFIX))
      .forEach(rawRemove);
  };

  // In test/offline mode, ?reset=1 must never trigger production reset logic
  // inside group-selection.js. Handle it here and remove the flag first.
  if (currentUrl.searchParams.get('reset') === '1') {
    clearTestData();
    currentUrl.searchParams.delete('reset');
    currentUrl.searchParams.set(TEST_QUERY, TEST_VALUE);
    if (offlineMode) currentUrl.searchParams.set(OFFLINE_QUERY, TEST_VALUE);
    window.history.replaceState(null, '', currentUrl);
  }

  const mountControls = () => {
    if (document.getElementById('suzuran-test-controls')) return;

    const controls = document.createElement('aside');
    controls.id = 'suzuran-test-controls';
    controls.setAttribute('aria-label', offlineMode ? '單機展示模式工具' : '測試模式工具');
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
      <strong>${offlineMode ? '📦 單機展示模式・資料僅存本機' : '🧪 測試模式・不寫入 Supabase'}</strong>
      <button type="button" data-action="reset">${offlineMode ? '重置體驗' : '重置測試'}</button>
      ${offlineMode ? '' : '<button type="button" data-action="exit">退出</button>'}
    `;

    controls.querySelector('[data-action="reset"]').addEventListener('click', () => {
      const message = offlineMode
        ? '要清除這台電腦上的單機體驗進度並從頭開始嗎？正式玩家資料與 Supabase 不會受影響。'
        : '要清除所有測試進度並從頭開始嗎？正式玩家資料與 Supabase 不會受影響。';
      if (!window.confirm(message)) return;
      clearTestData();
      const clean = new URL(window.location.href);
      clean.search = '';
      clean.searchParams.set(TEST_QUERY, TEST_VALUE);
      if (offlineMode) clean.searchParams.set(OFFLINE_QUERY, TEST_VALUE);
      clean.hash = '';
      window.location.replace(clean);
    });

    const exitButton = controls.querySelector('[data-action="exit"]');
    exitButton?.addEventListener('click', () => {
      window.sessionStorage.removeItem(SESSION_KEY);
      window.sessionStorage.removeItem(OFFLINE_SESSION_KEY);
      const clean = new URL(window.location.href);
      clean.searchParams.delete(TEST_QUERY);
      clean.searchParams.delete(OFFLINE_QUERY);
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
