---
sidebar_position: 10
sidebar_label: Why using A telegram bot
sidebar_class_name: green
---

# Why do you need a telegram bot ?
Telegram is a highly popular end-to-end encrypted messaging program.  
As other messaging program, Telegram provide some advanced functionnalities like  the possibility to create **bots**.  
A telegram chatbot, when linked to programs or script can behave as a real user, you can send message to the bot, send commands so that the bot perform some actions on your behalf, ...  
The major advantage of Telegram is the ease of implementation of a bot.  
Once setup, you can use it to monitor quite everything possible to monitor. In the context of a Mina node operator, you can for instance :

* Monitor the uptime of your node  
A simple script will read your node logs at regular inverval and then send your uptime to your bot that will display your uptime.  
* Monitor the payout rewards of your blocks production  
Each time your node will produce a block, your can write a script that will use the official Mina Pool Payout Script (https://github.com/jrwashburn/mina-pool-payout) to send to your bot the result of each payout you have to pay to your delegators.

:::info  **Virtually anything is possible !**
Finally, you can automatize any information you like to send to your bot so that you keep a close eye on your node behavior.
> "The only limit to our realization of tomorrow will be our doubts of today." - Franklin D. Roosevelt
:::

## Create a telegram bot
The process to create a telegram bot is really straightforward and can be achieved in 6 easy steps.

### Step 1. Open the telegram app
Open your telegram app on either your mobile phone or your computer

### Step 2. Connect to Bot Father
BotFather is a bot/special user created by Telegram that allows you to create and manage your own bots.  
To connect to BotFather, search for "@BotFather" in the Telegram app and click on the result to start a conversation.

![BotFather](assets/botfather.png)

### Step 3. Select the New Bot option
In the conversation with BotFather, select the "New Bot" option to start creating your new bot or simple type `/newbot` in the message panel.  
BotFather will guide you through the rest of the process.

### Step 4. Add a bot friendly name and username
Next, BotFather will ask you to provide a name for your bot. Choose a name that accurately reflects the purpose of your bot and is easy to remember.  

Lastly, BotFather will ask you to choose a username for your bot.  
This username will be used to create a unique URL that people can use to access your bot.   
Choose a username that is easy to remember and related to your bot's purpose.  

### Step 5. Test your bot token
Finally, your bot is created !

![botname](assets/createbot.png)  

After obtaining your token, try pasting this URL into your browser:

https://api.telegram.org/bot`YOUR_BOT_TOKEN`/getMe

You'll get the information for your newly created bot :

```json
{
 "ok": true,
 "result": {
  "id": **********,
  "is_bot": true,
  "first_name": "My First Bot",
  "username": "my_first_mina_bot",
  "can_join_groups": true,
  "can_read_all_group_messages": false,
  "supports_inline_queries": false
 }
}
```

### Step 6. Initiate a chat with your bot and get the ChatId
Last step consists of initiating a private chat with your bot so we can get a `chatId` we will adress to send message to.  
Just open a chat with your bot and click on `Start`   

| ![Chat1](assets/chat1.png) | ![Chat2](assets/chat2.png) |
|  -  |  -  |

Then finally head over  

https://api.telegram.org/bot`YOUR_BOT_TOKEN`/getUpdates  

which should return something similar to :  

```json
{
 "ok": true,
 "result": [
  {
   "update_id": 999999999,
   "message": {
    "message_id": 1,
    "from": {
     "id": 0123456789,
     "is_bot": false,
     "first_name": "chatfn",
     "username": "chatun",
     "language_code": "en"
    },
    "chat": {
     "id": 0123456789,
     "first_name": "chatfn",
     "username": "chatun",
     "type": "private"
    },
    "date": 1707867545,
    "text": "/start",
    "entities": [
     {
      "offset": 0,
      "length": 6,
      "type": "bot_command"
     }
    ]
   }
  }
 ]
}
```

And get your `chat` `id` here `0123456789` (example value)  

And that's it! With these six easy steps, you can create your very own Telegram bot. Once you've created your bot, you can start adding features and programming it to do all sorts of fun and useful things.  

:::tip  More Information
Telegram provides a detailed tutorial on bot create here : https://core.telegram.org/bots/tutorial
:::

:::info  Summary
Now you have your bot **token** and your **chatId**.  
These are the only two information you need to communicate with your bot from any program.
:::

## Use your Telegram bot
Now that we have our bot ready, we will use it to send some information originating from our node.  
In principle, you'll find it extremely simple.  

Now, let's try something !!  

:::info  Example
1- Connect to your node  
2- Type the following in your interactive Shell :  

```bash
$ curl -d "chat_id=0123456789&disable_web_page_preview=1&parse_mode=markdown" --data-urlencode "text=Hello" https://api.telegram.org/bot`YOUR_BOT_TOKEN`/sendMessage
```

You will get the following response from telegram :

```json
{
 "ok": true,
 "result": {
  "message_id": 3,
  "from": {
   "id": **********,
   "is_bot": true,
   "first_name": "My First Bot",
   "username": "my_first_mina_bot"
  },
  "chat": {
   "id": 0123456789,
   "first_name": "chatfn",
   "username": "chatun",
   "type": "private"
  },
  "date": 1707869569,
  "text": "Hello"
 }
}
```

And in your telegram private chat with your bot  :  

![message](assets/message.png)

...**So .... Cool !!!**
:::

:::note
Every examples that will follow here are based on exactly the same operating principle.  
A program sends text via the Telegram APIs to our private chat with our bot.  
There's a lot more you can do with a bot that won't be covered here (questions, answers, interactivity, commands...).
:::