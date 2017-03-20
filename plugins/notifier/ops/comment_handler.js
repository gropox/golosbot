var global = require("../../../tools/global");

function debug(msg) {
    console.log("comment_handler: " + msg );
}

function trace(msg) {
    console.log("comment_handler: " + msg );
}

module.exports.handle = async function (comment) {
        
        trace("comment = " + comment.permlink + " author = " + comment.author );
        if(comment.isMine(global.settings.userid)) {
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
        } else {
            if(comment.isParentMine(global.settings.userid)) {
                notifyCommentedMyComment(comment);
            } else {
                if(!comment.isRoot()) {
                    let subscribed = await global.subscribed(comment.getRoot());
                    if(await global.subscribed(comment.getRoot())) {
                        notifySubscribed(opBody);
                    }
                }
            }
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
    console.log("notify subscribed");
}

async function notifyCommentedMyComment(comment) {
    let msg = comment.author + " прокомментировал ваш пост\n[Комментарий](" + buildOwnUrl(comment) + ")";
    debug(msg);   
}

