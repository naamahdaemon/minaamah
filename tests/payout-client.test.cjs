const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const model = require('../static/payout-model.js');
const html = fs.readFileSync('static/payout-simulator.html', 'utf8');
const key = 'B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr';
function harness(fail = false, pause = async () => {}) {
  const elements = new Map();
  function element(id) {
    if (!elements.has(id)) elements.set(id, { value: '', disabled: false, hidden: true, checked: true,
      style: {}, addEventListener() {} });
    return elements.get(id);
  }
  for (const [id, value] of Object.entries({ era: 'mesa', epoch: '0', publicKey1: key,
    publicKey2: key, publicKey3: key, fee1: '1', fee2: '5' })) element(id).value = value;
  const requests = [];
  const chartData = [];
  const rendered = [];
  const ledger = epoch => ({ epoch, delegators_count: 1, stake: 100e9,
    delegators: [{ public_key: key, balance: 100e9 }] });
  const context = vm.createContext({ console: { log() {}, error() {} }, URLSearchParams, AbortController, setTimeout, clearTimeout,
    PayoutModel: model, performanceChart: null, APYChart: null,
    document: { getElementById: element, querySelectorAll: selector => selector === '.chart-container' ? [] : [...elements.values()] },
    clearTable() {}, populateAccountTable() {},
    populateDelegatorTable: (...args) => rendered.push(args), populateDelegatorsTable() {},
    updateCharts: data => chartData.push(data), updateAPYCharts() {}, toggleDataLabels() {},
    fetch: async (url, options) => {
      const route = decodeURIComponent(url).split('/').pop();
      const body = options.body ? JSON.parse(options.body) : {};
      requests.push([route, body]);
      await pause(route);
      if (fail) return { ok: false, status: 503 };
      let payload;
      if (route === 'epoch') payload = { epoch: { global_slot_since_genesis: 967717, epoch_since_genesis: 136, total_currency: 1000e9 } };
      if (route === 'account') payload = { account: { info: { key, balance: 200e9 }, ledger: { delegate_key: key } } };
      if (route === 'ledger') payload = { ledger: { epoch: body.epoch, data: { balance: 100e9, delegate_key: key } } };
      if (route === 'delegators') payload = { ledger: ledger(body.epoch) };
      if (route === 'work') {
        const blocks = body.epoch === 135 ? [{ hash: 'mesa-zero', timestamp: model.MESA_START + 90000,
          global_slot_since_genesis: 958441, coinbase: 360e9, trans_fee: 0, snark_fee: 0 }] : [];
        payload = { work: { epoch: body.epoch, count: blocks.length, blocks } };
      }
      return { ok: true, json: async () => ({ payload }) };
    }
  });
  context.window = context;
  // Exercise the real payout implementation, including the era coinbase amount.
  vm.runInContext(html.slice(html.indexOf('  function computePayouts('), html.indexOf('  function stakeLikelyhood(')), context);
  vm.runInContext(fs.readFileSync('static/payout-client.js', 'utf8'), context);
  return { context, element, requests, chartData, rendered };
}
test('all inline HTML scripts parse', () => {
  for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
});

test('sharing preserves completed parameters, manual zero and falls back when clipboard is unavailable', async () => {
  const elements = new Map();
  const element = id => {
    if (!elements.has(id)) elements.set(id, { value: '', checked: false, hidden: true,
      addEventListener(type, callback) { this[type] = callback; }, focus() {}, select() {} });
    return elements.get(id);
  };
  const navigator = { clipboard: { writeText: async url => { navigator.copied = url; } },
    share: async data => { navigator.shared = data; } };
  const context = vm.createContext({ URL, navigator, document: { getElementById: element } });
  context.window = context;
  vm.runInContext(fs.readFileSync('static/payout-share.js', 'utf8'), context);
  for (const [id, value] of Object.entries({ era: 'mesa', epoch: '0', publicKey1: key,
    publicKey2: key, publicKey3: key, fee1: '1.5', fee2: '5', addBlocks1: '0' })) element(id).value = value;
  context.captureComparisonShare();
  element('fee1').value = '99'; // Unsubmitted edits must not change the shared comparison.
  element('showDataLabels').checked = true;
  await element('copyComparison').click();
  const params = new URL(navigator.copied).searchParams;
  assert.equal(params.get('fee1'), '1.5');
  assert.equal(params.get('addBlocks1'), '0');
  assert.equal(params.has('addBlocks2'), false);
  assert.equal(params.get('showDataLabels'), '1');
  assert.equal(params.get('showPublicKey3'), '0');
  assert.equal(params.get('validate'), '1');
  await element('nativeShare').click();
  assert.equal(navigator.shared.url, navigator.copied);
  navigator.share = async () => { throw Object.assign(new Error(), { name: 'AbortError' }); };
  element('shareStatus').textContent = '';
  await element('nativeShare').click();
  assert.equal(element('shareStatus').textContent, '');
  delete navigator.clipboard;
  await element('copyComparison').click();
  assert.equal(element('comparisonLink').hidden, false);
  assert.equal(element('comparisonLink').value, navigator.copied);
  delete navigator.share;
  context.captureComparisonShare();
  assert.equal(element('nativeShare').hidden, true);
  context.resetComparisonShare();
  assert.equal(element('comparisonShare').hidden, true);
});
test('bookmarks keep Berkeley numbering; no-parameter default selects completed Mesa epoch', async () => {
  const h = harness();
  await h.context.initializeSimulator(new URLSearchParams('epoch=54'));
  assert.equal(h.element('era').value, 'berkeley');
  assert.equal(h.element('epoch').value, '54');
  await h.context.initializeSimulator(new URLSearchParams());
  assert.equal(h.element('era').value, 'mesa');
  assert.equal(Number(h.element('epoch').value), 0);
});
test('comparison uses epoch balance, reconstructs Mesa rewards and does not persist auto overrides', async () => {
  const h = harness();
  await h.context.fetchData();
  assert.equal(h.chartData.length, 1, h.element('simulationStatus').textContent);
  assert.equal(h.rendered[0][2].rewards, 360e9);
  assert.equal(h.rendered[0][3].info.balance, 100e9);
  assert.equal(h.element('addBlocks1').value, '');
  assert.equal(h.chartData[0].epochs.length, 12);
  assert.equal(h.chartData[0].epochs.at(-1), 'Mesa 0');
  assert.equal(h.chartData[0].payouts1.at(-1), 356.4);
  assert.equal(h.chartData[0].apy1.at(-2), null); // Berkeley 55
  const workRequests = h.requests.filter(([route]) => route === 'work');
  assert.equal(workRequests.filter(([, body]) => body.epoch === 135).length, 1); // cache shared by both validators and history
  assert.ok(workRequests.some(([, body]) => body.epoch === 136));
  assert.equal(h.element('compare').disabled, false);
});
test('API failure is visible and controls recover', async () => {
  const h = harness(true);
  await h.context.fetchData();
  assert.match(h.element('simulationStatus').textContent, /HTTP 503/);
  assert.equal(h.element('publicKey1').disabled, false);
  assert.equal(h.chartData.length, 0);
  assert.equal(h.element('accountTableLoader').style.display, 'none');
  assert.equal(h.element('APYChartLoader').style.display, 'none');
  assert.equal(h.element('compare').ariaBusy, 'false');
  assert.equal(h.element('results').hidden, true);
  assert.equal(h.element('resultsEmpty').hidden, false);
});

test('spinners appear during pending requests and clear after completion', async () => {
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const h = harness(false, route => route === 'epoch' ? gate : Promise.resolve());
  const pending = h.context.fetchData();
  assert.equal(h.element('accountTableLoader').style.display, 'flex');
  assert.equal(h.element('performanceChartLoader').style.display, 'flex');
  assert.equal(h.element('APYChartLoader').style.display, 'flex');
  assert.equal(h.element('compare').textContent, 'Comparing…');
  assert.equal(h.element('compare').ariaBusy, 'true');
  assert.equal(h.element('results').hidden, false);
  release();
  await pending;
  assert.equal(h.element('accountTableLoader').style.display, 'none');
  assert.equal(h.element('performanceChartLoader').style.display, 'none');
  assert.equal(h.element('APYChartLoader').style.display, 'none');
  assert.equal(h.element('compare').textContent, 'Compare validators');
  assert.equal(h.element('results').ariaBusy, 'false');
});
