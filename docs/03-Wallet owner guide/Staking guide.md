---
sidebar_position: 7
sidebar_label: Staking guide
sidebar_class_name: green
---
import bp from '../assets/naamah_bp_qrcode.png';

## Staking Guide
The official Mina documentation contains a very detailed guide to staking.
You'll find many useful documentation on official mina website and blog.

If you only want to rely on a non custodial wallet to delegate your mina to a third party validator, then you just have tol
 follow the simple steps described here :

* Install a Mina wallet  
https://docs.minaprotocol.com/using-mina/install-a-wallet

* Delegate your stake to a validator using your wallet  
https://docs.minaprotocol.com/using-mina/how-to-delegate


You may also want to run your own node / staking pool or more, then you can have a look at the following pages :

* https://minaprotocol.com/blog/staking-rewards-on-mina  
In this blog article, you'll learn
  * How to create a key
  * How to look for the most appropriate staking pool that fits your needs using existing explorers
  * How many rewards and APY from your block producer / validator you can expect.
  * ...
  
:::note  
*As stated on the blog page above :*

>After re-delegating, there is a latency period of 2-4 weeks before your new stake delegation comes into effect. 
>Block rewards payouts happen off-chain, which the Staking-as-a-Service provider should be sending back to you. Check with each provider/staking pool how this is done. 
>Be sure to do your own due diligence before selecting a staking pool. Good things to look for include but are not limited to:
>* Node performance (click on each validator on this [list](https://minascan.io/mainnet/validators/terms) to view their performance stats.)
>* Their responsiveness, activity, and reputation in the community
>* Their terms (% fee that they’re charging, how often they’re sending the rewards, etc.) and their track record of fulfilling these (can be checked by using a block explorer* (such as [Mina Explorer](https://minaexplorer.com/), [Minataur](http://minotaur.net/), [Minascan](http://minascan.io/))

If you have questions about staking pools, there is a #staking-pool channel on [Mina’s Discord server](http://bit.ly/MinaDiscord).
:::

:::info
I also built a delegator reward calculator / payout calculator / Block producer comparison tool available here :
https://mina.naamahdaemon.eu/payout-simulator

It may help you to determine which validator you can expect the more returns from.
:::

For a more in depth / technical point of view, you can refer to :

* https://docs.minaprotocol.com/node-operators/staking-and-snarking

## Naamah Validator information
You will find my validator on each of those explorers :

**minataur.net**  
https://minataur.net/account/B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr

**minaexplorer.com**  
https://minaexplorer.com/wallet/B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr

**minascan.io**  
https://minascan.io/mainnet/validator/B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr/delegations
  
Feel Free to delegate to my block producer !

:::note My Validator Address 
```
B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr
```
<div class="text--center">
<img src={bp} alt="Naamah BP" style={{width: 240}} />
</div>
:::

