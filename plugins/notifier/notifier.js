var global = require("../../tools/global");
var golos = require("../../golos");

var commentHandler = require("./ops/comment_handler");
var voteHandler = require("./ops/vote_handler");

var tg = require("telegram-bot-api-c")(global.settings.telegram.token);

function debug(msg) {
    console.log("notifier: " + msg);
}

module.exports.accept = function(op) {
    //debug("check op [" + op + "]");
    switch(op) {
        case "vote" :
            return true;
        case "comment" :
            return true;
        default:
            return false;    
    }
}

module.exports.process = async function (op, opBody) {

    switch(op) {
    case "vote": 
        voteHandler.handle(new golos.Vote(opBody));
        break;
    case "comment": 
        commentHandler.handle(new golos.Comment(opBody));
        break;
    }   
}





