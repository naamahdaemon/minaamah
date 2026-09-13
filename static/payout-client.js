/* Page orchestration; chart/table rendering remains in payout-simulator.html. */
(function () {
  'use strict';
  const model = PayoutModel;
  const byId = id => document.getElementById(id);
  let network;
  let running = false;
  let cache = new Map();
  const tableLoaders = ['accountTableLoader', 'delegator1TableLoader', 'delegator2TableLoader', 'delegatorsTableLoader', 'delegatorsTable2Loader'];
  const chartLoaders = ['performanceChartLoader', 'APYChartLoader'];
  function loading(ids, active) {
    ids.forEach(id => { byId(id).style.display = active ? 'flex' : 'none'; });
  }
  const proxy = 'https://www.akirion.com:4664/proxy?url=';
  // Existing public proxy credential; this is not a browser-side secret.
  const headers = { 'Content-Type': 'application/json', 'x-api-key': 'e0d9da01-c1c5-4c44-b4fa-3cbdb4982ed3' };
  function message(text, error = false) {
    const box = byId('simulationStatus');
    box.textContent = text;
    box.className = error ? 'warning-box' : 'info-box';
    box.hidden = !text;
  }
  async function request(route, payload) {
    const key = JSON.stringify([route, payload]);
    if (!cache.has(key)) cache.set(key, (async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      try {
        const response = await fetch(proxy + encodeURIComponent('https://minataur.net/api/v1/' + route), {
          method: payload ? 'POST' : 'GET', headers, signal: controller.signal,
          ...(payload ? { body: JSON.stringify(payload) } : {})
        });
        if (!response.ok) throw new Error(`Minataur ${route}: HTTP ${response.status}`);
        const data = await response.json();
        if (!data.payload) throw new Error(`Minataur ${route}: data unavailable.`);
        return data.payload;
      } finally { clearTimeout(timeout); }
    })());
    return cache.get(key);
  }
  function selected() { return model.selection(byId('era').value, byId('epoch').value); }
  function resetEstimates() {
    ['addBlocks1', 'addBlocks2'].forEach(id => { byId(id).value = ''; byId(id).placeholder = 'Automatic'; });
  }
  window.initializeSimulator = async function (params) {
    // Old bookmarked ?epoch=N links retain their Berkeley meaning.
    byId('era').value = params.get('era') || (params.has('epoch') ? 'berkeley' : 'mesa');
    if (!model.ERAS[byId('era').value]) byId('era').value = 'mesa';
    byId('epoch').max = byId('era').value === 'berkeley' ? '55' : '';
    if (params.has('epoch')) byId('epoch').value = params.get('epoch');
    try {
      network = (await request('epoch')).epoch;
      const now = model.current(network);
      if (!params.has('epoch')) {
        const era = byId('era').value;
        byId('epoch').value = era === now.era ? Math.max(0, now.epoch - 1) : 55;
      }
      message('Choose an era and epoch. The latest completed epoch is selected by default.');
    } catch (error) { message('Unable to reach Minataur. Check your connection and whether the proxy allows this site origin.', true); }
  };
  byId('era').addEventListener('change', () => {
    byId('epoch').max = byId('era').value === 'berkeley' ? '55' : '';
    byId('epoch').value = byId('era').value === 'berkeley' ? 54 : 0;
    resetEstimates();
  });
  ['epoch', 'publicKey1', 'publicKey2', 'publicKey3'].forEach(id => byId(id).addEventListener('change', resetEstimates));

  async function dataset(s, keys, account) {
    const [first, second, snapshot] = await Promise.all([
      validator(s, keys[0]), validator(s, keys[1]),
      request('ledger', { epoch: s.apiEpoch, publicKey: account.info.key })
    ]);
    if (!snapshot.ledger || Number(snapshot.ledger.epoch) !== s.apiEpoch)
      throw new Error(`${s.label}: historical account ledger unavailable.`);
    const record = snapshot.ledger.data;
    const historical = record && record.balance != null;
    const simulationAccount = { ...account, info: { ...account.info, is_olabs: account.info.is_olabs ?? account.info.is_o1labs,
      balance: historical ? record.balance : account.info.balance }, ledger: historical ? record : null };
    return { first, second, account: simulationAccount, fallback: !historical };
  }
  async function validator(s, publicKey) {
    const [response, ...works] = await Promise.all([
      request('delegators', { epoch: s.apiEpoch, publicKey, limit: 25000 }),
      ...model.workEpochs(s, network).map(epoch => request('work', { epoch, publicKey, includeOrphanBlocks: false }))
    ]);
    const ledger = response.ledger;
    if (!ledger || Number(ledger.epoch) !== s.apiEpoch || !Array.isArray(ledger.delegators)
        || Number(ledger.delegators_count) !== ledger.delegators.length || !(Number(ledger.stake) > 0))
      throw new Error(`${s.label}: staking ledger unavailable or incomplete.`);
    const work = model.normalizeWork(s, works.map(response => {
      if (!response.work) throw new Error(`${s.label}: block data unavailable.`);
      return response.work;
    }), publicKey);
    return { ledger, work };
  }
  function extra(s, validator, account, manual) {
    if (validator.ledger.delegators.some(d => d.public_key === account.info.key)) return 0;
    return model.additionalBlocks(validator.ledger, account.info.balance, network.total_currency, s, network, manual);
  }
  function copyLedger(ledger) { return { ...ledger, delegators: ledger.delegators.map(d => ({ ...d })) }; }
  window.fetchData = async function () {
    if (running) return;
    running = true;
    const controls = [...document.querySelectorAll('input:not(#theme-toggle), select, button')];
    const disabled = controls.map(control => control.disabled);
    controls.forEach(control => { control.disabled = true; });
    byId('compare').textContent = 'Comparing…';
    byId('compare').ariaBusy = 'true';
    byId('results').hidden = false;
    byId('resultsEmpty').hidden = true;
    byId('results').ariaBusy = 'true';
    loading([...tableLoaders, ...chartLoaders], true);
    message('Loading comparison…');
    cache = new Map();
    const tableIds = ['accountTable', 'delegator1Table', 'delegator2Table', 'delegatorsTable', 'delegatorsTable2'];
    let comparisonLoaded = false;
    tableIds.forEach(clearTable);
    if (performanceChart) { performanceChart.destroy(); performanceChart = null; }
    if (APYChart) { APYChart.destroy(); APYChart = null; }
    document.querySelectorAll('.chart-container').forEach(el => { el.style.display = 'none'; });
    try {
      const s = selected();
      const key = byId('publicKey3').value.trim();
      const publicKey1 = byId('publicKey1').value.trim();
      if (!/^B62[1-9A-HJ-NP-Za-km-z]{52}$/.test(key) || !/^B62[1-9A-HJ-NP-Za-km-z]{52}$/.test(publicKey1))
        throw new Error('Enter valid Mina public keys.');
      const fees = ['fee1', 'fee2'].map(id => {
        const n = Number(byId(id).value);
        if (byId(id).value === '' || !Number.isFinite(n) || n < 0 || n > 100) throw new Error('Fees must be between 0 and 100%.');
        return n;
      });
      const manuals = ['addBlocks1', 'addBlocks2'].map(id => byId(id).value);
      network = (await request('epoch')).epoch;
      const now = model.current(network);
      if (s.era === 'mesa' && (now.era !== 'mesa' || s.epoch > now.epoch)) throw new Error('This epoch has not started yet.');
      const account = (await request('account', { publicKey: key })).account;
      if (!account || !account.info) throw new Error('Account unavailable.');
      let secondKey = byId('publicKey2').value.trim();
      if (!secondKey) {
        const snapshot = (await request('ledger', { epoch: s.apiEpoch, publicKey: key })).ledger;
        secondKey = snapshot && snapshot.data && snapshot.data.delegate_key;
        if (!secondKey) throw new Error('No delegate in this epoch. Enter the second validator explicitly.');
        byId('publicKey2').value = secondKey;
      }
      if (!/^B62[1-9A-HJ-NP-Za-km-z]{52}$/.test(secondKey)) throw new Error('Enter a valid second validator public key.');
      const keys = [publicKey1, secondKey];
      const data = await dataset(s, keys, account);
      const additions = [data.first, data.second].map((v, i) => extra(s, v, data.account, manuals[i]));
      byId('results-heading').textContent = `${s.label} · comparison`;
      populateAccountTable(account);
      loading(['accountTableLoader'], false);
      [data.first, data.second].forEach((v, i) => {
        const input = byId(`addBlocks${i + 1}`);
        input.placeholder = `Automatic: ${additions[i]}`;
        // Render effective values without turning an automatic estimate into a manual override.
        populateDelegatorTable(`delegator${i + 1}Table`, v.ledger, v.work, data.account, { value: additions[i] }, keys[i], network.total_currency);
        populateDelegatorsTable(copyLedger(v.ledger), v.work, data.account,
          i === 0 ? 'delegatorsTable' : 'delegatorsTable2', key, byId('showPublicKey3').checked, fees[i], additions[i]);
      });
      loading(tableLoaders, false);
      comparisonLoaded = true;
      message(`${s.label}: comparison loaded. Loading history…`);
      await charts(s, keys, account, fees, manuals, now);
      const partial = s.era === now.era && s.epoch === now.epoch;
      message(`${s.label}${partial ? ' — in progress (APY excluded)' : ''}. ` +
        'History uses epoch ledger balances; absent accounts use their current balance. ' +
        'Automatic extra blocks use the current network currency as an approximation. ' +
        'Berkeley 55 is truncated: no APY or automatic extra blocks.');
    } catch (error) {
      console.error(error);
      if (!comparisonLoaded) {
        byId('results').hidden = true;
        byId('resultsEmpty').hidden = false;
      }
      message(`Comparison could not be completed: ${error.message}`, true);
    } finally {
      loading([...tableLoaders, ...chartLoaders], false);
      byId('compare').textContent = 'Compare validators';
      byId('compare').ariaBusy = 'false';
      byId('results').ariaBusy = 'false';
      controls.forEach((control, i) => { control.disabled = disabled[i]; });
      running = false;
    }
  };
  async function charts(s, keys, account, fees, manuals, now) {
    const chart = { epochs: [], blockCounts1: [], blockCounts2: [], delegatorsNumbers1: [], delegatorsNumbers2: [],
      stake1: [], stake2: [], payouts1: [], payouts2: [], cumul1: [], cumul2: [], apy1: [], apy2: [] };
    const entries = model.history(s);
    for (const [position, entry] of entries.entries()) {
      message(`Loading history ${position + 1} / ${entries.length} — ${entry.label}…`);
      const data = await dataset(entry, keys, account);
      chart.epochs.push(entry.label);
      [data.first, data.second].forEach((v, index) => {
        const n = index + 1;
        const additions = extra(entry, v, data.account, manuals[index]);
        const payout = computePayouts(copyLedger(v.ledger), v.work, data.account, account.info.key, fees[index], additions);
        chart[`blockCounts${n}`].push(v.work.count);
        chart[`delegatorsNumbers${n}`].push(Number(v.ledger.delegators_count));
        chart[`stake${n}`].push(Number(v.ledger.stake) / 1e9);
        chart[`payouts${n}`].push(payout.totalDelegatorDueAmount);
        const cumulative = chart[`cumul${n}`];
        cumulative.push((cumulative.length ? cumulative[cumulative.length - 1] : 0) + payout.totalDelegatorDueAmount);
        chart[`apy${n}`].push(model.apy(payout.totalDueAmount, payout.totalDelegatorStake / 1e9, entry,
          entry.era === now.era && entry.epoch === now.epoch));
      });
    }
    updateCharts(chart);
    updateAPYCharts(chart);
    if (typeof applyChartTheme === 'function') applyChartTheme();
    toggleDataLabels(performanceChart, byId('showDataLabels').checked);
    toggleDataLabels(APYChart, byId('showDataLabels').checked);
  }
})();
