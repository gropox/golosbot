var global = require("../../../tools/global");
var golos = require("../../../golos");
var telegram = require("../telegram");
function debug(msg) {
    console.log("comment_handler: " + msg );
}

function trace(msg) {
    console.log("comment_handler: " + msg );
}

module.exports.handle = async function (comment) {
        
    trace("comment = " + comment.permlink + " author = " + comment.author );
    if(comment.isMine(global.settings.userid)) {
        handleMineComment(comment);
    } else {
        handleAlienComment(comment);
    }

}    

async function handleAlienComment(comment) {
    if(comment.isParentMine(global.settings.userid)) {
        notifyCommentedMyComment(comment);
    } else {
        if(!comment.isRoot()) {
            trace("комментарий, проверка подписки")
            let subscribed = await global.subscribed(comment.getRoot());
            trace("подписка " + subscribed)
            if(subscribed) {
                notifySubscribed(comment);
            }
        }
    }
}    


async function handleMineComment(comment) {
    trace("comment is mine");
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
    console.log("subscribed to " + root );
}

async function notifySubscribed(comment) {
    let root = comment.getRoot();
    let parts = root.match(/@(.+)\/(.*)/);
    let content = await golos.getContent(parts[1], parts[2]);
    debug("notify subscribed");
    let msg = "@" + comment.author + " прокомментировал пост *\"" + content.root_title + "\"*, на который вы подписанны"
    +"\n[Комментарий](" + buildOwnUrl(comment) + ")";
    debug(msg);   
    telegram.send(msg);    
}

async function notifyCommentedMyComment(comment) {
    let content = await golos.getContent(comment.parent_author, comment.parent_permlink);
    let msg = "@" + comment.author + " прокомментировал ваш пост *\"" + content.root_title + "\"*"
        + "\n[Комментарий](" + buildOwnUrl(comment) + ")";
    debug(msg);   
    telegram.send(msg);
}

