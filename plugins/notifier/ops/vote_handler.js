var golos = require("../../../golos");
var global = require("../../../tools/global");
var telegram = require("../telegram");

function debug(msg) {
    console.log("vote_handler: " + msg );
}

function trace(msg) {
    console.log("vote_handler: " + msg );
}

module.exports.handle = async function (vote) {
    if(vote.isMine(global.settings.userid)) {
        //Я голосовал
        if(!vote.isCommentMine(global.settings.userid)) {
            //Голосвал за чей то пост
            //Подпишемся
            subscribe(vote);
        }
    } else {
        //Я кто-то другой голосовал
        if(vote.isCommentMine(global.settings.userid)) {
            //Голосовали за мой пост
            await notifyVote(vote);
        } 
    }
}    

async function subscribe(vote) {
    let root = vote.getRoot();
    await global.subscribe(root);
    console.log("subscribed to " + root );
}

async function notifyVote(vote)  {
    let content = await golos.getContent(vote.author, vote.permlink);    
    let message = "";
    let weight = vote.weight / 100.0;
    let fish = await golos.getUserPower(vote.voter);
    
    if(content.title == "") {
        message = "/" + fish + "/ @" + vote.voter + " проголосовал за ваш комментарий в теме *" + content.root_title + "* с силой " + weight + "%"
            + "\n[Тема](" + global.settings.host + "/@" + vote.author + "/" + vote.permlink + ")"; 
    } else {
        message = "/" + fish + "/ @" + vote.voter + " проголосовал за ваш пост *" + content.title + "* с силой " + weight + "%"
            + "\n[Тема](" + global.settings.host + "/@" + vote.author + "/" + vote.permlink + ")"; 
    }
    debug("msg : " + message);
    telegram.send(message);
}


