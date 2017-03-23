var global = require("../../tools/global");
var tg = require("telegram-bot-api-c")(global.settings.telegram.token);    

function debug(msg) {
    console.log("telegram: " + msg );
}

function trace(msg) {
    console.log("telegram: " + msg );
}

module.exports.send = function(msg) {
    debug("send messag: " + msg);
    tg.api.sendMessage({chat_id: global.settings.telegram.chatid, text: msg, parse_mode: "Markdown"})
}



