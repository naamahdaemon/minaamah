---
sidebar_position: 3
sidebar_label: Programme de délégation
sidebar_class_name: green
---
# Programme de délégation
The Mina Foundation's delegation program (there is also a delegation program operated by o1labs) allows, under certain conditions, delegation of approximately 800k-1M Mina from the Mina Foundation. 
This enables independent validators to produce blocks and receive rewards (coinbase) for the production of these blocks.

Information about how to join and program conditions are available here :

- [https://www.minafoundation.com/#delegation](https://www.minafoundation.com/#delegation)

In practice, the conditions to be met to qualify for a delegation from the foundation are as follows:

* Operate one or more servers running a Mina validation node.
* Maintain a global server uptime of 100% for a minimum of 3 months (90 days), after which the first eligibility condition will be met (uptime = 100%).
* Provide the KYC (Know Your Customer) information requested by the program initiators (Mina Foundation / o1Labs) through one of their approved partners (Coinlist / Synaps).
* Be among the top 240 validators with the highest uptime score (100% being the standard; there are approximately 340 operators with 100% uptime today).
	* In case of a tie, the foundation or o1labs conducts a random draw.

Once the delegation is obtained, adhere to the rules imposed by the foundation:

* Calculate the reward amount to be returned to each delegator accurately (there is a script to automate this process).
* Return the required reward amount within the specified timeframe (block 3500 of epoch n+1 at the latest) 
* Follow the rules (transaction memo containing the MD5 hash of the block producer's public address, amount, and repayment deadline) 