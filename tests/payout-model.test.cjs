const test = require('node:test');
const assert = require('node:assert/strict');
const model = require('../static/payout-model.js');
const current = { global_slot_since_genesis: '967717', epoch_since_genesis: 136 };
function block(slot, reward, hash = String(slot), time = model.MESA_START + 90000) {
  return { hash, global_slot_since_genesis: String(slot), timestamp: String(time), coinbase: reward * 1e9, trans_fee: 1e9, snark_fee: 0 };
}
test('Mesa current epoch is derived from slots, not Minataur legacy epoch 56', () => {
  assert.equal(model.current(current).label, 'Mesa 1');
  assert.equal(model.selection('mesa', 0).apiEpoch, 135);
  assert.equal(model.selection('berkeley', 55).apiEpoch, 135);
  for (const epoch of ['', -1, 0.5, 'abc']) assert.throws(() => model.selection('mesa', epoch));
  assert.throws(() => model.selection('berkeley', 56));
});
test('history contains exactly 12 labeled epochs across the fork', () => {
  const history = model.history(model.selection('mesa', 1));
  assert.equal(history.length, 12);
  assert.deepEqual(history.slice(-3).map(e => e.label), ['Berkeley 55', 'Mesa 0', 'Mesa 1']);
  assert.equal(model.history(model.selection('berkeley', 0)).length, 1);
});
test('Mesa 0 collects both API buckets, excludes Berkeley and Mesa 1, deduplicates blocks', () => {
  const s = model.selection('mesa', 0);
  assert.deepEqual(model.workEpochs(s, current), [135, 136]);
  const a = block(958440, 360);
  const b = block(958440 + 7139, 360);
  const old = block(958439, 720, 'old', model.MESA_START - 90000);
  const next = block(958440 + 7140, 360);
  const work = model.normalizeWork(s, [{ count: 2, blocks: [old, a] }, { count: 3, blocks: [a, b, next] }], 'validator');
  assert.equal(work.count, 2);
  assert.equal(work.rewards, 720e9);
  assert.equal(work.transactions_fee, 2e9);
  assert.equal(work.coinbaseAmount, 360);
  assert.equal(model.normalizeWork(model.selection('berkeley', 55), [{ count: 2, blocks: [old, a] }], 'validator').count, 1);
});
test('missing or truncated block responses fail instead of showing zero rewards', () => {
  assert.throws(() => model.normalizeWork(model.selection('mesa', 0), [{ count: 1, blocks: [] }], 'validator'));
  assert.throws(() => model.normalizeWork(model.selection('mesa', 0), [{ count: 1, blocks: [{}] }], 'validator'));
});
test('APY uses era duration and excludes current and truncated epochs', () => {
  const mesa = model.selection('mesa', 0);
  assert.equal(mesa.days, 7.4375);
  assert.equal(model.selection('berkeley', 54).days, 14.875);
  assert.equal(model.apy(10, 1000, mesa, false), (1.01 ** (365 / 7.4375) - 1) * 100);
  assert.equal(model.apy(10, 1000, mesa, true), null);
  assert.equal(model.apy(10, 1000, model.selection('berkeley', 55), false), null);
  assert.equal(model.apy(10, 0, mesa, false), null);
});
test('additional blocks use elapsed slots for current epoch and preserve manual zero', () => {
  const s = model.selection('mesa', 1);
  assert.equal(model.additionalBlocks({}, 1000, 1000, s, current), Math.round(0.75 * 2138));
  assert.equal(model.additionalBlocks({}, 1000, 1000, model.selection('mesa', 0), current), 5355);
  assert.equal(model.additionalBlocks({}, 1000, 1000, s, current, '0'), 0);
  assert.throws(() => model.additionalBlocks({}, 1000, 1000, s, current, '-1'));
});
