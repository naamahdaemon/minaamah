---
slug: Updated Mina Pool Payout Script
title: Mina Pool Payout script updated
authors: [naamah]
tags: [mina, payouts, script, tool]
---

# Mina Pool Payout Script updated
The Jonathan's Mina Pool Payout Script has been updated.  
All BP should update to the new v1.7.0 payout script.  

This version fixes a discrepancy in the way Foundation and o1Labs delegation payouts are computed compared to the old script.  
  
It adds a new environment variable `PAYOUT_CALCULATOR` to drive the behavior of the transaction fees share.

Valid calculators include for the post-fork rewards : 

* `postSuperChargeShareFees` : Share the fees between all delegates including foundation, investors and o1labs
* `postSuperChargeKeepFees` : Validator keeps all the fees
* `postSuperChargeCommonShareFees` : Share the fees between delegates excluding foundation, investors and o1labs (**this was the old behaviour and the default one**)

Update your script here : https://github.com/jrwashburn/mina-pool-payout


