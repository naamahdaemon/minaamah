/* Shared by the static simulator and its regression tests. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PayoutModel = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  // Mainnet runtime: https://minataur.net/api/v1/runtime
  // Mina mainnet profile: MinaProtocol/mina, src/lib/node_config/profiled/mainnet.ml
  const MESA_START = Date.parse('2026-09-03T18:00:00Z');
  const MESA_GLOBAL_SLOT = 958440;
  const BERKELEY_GLOBAL_SLOT = 564480;
  const SLOTS = 7140;
  const ERAS = {
    berkeley: { name: 'Berkeley', offset: 80, max: 55, coinbase: 720, slotSeconds: 180 },
    mesa: { name: 'Mesa', offset: 135, max: Infinity, coinbase: 360, slotSeconds: 90 }
  };
  function selection(era, epoch) {
    const config = ERAS[era];
    const n = Number(epoch);
    if (!config || String(epoch).trim() === '' || !Number.isInteger(n) || n < 0 || n > config.max)
      throw new Error('Choose a valid epoch for the selected era.');
    return { era, epoch: n, apiEpoch: config.offset + n, label: `${config.name} ${n}`,
      coinbase: config.coinbase, days: SLOTS * config.slotSeconds / 86400,
      transition: era === 'berkeley' && n === 55 };
  }
  function current(network) {
    const slot = Number(network.global_slot_since_genesis);
    if (!Number.isSafeInteger(slot) || slot < BERKELEY_GLOBAL_SLOT)
      throw new Error('Invalid current epoch from Minataur.');
    return slot >= MESA_GLOBAL_SLOT
      ? selection('mesa', Math.floor((slot - MESA_GLOBAL_SLOT) / SLOTS))
      : selection('berkeley', Math.floor((slot - BERKELEY_GLOBAL_SLOT) / SLOTS));
  }
  function history(selected, count = 12) {
    const list = [];
    let s = selected;
    while (list.length < count) {
      list.unshift(s);
      if (s.epoch > 0) s = selection(s.era, s.epoch - 1);
      else if (s.era === 'mesa') s = selection('berkeley', 55);
      else break;
    }
    return list;
  }
  function workEpochs(selected, network) {
    // Minataur still buckets work using the Berkeley slot origin. A real Mesa
    // epoch straddles TWO API buckets (the fork occurred 1260 slots into one).
    const buckets = selected.era === 'mesa'
      ? [selected.apiEpoch, selected.apiEpoch + 1] : [selected.apiEpoch];
    return buckets.filter(n => n <= Number(network.epoch_since_genesis));
  }
  function normalizeWork(selected, responses, publicKey) {
    const seen = new Set();
    const blocks = [];
    for (const work of responses) {
      if (!Array.isArray(work.blocks) || Number(work.count) !== work.blocks.length)
        throw new Error('Incomplete block list returned by Minataur.');
      for (const block of work.blocks) {
        const time = Number(block.timestamp);
        const globalSlot = Number(block.global_slot_since_genesis);
        if (!Number.isFinite(time) || !Number.isSafeInteger(globalSlot) || !block.hash)
          throw new Error('Missing block identity or epoch information.');
        const matches = selected.era === 'mesa'
          ? time >= MESA_START && Math.floor((globalSlot - MESA_GLOBAL_SLOT) / SLOTS) === selected.epoch
          : time < MESA_START && Math.floor((globalSlot - BERKELEY_GLOBAL_SLOT) / SLOTS) === selected.epoch;
        if (matches && !seen.has(block.hash)) { seen.add(block.hash); blocks.push(block); }
      }
    }
    const sum = field => blocks.reduce((total, block) => {
      const value = Number(block[field]);
      if (!Number.isFinite(value) || value < 0) throw new Error('Invalid block rewards.');
      return total + value;
    }, 0);
    return { publicKey, epoch: selected.apiEpoch, era: selected.era, count: blocks.length,
      rewards: sum('coinbase'), transactions_fee: sum('trans_fee'), snarks_fee: sum('snark_fee'),
      coinbaseAmount: selected.coinbase, blocks };
  }
  function apy(rewards, principal, selected, isCurrent) {
    if (isCurrent || selected.transition || principal <= 0) return null;
    return (Math.pow(1 + rewards / principal, 365 / selected.days) - 1) * 100;
  }
  function additionalBlocks(ledger, balance, totalCurrency, selected, network, manual = '') {
    const amount = Number(balance);
    if (manual !== '') {
      const value = Number(manual);
      if (!Number.isInteger(value) || value < 0) throw new Error('Additional blocks must be a non-negative integer.');
      return value;
    }
    if (selected.transition) return 0; // no full-epoch estimate for a truncated era
    const total = Number(totalCurrency);
    if (!(total > 0) || !(amount >= 0)) throw new Error('Missing staking currency or balance.');
    const now = current(network);
    const elapsedSlots = selected.era === now.era && selected.epoch === now.epoch
      ? (Number(network.global_slot_since_genesis) - (selected.era === 'mesa' ? MESA_GLOBAL_SLOT : BERKELEY_GLOBAL_SLOT)) % SLOTS + 1
      : SLOTS;
    return Math.round((1 - Math.pow(0.25, amount / total)) * elapsedSlots);
  }
  return { ERAS, SLOTS, MESA_START, selection, current, history, workEpochs, normalizeWork, apy, additionalBlocks };
});
