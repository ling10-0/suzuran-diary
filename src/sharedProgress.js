const supabaseUrl = 'https://unyntuezvovodpklishf.supabase.co';
const publishableKey = 'sb_publishable_V-bPAyQBvzHTdRIPlDtbWQ_QYd3Jn1G';
const endpoint = supabaseUrl + '/rest/v1/newsroom_progress';

const headers = {
  apikey: publishableKey,
  Authorization: 'Bearer ' + publishableKey,
};

export async function loadNewsroomProgress(newsroom) {
  const query = new URLSearchParams({select: 'case_index', newsroom: 'eq.' + newsroom});
  const response = await fetch(endpoint + '?' + query.toString(), {headers});
  if (!response.ok) throw new Error('讀取共同進度失敗');
  const rows = await response.json();
  return rows.map(row => row.case_index);
}

export async function saveNewsroomProgress(newsroom, caseIndex) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {...headers, 'Content-Type': 'application/json', Prefer: 'resolution=ignore-duplicates,return=minimal'},
    body: JSON.stringify({newsroom, case_index: caseIndex}),
  });
  if (!response.ok) throw new Error('儲存共同進度失敗');
}
