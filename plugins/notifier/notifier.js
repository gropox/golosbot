var global = require("../../tools/global");
var golos = require("../../golos");

var commentHandler = require("./ops/comment_handler");
var voteHandler = require("./ops/vote_handler");
var curationRewardHandler = require("./ops/curation_reward_handler");



function debug(msg) {
    console.log("notifier: " + msg);
}

module.exports.accept = function(op) {
    //debug("check op [" + op + "]");
    switch(op) {
        case "vote" :
        case "comment" :
        case "curation_reward" :
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
    case "curation_reward": 
        curationRewardHandler.handle(new golos.CurationReward(opBody));
        break;
    }   
}





