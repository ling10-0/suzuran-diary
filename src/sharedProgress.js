const supabaseUrl = 'https://unyntuezvovodpklishf.supabase.co';
const publishableKey = 'sb_publishable_V-bPAyQBvzHTdRIPlDtbWQ_QYd3Jn1G';
const endpoint = supabaseUrl + '/rest/v1/newsroom_progress';

// Supabase 的新版 sb_publishable 金鑰不是 JWT。
// 它只能放在 apikey 標頭；若同時作為 Bearer token 傳送，REST API 會回傳 Invalid JWT。
const headers = {
  apikey: publishableKey,
  Accept: 'application/json',
};

export async function loadNewsroomProgress(newsroom) {
  const query = new URLSearchParams({select: 'case_index', newsroom: 'eq.' + newsroom});
  const response = await fetch(endpoint + '?' + query.toString(), {headers});
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`讀取共同進度失敗（${response.status}）${detail ? `：${detail}` : ''}`);
  }
  const rows = await response.json();
  return rows.map(row => row.case_index);
}

export async function saveNewsroomProgress(newsroom, caseIndex) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify({newsroom, case_index: caseIndex}),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`儲存共同進度失敗（${response.status}）${detail ? `：${detail}` : ''}`);
  }
}
