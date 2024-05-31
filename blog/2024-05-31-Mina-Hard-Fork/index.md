---
slug: Mina Hard Fork
title: Mina Hard Fork coming
authors: [naamah]
tags: [mina, hardfork, zkapp, june]
---

# Mina Hard fork coming soon !!
On June, 4th the mina Blockchain will undergo its biggest upgrade ao far.


This update will bring the ZK programmability layer to the blockchain and ending the supercharged rewards. 

In the same time several potential impacts should be expected.

# D-Day Timeline

The progress of the upgrade and the timeline are documented here:

  [https://minaprotocol.com/blog/minas-berkeley-upgrade-what-to-expect](https://minaprotocol.com/blog/minas-berkeley-upgrade-what-to-expect)  
  
and here  

  [https://minaprotocol.com/mainnet-upgrade-status](https://minaprotocol.com/mainnet-upgrade-status)

# The Block producer timeline

Every block producer will have to update their nodes in order to ensure the resume of the upgraded Blockchain.

Here is a simplified overview of the tasks that every block producer will have to achieve on June, 4th.

**Before June, 4th**  

The only action required by block producer is to update their nodes to version 2.0.0. (All my nodes are upgraded already obviously !)

**On June, 4th**

* **STEP 1**

No specific action is required until the stop network slot is reached (**14:00 UTC**). At least one node must still be active and connected to the network until the stop slot is reached (ideally, all nodes of an operator can remain online). The calculation of uptime will be taken into account until the stop slot is reached (**14:00 UTC**).

* **STEP 2**

Until the upgrade package is released (**20:00 UTC**): No action required.

* **STEP 3**

Once the upgrade package is available: All operators update and restart their nodes (**20:00 UTC - 00:00 UTC**). Uptime calculation will resume at **00:01 UTC** with a tolerance until **01:01 UTC**.

:::note
During this period, no block will be produced.
:::

* **STEP 4**

From 00:00 UTC, the blockchain will restart on Berkeley fully operational: block production, snarks production, uptime, ...


# What's next ?

After the Hard Fork (if all goes well):

* The end of supercharged blocks will result in a decrease in profitability but will also level the playing field for all serious validators. It will also reduce the number of new tokens created, which will limit the inflationary nature of the token (and that's a good thing).

* As a delegator, it will be important to ensure that your validator is up-to-date with their nodes from now on (version 2.0.0) until the update is triggered and their validation nodes are updated, otherwise, they will operate a zombie chain that will no longer produce valid rewards (for you). I encourage everyone to contact their validator to ensure they are up-to-date and that everything is in order for the update on 06/04.

Finally, there will certainly be impacts on tools, explorers, and websites concerning Mina. Some blockchain explorers may experience disruptions or become non-functional or display inconsistent information. Other services will be completely stopped (e.g., Mina Explorer's GraphQL APIs), which may also cause interruptions to some services that use them (my site, for example, uses the Mina Explorer GraphQL API, which I will have to replace eventually to display produced blocks, delegations, and payouts).

In summary, be patient, do not hesitate to contact your validator if you have any questions or problems, and do not panic if the rewards for the epoch post-hard fork take a little time to arrive 😉

**This update is going to be epic. It is important to realize the amount of work and investment that goes into not only updating but also synchronizing all the actors, which are ultimately the key to the success of updating a fully decentralized application.**
