---
sidebar_position: 12
sidebar_label: Sending node uptime to our chatbot
sidebar_class_name: green
---

# Purpose
In this section, we'll write a really simple script that sends the uptime of our node as a message to our chatbot every hour.  
This allows you to precisely monitor your uptime and ensure your node never goes down.  
For this, we'll get the uptime from the logs and then send its value to our chatbot using the `tg_logbot.sh` script we wrote in the previous chapter.  

## `get_uptime.sh`
The script we will use is the following :

```bash
$ vim get_uptime.sh
```

```bash
#!/bin/bash
while true
do
        since="24 hours ago" && echo && echo "$(hostname) : Uptime service - sent : $(journalctl --user -u mina -S "$since" | grep 'Sent block with state' | wc -l), failed: $(journalctl --user -u mina -S "$since" | grep 'After 8 attempts, failed' | wc -l)"
        sleep 3600
done
```

Once launched, this script will loop every hour and return the number of successfull and failed uptime upload retrieved from mina logs.

:::info  Example
```
Hostname : Uptime service - sent : 96, failed: 0
```
:::

## Using get_uptime.sh with tg_logbot.sh
In order to send the ouput of the script each time it runs (every hour) to telegram, we will do something as easy as pipe the output from `get_uptime.sh` to `tg_logbot.sh` 

:::info  Example
```bash
$ ./get_uptime.sh | ./tg_logbot.sh
```
:::

In order for the script to run in the backbround you can either use `nohup` along with `&` such as 

```bash
$ nohup ./get_uptime.sh | ./tg_logbot.sh &
```

Or my prefered method, launch the same in a `screen` session :

```bash
$ screen -S uptime
$ ./get_uptime.sh | ./tg_logbot.sh
```

Then safely detach the screen session with `CTRL+A+D`.  
You can easily reattach the screen session with `screen -R uptime` thereafter.

:::tip  You're done !!
Finally, once run, you'll receive every hour right in your telegram chat window with your bot a message with your actual 24 hour uptime.
:::

:::warning  Uptime value
The uptime retrieved from the script is the splipping 24 hours uptime.  
Its value should be **96** (1 upload every 15min, 4 uploads each hour, 4x24=96 uploads a day) which means that you did not miss any uptime upload to the server.  
Please note that when a block is produced, an additional entry in the logs is added that will count as a snark upload as well.  
It means that if you produced 3 blocks the last 24h, then your score will be 99 and not 96.  
:::

