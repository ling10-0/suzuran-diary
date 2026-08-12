import assert from 'node:assert/strict';
import test from 'node:test';

const storage = new Map();
globalThis.window = {
  localStorage: {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: key => storage.delete(key),
  },
  setTimeout,
  clearTimeout,
};

const requests = [];
globalThis.fetch = async (url, options = {}) => {
  requests.push({url: String(url), options});
  return new Response(options.method === 'DELETE' ? null : '[]', {
    status: options.method === 'POST' ? 201 : 200,
    headers: {'Content-Type': 'application/json'},
  });
};

const progress = await import('../src/sharedProgress.js');

test.beforeEach(() => {
  requests.length = 0;
  storage.clear();
});

test('正式場次使用 1050 起始 ID 與正式資料表', async () => {
  assert.equal(progress.MAIN_PROGRESS_START, 1050);
  await progress.saveNewsroomProgress('蘭臺', progress.MAIN_PROGRESS_START, {testMode:false});
  assert.match(requests[0].url, /newsroom_progress\?on_conflict=newsroom%2Ccase_index/);
  assert.deepEqual(JSON.parse(requests[0].options.body), {newsroom:'蘭臺',case_index:1050});
});

test('測試場次會隔離資料並可清空', async () => {
  const context={testMode:true,testSession:'TRY123'};
  await progress.saveNewsroomProgress('見山',1051,context);
  assert.match(requests[0].url, /newsroom_test_progress/);
  assert.deepEqual(JSON.parse(requests[0].options.body), {newsroom:'見山',case_index:1051,test_session:'TRY123'});

  await progress.clearTestNewsroomProgress('見山',context);
  assert.equal(requests[1].options.method,'DELETE');
  assert.match(requests[1].url,/test_session=eq\.TRY123/);
  assert.match(requests[1].url,/newsroom=eq\.%E8%A6%8B%E5%B1%B1/);
});

test('拒絕舊版 0–10 進度 ID 與清空正式資料', async () => {
  await assert.rejects(progress.saveNewsroomProgress('迴聲',0,{testMode:false}),/案件進度編號無效/);
  await assert.rejects(progress.clearTestNewsroomProgress('迴聲',{testMode:false}),/正式場次不可/);
  assert.equal(requests.length,0);
});
