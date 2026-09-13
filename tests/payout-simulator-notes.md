# Mesa simulator regression notes

Run offline checks with:

```sh
node --test tests/payout-model.test.cjs tests/payout-client.test.cjs
```

The optional `node tests/check-payout-live.cjs mesa 0` exercises the page client
against Minataur without a browser. It only reads public chain data.

## Mainnet observations (2026-09-13)

- `https://minataur.net/api/v1/runtime`: Mesa genesis timestamp
  `2026-09-03T18:00:00Z`, global slot origin `958440`, coinbase `360000000000` nanomina.
- MinaProtocol/mina `src/lib/node_config/profiled/mainnet.ml` on `compatible`:
  7140 slots per epoch, 90000 milliseconds per slot, 360 MINA coinbase.
- Minataur `/epoch` reports legacy epoch 136 / since-hard-fork 56 while the
  protocol is in Mesa epoch 1. Use the global slot and the Mesa origin.
- `/work` bucket 135 for Naamah contains 3 Berkeley blocks at 720 MINA and
  11 Mesa blocks at 360 MINA. Bucket 136 also contains the end of Mesa 0.
  Fetch both overlapping buckets, deduplicate by hash, filter by global slot
  and fork timestamp, then sum actual block coinbases and fees.
- `/delegators` and `/ledger` take legacy epoch identifiers. The client uses
  ledger snapshot 135 for Mesa 0, 136 for Mesa 1, etc. These snapshots are
  supplied by Minataur, rather than verified against a local Mina ledger.
- Berkeley 55 is truncated. Do not annualize it or estimate a full epoch's
  additional blocks. Manual block overrides remain possible.
- A current epoch is shown but excluded from APY and its mean. Automatic extra
  blocks use elapsed slots. Historical extra-block estimates use the current
  network currency (explicit approximation); historical balances come from
  `/ledger`, with an explicitly disclosed current-balance fallback for an
  account absent from that ledger.
- Old URLs with `epoch=N` and no `era` keep their Berkeley meaning. New Mesa
  links should use `era=mesa&epoch=N`. No-parameter visits select the latest
  completed Mesa epoch.

## Local browser testing

The existing Akirion proxy permits the production origin
`https://mina.naamahdaemon.eu`, but its OPTIONS response does not authorize
`http://localhost:3000`, `http://localhost:3001`, or `http://127.0.0.1:3002`.
Local browser API requests therefore fail CORS. Do not weaken the proxy's
production policy to get a green local test. Use the offline and live checks
above; confirm the rendered results on an authorized origin before release.
