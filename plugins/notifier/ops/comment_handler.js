var global = require("../../../tools/global");
var golos = require("../../../golos");
var telegram = require("../telegram");
var log = require("../../../tools/logger").getLogger(__filename, 2);

const USERID = global.settings.userid;
const USERID_MATCH = new RegExp("@" + USERID);
module.exports.handle = async function (comment) {
        
    log.trace("comment = " + comment.permlink + " author = " + comment.author);
    if(comment.isMine(USERID)) {
        handleMyComment(comment);
    } else {
        handleAlienComment(comment);
    }

}    

async function handleAlienComment(comment) {
    if(comment.isParentMine(USERID)) {
        notifyCommentedMyComment(comment);
    } else {
        if(!comment.isRoot()) {
            log.trace("комментарий, проверка подписки")
            let subscribed = await global.subscribed(comment.getRoot());
            log.trace("подписка " + subscribed)
            if(subscribed) {
                notifySubscribed(comment);
            }
        }
    }
    checkMention(comment);
}    


async function checkMention(comment) {
    //log.debug("check mention");
    //проверить упоминание, искать в тексте @{USERID}
    if(comment.body.match(USERID_MATCH)) {
        let root = comment.getRoot();
        log.debug("root = " + root );
        let parts = root.match(/@(.+)\/(.*)/);
        let content = await golos.getContent(parts[1], parts[2]);
        log.debug("notify mention");
        let msg = "@" + comment.author + " упомянул вас в теме *" + content.root_title + "*"
        +"\n[Комментарий](" + buildOwnUrl(comment) + ")";
        log.debug(msg);   
        telegram.send(msg);        
    }       
}

async function handleMyComment(comment) {
    log.trace("comment is mine");
    //я 
    // * оставил комментарий, 
    // * написал пост,
    // * отредактировал пост
    // * отредактировал комментарий
    if(!comment.isRoot()) {
        // прокомментировал чей-то пост или комментарий 
        await subscribeToThema(comment);
    }    
}

function buildOwnUrl(comment) {
    return global.settings.host + "/@" + comment.author + "/" + comment.permlink; 
}

async function subscribeToThema(comment) {
    let root = comment.getRoot();
    await global.subscribe(root);
    log.trace("subscribed to " + root );
}

async function notifySubscribed(comment) {
    let root = comment.getRoot();
    let parts = root.match(/@(.+)\/(.*)/);
    let content = await golos.getContent(parts[1], parts[2]);
    log.debug("notify subscribed");
    let msg = "@" + comment.author + " прокомментировал пост *" + content.root_title + "*, на который вы подписанны"
    +"\n[Комментарий](" + buildOwnUrl(comment) + ")";
    log.debug(msg);   
    telegram.send(msg);    
}

async function notifyCommentedMyComment(comment) {
    let content = await golos.getContent(comment.parent_author, comment.parent_permlink);
    
    msg = "";
    
    if(content.title == "") {
        msg = "@" + comment.author + " ответил на ваш комментарий в теме *" + content.root_title + "*"
            + "\n[Комментарий](" + buildOwnUrl(comment) + ")";
    } else {
        msg = "@" + comment.author + " прокомментировал ваш пост *" + content.root_title + "*"
        + "\n[Комментарий](" + buildOwnUrl(comment) + ")";
    }
    log.debug(msg);   
    telegram.send(msg);
}

