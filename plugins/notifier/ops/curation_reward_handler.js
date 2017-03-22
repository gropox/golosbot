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
    
    if(content.title == "") {
        message = "Вы получили " + rewardGests + " GESTS кураторских за голос к комментарию в теме *" + content.root_title + "*"
            + "\n[Комментарий](" + global.settings.host + "/@" + reward.comment_author + "/" + reward.comment_permlink + ")"; 
    } else {
        message = "Вы получили " + rewardGests + " GESTS кураторских за голос к теме *" + content.title + "*"
            + "\n[Тема](" + global.settings.host + "/@" + reward.comment_author + "/" + reward.comment_permlink + ")"; 
    }
    debug("msg : " + message);
    telegram.send(message);
}


