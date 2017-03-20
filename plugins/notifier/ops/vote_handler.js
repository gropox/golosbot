var golos = require("../../../golos");
var global = require("../../../tools/global");

module.exports.handle = async function (vote) {
    if(vote.isCommentMine(global.settings.userid) && !vote.isMine(global.settings.userid)) {
        await notifyVote(opBody);
    } 

}    

async function notifyVote(vote)  {
    //debug("notify about vote " + JSON.stringify(opBody));
    let weight = vote.weight / 100.0;
    let fish = await getVoterPower(vote.voter);
    let message = "[" + fish + "] @" + vote.voter + " проголосовал за ваc с силой " + weight + "%"
        + "\n[Тема](" + global.settings.host + "/@" + vote.author + "/" + vote.permlink + ")"; 
    debug("msg : " + message);
    tg.api.sendMessage({chat_id: global.settings.telegram.chatid, text : message, parse_mode : "markdown"});
}


