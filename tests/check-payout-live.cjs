// Optional, read-only live smoke check. Uses the same public endpoints as the page.
// Run manually: node tests/check-payout-live.cjs [mesa|berkeley] [epoch]
const fs = require('node:fs');
const vm = require('node:vm');
const model = require('../static/payout-model.js');
const key = 'B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr';
const elements = new Map();
const get = id => {
  if (!elements.has(id)) elements.set(id, { value: '', disabled: false, checked: true,
    style: {}, addEventListener() {} });
  return elements.get(id);
};
for (const [id, value] of Object.entries({ era: process.argv[2] || 'mesa', epoch: process.argv[3] || '0',
  publicKey1: key, publicKey2: key, publicKey3: key, fee1: '1', fee2: '5' })) get(id).value = value;
const context = vm.createContext({ URLSearchParams, AbortController, setTimeout, clearTimeout, fetch,
  console: { log() {}, error: error => console.error(error.message) }, PayoutModel: model,
  document: { getElementById: get, querySelectorAll: () => [...elements.values()] },
  performanceChart: null, APYChart: null, clearTable() {}, populateAccountTable() {},
  populateDelegatorTable: (id, ledger, work) => console.log(JSON.stringify({ id,
    blocks: work.count, rewards: work.rewards / 1e9, stake: ledger.stake / 1e9 })),
  populateDelegatorsTable() {}, updateAPYCharts() {}, toggleDataLabels() {},
  updateCharts: chart => console.log(JSON.stringify({ epochs: chart.epochs, blocks: chart.blockCounts1, apy: chart.apy1 }))
});
context.window = context;
const html = fs.readFileSync('static/payout-simulator.html', 'utf8');
vm.runInContext(html.slice(html.indexOf('  function computePayouts('), html.indexOf('  function stakeLikelyhood(')), context);
vm.runInContext(fs.readFileSync('static/payout-client.js', 'utf8'), context);
context.fetchData().then(() => {
  console.log(get('simulationStatus').textContent);
  if (get('simulationStatus').className === 'warning-box') process.exitCode = 1;
});
