/* Share the last completed comparison, not pending form edits. */
(function () {
  'use strict';
  const byId = id => document.getElementById(id);
  let comparison;
  window.resetComparisonShare = function () {
    comparison = null;
    byId('comparisonShare').hidden = true;
    byId('comparisonLink').hidden = true;
    byId('shareStatus').textContent = '';
  };
  window.captureComparisonShare = function () {
    comparison = new URL('https://mina.naamahdaemon.eu/payout-simulator.html');
    ['era', 'epoch', 'publicKey1', 'publicKey2', 'publicKey3', 'fee1', 'fee2', 'addBlocks1', 'addBlocks2'].forEach(id => {
      const value = byId(id).value.trim();
      if (value !== '') comparison.searchParams.set(id, value);
    });
    comparison.searchParams.set('showPublicKey3', byId('showPublicKey3').checked ? '1' : '0');
    comparison.searchParams.set('validate', '1');
    byId('comparisonShare').hidden = false;
    byId('nativeShare').hidden = typeof navigator.share !== 'function';
  };
  function link() {
    if (!comparison) return null;
    comparison.searchParams.set('showDataLabels', byId('showDataLabels').checked ? '1' : '0');
    return comparison.href;
  }
  byId('copyComparison').addEventListener('click', async () => {
    const url = link();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      byId('comparisonLink').hidden = true;
      byId('shareStatus').textContent = 'Comparison link copied.';
    } catch (_) {
      const input = byId('comparisonLink');
      input.value = url;
      input.hidden = false;
      input.focus();
      input.select();
      byId('shareStatus').textContent = 'Automatic copying is unavailable. Copy the selected link below.';
    }
  });
  byId('nativeShare').addEventListener('click', async () => {
    const url = link();
    if (!url) return;
    try {
      await navigator.share({ title: 'Mina payout comparison', url });
      byId('shareStatus').textContent = 'Comparison shared.';
    } catch (error) {
      if (error.name !== 'AbortError') byId('shareStatus').textContent = 'Sharing is unavailable. Use Copy comparison link instead.';
    }
  });
})();
