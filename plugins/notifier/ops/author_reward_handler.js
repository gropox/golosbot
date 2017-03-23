var golos = require("../../../golos");
var global = require("../../../tools/global");
var telegram = require("../telegram");

function debug(msg) {
    console.log("author_reward_handler: " + msg );
}

function trace(msg) {
    console.log("author_reward_handler: " + msg );
}

module.exports.handle = async function (reward) {
    await notifyAuthorReward(reward);
}    

async function notifyAuthorReward(reward)  {
    
    let content = await golos.getContent(reward.author, reward.permlink);    
    let message = "";

    let rewardGests = await golos.calculateGests(reward.vesting_payout);
    let rewardGbg = parseFloat(reward.sbd_payout.split(" ")[0]).toFixed(3);
    let rewardGolos = parseFloat(reward.steem_payout.split(" ")[0]).toFixed(3);
    let payoutMsg = rewardGests.toFixed(3) + " Силы голоса";

    let lstComma = (rewardGolos > 0)?", ":" и ";
    if(rewardGbg > 0) {
        payoutMsg = payoutMsg + lstComma + rewardGbg + " Золотых" ;
    }
    
    if(rewardGolos > 0) {
        payoutMsg = payoutMsg + " и " + rewardGbg + " Голосов" + lstComma;
    }
    
    rewardGests = rewardGests.toFixed(3);
    if(content.title == "") {
        message = "Вы получили " + payoutMsg + " авторских за комментарий к теме *" + content.root_title + "*"
            + "\n[Тема](" + global.settings.host + "/@" + reward.author + "/" + reward.permlink + ")"; 
    } else {
        message = "Вы получили " + payoutMsg + " авторских за тему *" + content.title + "*"
            + "\n[Тема](" + global.settings.host + "/@" + reward.author + "/" + reward.permlink + ")"; 
    }
    debug("msg : " + message);
    telegram.send(message);
}


