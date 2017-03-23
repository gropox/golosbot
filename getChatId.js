var global = require("./tools/global");
var tg = require("telegram-bot-api-c")(global.settings.telegram.token);

async function waitMessage() {
    const opts  = {
        "limit":    100,
        "timeout":  0,
        "interval": 2 // <-- Default / Sec. 
    };
    console.log("wait for message 10s...");
    const gSrv = tg.polling(opts, onMsg)
    await sleep(10000);
}

function onMsg(bot) {
    console.log("chat_id = " + bot.cid);
    console.log("text = " + bot.message.text);
}

waitMessage();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
