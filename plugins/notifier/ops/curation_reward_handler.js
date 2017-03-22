var golos = require("../../../golos");
var global = require("../../../tools/global");
var telegram = require("../telegram");

function debug(msg) {
    console.log("curation_reward_handler: " + msg );
}

function trace(msg) {
    console.log("curation_reward_handler: " + msg );
}

module.exports.handle = async function (reward) {
    if(reward.isMine(global.settings.userid)) {
        await notifyCurationReward(reward);
    } 
    
    
}    

async function notifyCurationReward(reward)  {
    
    let content = await golos.getContent(reward.comment_author, reward.comment_permlink);    
    let message = "";

    let rewardGests = await golos.calculateGests(reward.reward);
    rewardGests = rewardGests.toFixed(3);
    if(content.title == "") {
        message = "Вы получили кураторские " + rewardGests + " Силы Голоса за отданный голос к коментарию в теме *" + content.root_title + "*"
            + "\n[Комментарий](" + global.settings.host + "/@" + reward.comment_author + "/" + reward.comment_permlink + ")"; 
    } else {
        message = "Вы получили кураторские " + rewardGests + " Cилы Голоса за отданный голос теме *" + content.title + "*"
            + "\n[Тема](" + global.settings.host + "/@" + reward.comment_author + "/" + reward.comment_permlink + ")"; 
    }
    debug("msg : " + message);
    telegram.send(message);
}


