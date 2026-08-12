const supabaseUrl = 'https://unyntuezvovodpklishf.supabase.co';
const publishableKey = 'sb_publishable_V-bPAyQBvzHTdRIPlDtbWQ_QYd3Jn1G';
const liveEndpoint = supabaseUrl + '/rest/v1/newsroom_progress';
const testEndpoint = supabaseUrl + '/rest/v1/newsroom_test_progress';
const allowedNewsrooms = new Set(['蘭臺', '見山', '迴聲']);

export const MAIN_PROGRESS_START = 1050;
export const SIDE_PROGRESS_START = 1070;
export const PHOTO_PROGRESS_START = 1031;
export const PHOTO_PROGRESS_END = 1040;
export const FORMAL_PROGRESS_VERSION = '2026-08-14-launch';

const headers = {
  apikey: publishableKey,
  Accept: 'application/json',
};

function assertNewsroom(newsroom) {
  const normalized = String(newsroom || '').trim();
  if (!allowedNewsrooms.has(normalized)) {
    throw new Error('組別名稱無效，請重新選擇蘭臺、見山或迴聲。');
  }
  return normalized;
}

function normalizeTestSession(value) {
  const normalized = String(value || '').trim().toUpperCase();
  if (!/^[A-Z0-9]{6,12}$/.test(normalized)) {
    throw new Error('測試場次碼需為 6–12 位英文字母或數字。');
  }
  return normalized;
}

function currentContext(context = {}) {
  const testMode = context.testMode ?? window.localStorage.getItem('suzuran-progress-mode') === 'test';
  const testSession = context.testSession ?? window.localStorage.getItem('suzuran-test-session') ?? '';
  return testMode
    ? {testMode: true, testSession: normalizeTestSession(testSession), endpoint: testEndpoint}
    : {testMode: false, testSession: '', endpoint: liveEndpoint};
}

function assertProgressId(caseIndex) {
  const progressId = Number(caseIndex);
  if (!Number.isInteger(progressId) || progressId < 1000 || progressId > 1099) {
    throw new Error('案件進度編號無效');
  }
  return progressId;
}

async function request(url, options = {}) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 8000);
  try {
    return await fetch(url, {...options, signal: controller.signal});
  } catch (error) {
    if (error?.name === 'AbortError') throw new Error('共同進度連線逾時');
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
}

async function responseError(response, action) {
  const detail = await response.text().catch(() => '');
  throw new Error(`${action}共同進度失敗（${response.status}）${detail ? `：${detail}` : ''}`);
}

export async function loadNewsroomProgress(newsroom, context) {
  const group = assertNewsroom(newsroom);
  const scope = currentContext(context);
  const query = new URLSearchParams({
    select: 'case_index',
    newsroom: 'eq.' + group,
    order: 'case_index.asc',
  });
  if (scope.testMode) query.set('test_session', 'eq.' + scope.testSession);
  else query.set('launch_version', 'eq.' + FORMAL_PROGRESS_VERSION);

  const response = await request(scope.endpoint + '?' + query.toString(), {headers});
  if (!response.ok) await responseError(response, '讀取');
  const rows = await response.json();
  return [...new Set(rows.map(row => Number(row.case_index)).filter(Number.isInteger))];
}

export async function saveNewsroomProgress(newsroom, caseIndex, context) {
  const group = assertNewsroom(newsroom);
  const progressId = assertProgressId(caseIndex);
  const scope = currentContext(context);
  const conflictColumns = scope.testMode ? 'test_session,newsroom,case_index' : 'newsroom,case_index';
  const query = new URLSearchParams({on_conflict: conflictColumns});
  const body = {newsroom: group, case_index: progressId};
  if (scope.testMode) body.test_session = scope.testSession;
  else body.launch_version = FORMAL_PROGRESS_VERSION;

  const response = await request(scope.endpoint + '?' + query.toString(), {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) await responseError(response, '儲存');
}

export async function clearTestNewsroomProgress(newsroom, context) {
  const group = assertNewsroom(newsroom);
  const scope = currentContext(context);
  if (!scope.testMode) throw new Error('正式場次不可由遊戲頁面清空。');

  const query = new URLSearchParams({
    newsroom: 'eq.' + group,
    test_session: 'eq.' + scope.testSession,
  });
  const response = await request(scope.endpoint + '?' + query.toString(), {
    method: 'DELETE',
    headers: {...headers, Prefer: 'return=minimal'},
  });
  if (!response.ok) await responseError(response, '清空');
}
