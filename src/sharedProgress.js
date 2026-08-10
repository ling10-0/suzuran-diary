const supabaseUrl = 'https://unyntuezvovodpklishf.supabase.co';
const publishableKey = 'sb_publishable_V-bPAyQBvzHTdRIPlDtbWQ_QYd3Jn1G';
const endpoint = supabaseUrl + '/rest/v1/newsroom_progress';
const allowedNewsrooms = new Set(['蘭臺', '見山', '迴聲']);

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

export async function loadNewsroomProgress(newsroom) {
  const group = assertNewsroom(newsroom);
  const query = new URLSearchParams({
    select: 'case_index',
    newsroom: 'eq.' + group,
    order: 'case_index.asc',
  });
  const response = await request(endpoint + '?' + query.toString(), {headers});
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`讀取共同進度失敗（${response.status}）${detail ? `：${detail}` : ''}`);
  }
  const rows = await response.json();
  return [...new Set(rows.map(row => Number(row.case_index)).filter(Number.isInteger))];
}

export async function saveNewsroomProgress(newsroom, caseIndex) {
  const group = assertNewsroom(newsroom);
  const progressId = Number(caseIndex);
  if (!Number.isInteger(progressId) || progressId < 1000 || progressId > 1099) {
    throw new Error('案件進度編號無效');
  }

  const query = new URLSearchParams({on_conflict: 'newsroom,case_index'});
  const response = await request(endpoint + '?' + query.toString(), {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify({newsroom: group, case_index: progressId}),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`儲存共同進度失敗（${response.status}）${detail ? `：${detail}` : ''}`);
  }
}
