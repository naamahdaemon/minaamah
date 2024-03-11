---
sidebar_position: 13
sidebar_label: Sending payout rewards to our chatbot
sidebar_class_name: green
---

# Purpose
In this section, we'll write a script that gets the owed rewards to the BP delegators each time a block is produced and send all due amounts along with delegators public key and memo field to the chatbot.
For this, we'll use the Mina Pool Payout script written by Jonathan (one of my Mina heroes 😊) available here https://github.com/jrwashburn/mina-pool-payout then send the computed due rewards to our chatbot using the `tg_logbot.sh` script we wrote in the previous chapter.  

:::note  
This script is a bit more complex that the previous one but the principles remains exaclty the same
:::

## `get_payouts.sh`
The following script needs to be adapted to your configuration.  
In the example below, it assumes that :  

* ~/mina_scripts/payout/mina-pool-payout is the path to the mina_pool_payout script
* ~/mina_scripts/payout.log will get the formatted payouts resulting from the payout script execution

```bash
$ vim get_payouts.sh
```

```bash
#!/bin/bash

if [[ ( $@ == "--help") ||  $@ == "-h" ]]
then
        echo "Usage: $0 [starting block] [end block] [epoch]"
        exit 0
fi

sblock=$1
eblock=$2
epoch=$3

export POOL_MEMO="&lt;Bp_discord_id&gt;_epoch${epoch}_payout"

nepoch=$epoch
nsblock=$sblock
neblock=$eblock

if [ "$sblock" != "" ]; then
        sblock="-m=$sblock"
fi

if [ "$eblock" != "" ]; then
        eblock="-x=$eblock"
fi

if [ "$epoch" != "" ]; then
        epoch="-e=$epoch"
        sblock=""
        eblock=""
fi

debug=0
interval=3600

while true
do
        # On lance le script de payout
        po="timeout 300 npm --prefix ~/mina_scripts/payout/mina-pool-payout/ run payout -- $sblock $eblock $epoch >/dev/null 2>&1"
        echo "$po"

        $po=$(eval "$po")

        # get last transaction file name
        fn=$(find ~/mina_scripts/payout/mina-pool-payout/src/data -name 'payout_transactions*' -type f -exec ls -t1 {} + 2>/dev/null | head -n 1)
        echo "$fn"

        echo "Le dernier fichier de payout est : $fn"

        # Extract the substring between the last '_' and the last '.'
        lastblock=$(echo "$fn" | grep -o '_[^_]*\.')

        # Remove the '_' at the beginning and the '.' at the end of the substring
        lastblock=${lastblock#_}
        lastblock=${lastblock%.}

        echo "lastblock: $lastblock"

        sblock="-m=$lastblock"
        epoch=""
        eblock=""


        echo -ne "\\n"

        # get the last generated payout transaction file json
        tr="find ~/mina_scripts/payout/mina-pool-payout/src/data -name 'payout_transactions*' -type f -exec ls -t1 {} + 2>/dev/null | head -n 1 | xargs cat | jq ."

        if [ "$debug" == "1" ]; then
                echo "$tr"
        fi
        #echo -ne "\\n"

        tr=$(eval "$tr")

        compte=$(echo "$tr" | jq '. | length')

        if [ "$debug" == "1" ]; then
                echo "$tr"
        fi
        echo "$compte payout à effectuer"

        if [ "$compte" != "0" ]; then
                echo -e "Mina Epoch $nepoch$nsblock$neblock Payouts" >> ~/mina_scripts/payout.log
        fi

        #exit 0


        for row in $(echo "${tr}" | jq -r '.[] | @base64'); do
                _jq() {
                 echo ${row} | base64 --decode |  jq -r ${1}
                }
           pk=$(_jq '.publicKey')
           amount=$(_jq '.amount')
           fee=$(_jq '.feeMina')
           memo=$(_jq '.memo')
           fee=0
           amount=$(echo "scale=9 ;($amount + $fee)/1000000000" | bc)
           echo -e "$pk\\n$amount\\n$memo" >> ~/mina_scripts/payout.log
        done

        sleep $interval
done
```

Once launched, this script will loop every hour, will check if some new payouts have been computed using the payout script from the last block it was launched before (so that only new payouts are returned and will be sent to the telegram bot).

:::note 
The script do not send the telegram message directly. Instead of that, it will add some entries to a `payout.log` file and **this is exactly the only thing this script does !**.  
The payout.log file will then be tailed in background to the `tg_logbot.sh` script so each time a new payout is added to `payout.log` it will be sent to the telegram bot.  
:::

:::tip  Sample payout.log file
```
Mina Epoch 70 Payouts
B62...
2222.222222222
26192608020F76108A141C0C79366D9D
B62...
1111.111111111
26192608020F76108A141C0C79366D9D
B62...
33.333333333
Payout_Memo
B62qiburnzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzmp7r7UN6X
3600.000000000
26192608020F76108A141C0C79366D9D
```
:::

## Using get_payouts.sh
The `get_payouts.sh` script can take either the starting epoch as argument or the start date and/or end date.

:::info  example
```bash
$ ./get_payouts.sh "" "" "70"
```
:::

:::note 
This script above will get payout from epoch 70 and then, as long as the script keeps running, all the payouts that will occur after the last block read.
Note that if more than one block is produced between two runs in the loop, then all blocks will be taken into account in the computed results.
:::

:::warning
Ledgers (staking and next) have to be refreshed manually at the beginning of each new epoch (see Mina Pool Payout script documentation).
:::

In order for the script to run in the backbround you can either use `nohup` along with `&` such as 

```bash
$ nohup ./get_payouts.sh "" "" "70" &
```

Or my prefered method, launch the same in a `screen` session :

```bash
$ screen -S payout
$ ./get_payouts.sh "" "" "70"
```

Then safely detach the screen session with `CTRL+A+D`.  
You can easily reattach the screen session with `screen -R uptime` thereafter.

:::tip  Reminder
Remember that the script only adds payout in a formatted way to the `payout.log` file and that it does not send anything to telegram.
:::

## Sending generated output to telegram
The last step, once the `get_payouts.sh` script runs in the background is to tail in another screen or background process the content of the `payout.log` file to the `tg_logbot.sh` script that will send our payout messages to our telegram bot private channel.

For this, as usual, you can either use  `nohup` along with `&` such as 

```bash
$ nohup tail -f payout.log | ./tg_logbot.sh &
```

or a new `screen` session :

```bash
$ screen -S payout_log
$ tail -f payout.log | ./tg_logbot.sh
```


:::tip  You're done !!
Finally, once both the payout script and the tail of payout.log generated file will be in place, you will receive due payouts right in your telegram bot chat.
:::


