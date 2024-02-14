---
sidebar_position: 11
sidebar_label: Generic bash script to send messages to our bot
sidebar_class_name: green
---

# Purpose
This section presents a bash script that will serve as a generic message program to talk to our bot.
The aim is to be able to do something as easy as 

```bash
$ echo "toto" | tg_logbot.sh
```

To send a message to our chatbot without the need to use complexe curl in each of our programs that will communicate with our chatbot.

## The `tg_logbot.sh` script

```bash
$ vim tg_logbot.sh
```

```bash
#!/bin/bash
CHATID="0123456789"
KEY="`YOUR_BOT_TOKEN`"
TIME="10"
URL="https://api.telegram.org/bot$KEY/sendMessage"
while IFS= read -r line; do
        line=`echo "$line" | sed -e 's/\"//g'`
        line=`echo "$line" | sed -e 's/\[//g'`
        echo "$line"
        line=`echo "$line" | sed -e 's/\]//g'`
        echo "$line"
        line=`echo "$line" | sed -e 's/_/\\\_/g'`
        echo "$line"
        line=`echo "$line" | sed -e 's/\*//g'`
        echo send new line as msg: "$line"
        curl -s --max-time $TIME -d "chat_id=$CHATID&disable_web_page_preview=1&parse_mode=markdown" --data-urlencode "text=$line" $URL >/dev/null
done
```

You will have to replace the `CHATID` and `KEY` values with your own ones.

Once saved, make the script executable :

```bash
$ chmod +x tg_logbot.sh
```

And once again, that is ALL !!  
You can now try to **pipe**, **tail**, **cat** whatever your want to the shell script which will handle its transfer to our chatbot !!




