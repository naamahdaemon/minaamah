---
slug: Mina Alert Telegram Bot
title: Mina Alert Telegram Bot
authors: [naamah]
tags: [mina, telegram, July, bot, tools]
---
import bp from './naamah_bp_qrcode.png';

# Mina Telegram Bot
Hello There !   
It has been a while since the last update here !  
  
I would like to introduce my new tool dedicated to every Mina Protocol user :   
  
**Mina Alert Bot**  

![START PAGE](start.png)

**Mina Alert Bot** 
is a telegram bot that bring the power of a Mina blockchain explorer right in your Telegram application.  
  
Add the bot to your telegram by clicking on :  
  
:::tip  MINA_ALERT_BOT
[https://t.me/mina_monitor_bot](https://t.me/mina_monitor_bot)  
:::  
 
---  
## Wallet Watch list
You can add, name, remove, rename any mina wallet address you want to watch for any transaction occuring on that address including :  
  
  * Payment transaction in/out
  * Stake delegation transaction in/out
  * zkApps transactions
  * Token transfers

---  
### `/watch <address> [<name>]`
**Enable watch on `<address>`**  
  
:::info  Example  
`/watch B62qrmRJosdwWKwFXjfLEA7fNaPDkAiSkGmGDLiPQkphCcnC7agyYEZ MY_WALLET`  
  
> ```
> 🆕 User `xxxxxxxxxx` added address `B62qrmRJosdwWKwFXjfLEA7fNaPDkAiSkGmGDLiPQkphCcnC7agyYEZ` to their watchlist  
> 👁️ Address added : `B62qrmRJosdwWKwFXjfLEA7fNaPDkAiSkGmGDLiPQkphCcnC7agyYEZ (MY_WALLET)`  
> ```
:::

You will then receive alert notification messages whenever a transfer occur on this address.

:::info  Example  
> ```
> 📦 `B62qrmRJosdwWKwFXjfLEA7fNaPDkAiSkGmGDLiPQkphCcnC7agyYEZ` →  
> 📦 `B62qrmRJosdwWKwFXjfLEA7fNaPDkAiSkGmGDLiPQkphCcnC7agyYEZ` ←  
> 💸 Amount: 0.010 MINA  
> 💰 Fee: 0.010 MINA  
> 🧾 Kind: PAYMENT  
> 📝 Memo:    zkdev-tx-generator  
> 🔗 Voir sur Minascan  
> ```
:::

---  
### `/unwatch <address>`
**Remove `<address>` from watchlist**  

:::info  Example
`/unwatch B62qrmRJosdwWKwFXjfLEA7fNaPDkAiSkGmGDLiPQkphCcnC7agyYEZ`  
  
> ```
> ❌ Stopped watching: `B62qrmRJosdwWKwFXjfLEA7fNaPDkAiSkGmGDLiPQkphCcnC7agyYEZ`
> ```
:::

---  
## Validator watch list
You can add any validator address to a dedicated watch list so that you will be alerted whenever your validator create a new block and include it on the blockchain.  
 
 * Canonical Blocks
 * Orphan Blocks

---  
### `watch_validator <validator_address> [<name>]`
**Enable watch on validator/block producer**  
  
:::info  Example  
`/watch_validator B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr Naamah`  
  
> ```
> 🆕 User `xxxxxxxxxx` added validator `B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr` to their watchlist  
> ✅ Validator added : `B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr` (`Naamah`)  
> ```
:::  
  
You will then receive alert notification messages whenever a Block is produced by this validator  
  
:::info  Example - Canonical Block  
> ```
> 🟢 Canonical block (height 464142)  
> 🕒 Epoch: 26, Slot: 6273  
> ⛏️ BP `B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr`  
> 💰 Coinbase: 720.00 MINA  
> 🎯 Receiver: `B62qr1kSFmLBtFbx22VwX2m9WWHVLziYUXNnY8413dsTAfsChHjTM2S`  
> 🔗 See on Minascan  
> ```
:::  

:::info  Example - Orphan Block  
> ```
> 🔴 Orphan block (height 464273)  
> 🕒 Epoch: 26, Slot: 6536  
> ⛏️ BP `B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr`  
> 💰 Coinbase: 720.00 MINA  
> 🎯 Receiver: `B62qr1kSFmLBtFbx22VwX2m9WWHVLziYUXNnY8413dsTAfsChHjTM2S`  
> 🔗 See on Minascan  
> ```
:::

---  
### `/unwatch_validator <validator_address>`
**Remove `<address>` from validator watchlist**  
  
:::info  Example
`/unwatch_validator B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr`  
  
> ```
> ❌ Stopped watching validator: `B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr`
> ```
:::

---  
### `/rename <address_or_validator> <label>`
**Rename a watched address or a validator address**  
  
:::info  Example
`/rename B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr Naamah BP`  

> ```
> ✏️ Updated Label for  address and validator `B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr` → `Naamah BP`  
> ```
:::

---  
## Empty Coinbase
### `/alert_coinbase <on>|<off>`  
**enable/disable empty coinbase alert**
If you run a validator, then you may have heard about the Empty Coinbase problem !
This setting allows you to be alerted in real time whenever a block is produced and included in the main chain with an empty coinbase transaction.  
  
:::info  Example
`/alert_coinbase on`

> ```  
> Empty Coinbase Alert activée ✅  
> ```
  
`/alert_coinbase off`  

> ```
> Empty Coinbase Alert désactivée ❌  
> ```
:::

---  
## Validator Statistics
### `/validator_stats [<epoch>] [<validator>]`  
**dispay validators statistics**  
This command will display validator statistics.  
Running without any parameters will display all validators statistics for all epochs.  
You can optionnaly specify a validator and / or an epoch to filter accordingly.  
  
:::info  Example
`/validator_stats`  
> ```
> 📊 Validator Stats — Epoch 26:  
> B62qpge...7pvLPAN | 90 blocks |  10.71%  
> B62qq3T...PTkDBW6 | 77 blocks |  9.17%   
> B62qj28...zXdsYLP | 61 blocks |  7.26%   
> B62qrYi...tTiKhDe | 49 blocks |  5.83%   
> B62qpbp...wfpKvXs | 43 blocks |  5.12%     
> B62qoA5...tG3MQk9 | 40 blocks |  4.76%   
> B62qoiM...xi9ywk2 | 26 blocks |  3.10%   
> B62qmFf...nGBtkBD | 25 blocks |  2.98%   
> B62qq6Z...oDR9Gd6 | 19 blocks |  2.26%   
> B62qmkG...7j2X5zp | 18 blocks |  2.14%   
> B62qopH...iXnTbas | 15 blocks |  1.79%   
> B62qrQi...T8tcUAC | 13 blocks |  1.55%   
> B62qpsi...PWPHxPe | 10 blocks |  1.19%   
> B62qrae...WtfUPm3 | 9 blocks  |  1.07%   
> B62qqV1...r3Rqqzx | 9 blocks  |  1.07%   
> B62qmpS...8XezSuG | 8 blocks  |  0.95%   
> B62qj9S...7dfW4AP | 7 blocks  |  0.83%   
> B62qmM9...kSUGug5 | 7 blocks  |  0.83%   
> B62qrHz...JZA4ECj | 7 blocks  |  0.83%   
> B62qnSj...ynxXZZF | 7 blocks  |  0.83%   
> B62qn7H...K5biQef | 6 blocks  |  0.71%   
> B62qqKo...kC8KZqs | 6 blocks  |  0.71%   
> B62qnxH...9p3kE3b | 6 blocks  |  0.71%   
> B62qkCB...HJjtiX4 | 6 blocks  |  0.71%   
> B62qn7K...EkPsSmJ | 6 blocks  |  0.71%   
> ```
:::

:::info  Example
`/validator_stats 26 B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr`  

> ```
> 📊 Validator Stats — Epoch 26:  
> `B62qpsy...a9fFnWr` | 2 blocks |  100.00%  
> ```
:::

---  
## List watched addresses
### `/list`
**display the list of watched addresses and validators**  
Provide the list of all watched addresses and watched validators.  

:::info  Example  
`/list`  

> ```
> 👁️  Watched Addresses :  
> - B62.................................................... (Address 1)  
> - B62.................................................... (Address 2)  
> - B62.................................................... (Address 3)  
> - B62.................................................... (Address 4)  
> 
> ✅ Watched Validators :  
> - B62.................................................... (Validator 1)  
> - B62.................................................... (Validator 2)  
> - B62.................................................... (Validator 3) 
>  
> 🔔 Empty Coinbase Alert : ✅ ON  
> ```
:::

---  
## Get Epoch and Block information
### `get_block [\<block_height\>}]`  
**display current epoch information or specific Block information**  
Provide epoch information if used without any argument.  
Provide Block detailed information if used with a `block_height` argument.  
  
:::info  Example
`/get_block`  

> ```
> 🟢 We are at block height `464299` (epoch `26`, slot `6603`)  
> ```
  
`/get_block 464299`  

> ```
> 🟢 Canonical block (height 464299)  
> 🕒 Epoch: `26`, Slot: `6603`  
> ⛏️ BP `B62qrYipbTfEx5GoJf99uU2iAcW2jgAvnoy1Wrj4WeMEnnZutTiKhDe`  
> 💰 Coinbase: 720.00 MINA  
> 🎯 Receiver: `B62qp3LaAUKQ76DdFYaQ7bj46HDTgpCaFpwhDqbjNJUC79Rf6x8CxV3`  
> 🔗 See on Minascan  
> ```
:::

---    
## Get Full Address from a shortened address
### `get_full_address <short_address>`  
Return the full validator address from a short validator address returned by `/validator_stats` command.  
  
:::info  Example
`/get_full_address B62qpge...7pvLPAN`  

> ```
> 🔎 Full Address Matches:  
B62qpge4uMq4Vv5Rvc8Gw9qSquUYd6xoW1pz7HQkMSHm6h1o7pvLPAN  
🔗 https://minascan.io/mainnet/account/B62qpge4uMq4Vv5Rvc8Gw9qSquUYd6xoW1pz7HQkMSHm6h1o7pvLPAN/blocks  
> ```
:::

---    
## Get calaculated rewards payout estimation
### `/get_payouts epoch=<num> publicKey=<validator> delegatePubkey=<delegator> [poolFee=5] [foundFee=8] [o1labsFee=5] [shareTxFee=0|1|2]`  
This command returns the expected payouts for an epoch and a validator.  
Used with only `epoch=<num>` `publicKey=<validator>` parameters, it will return the detailed block production, total coinbase, .. stats for this epoch and this validator.  
Used with a wallet address that delegates to this validator `delegatePubkey=<delegator>`, it will return an estimated amount of expected return from this validator to this delegate.  
  
:::info  Example
`/get_payouts epoch=106 publicKey=B62qrYipbTfEx5GoJf99uU2iAcW2jgAvnoy1Wrj4WeMEnnZutTiKhDe`  
> ```
> Epoch: 106  
> Validator: `B62qrYipbTfEx5GoJf99uU2iAcW2jgAvnoy1Wrj4WeMEnnZutTiKhDe`  
> Validator Stake: 32700110.91 MINA  
> Blocks Produced: 176  
> Coinbase: 126720.000 MINA  
> Transaction Fees: 60.14433  
> Snark Fees: 0.00000  
> Empty Coinbase Blocks: 0  
> ```
  
`/get_payouts epoch=106 publicKey=B62qrYipbTfEx5GoJf99uU2iAcW2jgAvnoy1Wrj4WeMEnnZutTiKhDe delegatePubkey=B62qrYipbTfEx5GoJf99uU2iAcW2jgAvnoy1Wrj4WeMEnnZutTiKhDe`  
> ```
> Epoch: 106  
> Validator: `B62qrYipbTfEx5GoJf99uU2iAcW2jgAvnoy1Wrj4WeMEnnZutTiKhDe`  
> Validator Stake: 32700110.91 MINA  
> Blocks Produced: 176  
> Coinbase: 126720.000 MINA  
> Transaction Fees: 60.14433  
> Snark Fees: 0.00000  
> Empty Coinbase Blocks: 0  
>  
> 🚨 FOR INFORMATION ONLY 🚨  
> 🔹 Key: `B62qrYipbTfEx5GoJf99uU2iAcW2jgAvnoy1Wrj4WeMEnnZutTiKhDe`  
> 📦 Stake: 7200.59 MINA  
> 📊 Share: 0.02%  
> 💰 Due Amount: 26.484 MINA  
> 🏷️  Account Type: Regular  
> ```
:::

---  
# Support me by delegating to my Block Producer !

:::note My Validator Address 
```
B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr
```
:::
<div class="text--center">
<img src={bp} alt="Naamah BP" style={{width: 240}} />
</div>
