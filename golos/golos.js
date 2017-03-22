var steem = require("steem");
var Comment = require("./ops/comment");
var Vote = require("./ops/vote");
var CurationReward = require("./ops/curation_reward");
var AuthorReward = require("./ops/author_reward");

const golos_ws = "wss://ws.golos.io";
steem.api.setWebSocket(golos_ws);

var timeDiff = 0;
var lastRetrievedProps = 0;


var props = {};

/** holt properties */
async function retrieveDynGlobProps() {
    try {
        //console.log("current time " + new Date().getTime());
        //console.log("last retrieved " + lastRetrievedProps );
        //console.log("timeDiff " + timeDiff );
        if(lastRetrievedProps + timeDiff + 15000 < new Date().getTime()) {
            console.log("retrieve dyn glob props"); 
            props = await steem.api.getDynamicGlobalPropertiesAsync();
            //console.log(JSON.stringify(props));
            lastRetrievedProps = getCurrentServerTime();
            //console.log("last retrieved " + lastRetrievedProps );              
            timeDiff = new Date().getTime() - lastRetrievedProps;
        }
    } catch(e) {
        console.error(e);
    }        
}

/** time in milliseconds */
function getCurrentServerTime() {
    return Date.parse(props.time) + timeDiff;
}

module.exports.getBlock = async function(number) {
    try {
        var block = await steem.api.getBlockAsync(number);
        return block;
    } catch(e) {
        console.error(e);
    }        
}

async function getAccountData(userid) {
    try {
        var accountData = await steem.api.getAccountsAsync([userid]);
        return accountData;
    } catch(e) {
        console.error(e);
    }        
}

async function getContent(userid, permlink) {
    try {
        var content = await steem.api.getContentAsync(userid, permlink);
        return content;
    } catch(e) {
        console.error(e);
    }        
}


async function getProps() {
    await retrieveDynGlobProps();
    return props;
}

/**
 * Вычисляет Gests как в кошельке.
 */
async function calculateGests(vesting_shares) {

    let props = await getProps();
    
    let steem_per_mvests = 
        1000000.0 * parseFloat(props.total_vesting_fund_steem.split(" ")[0]) / parseFloat(props.total_vesting_shares.split(" ")[0]); 

    let gests = parseFloat(vesting_shares.split(" ")[0]);

    gests = steem_per_mvests * gests / 1000000;
    
    return gests;
}


async function getUserPower(userid) {
    let userData = await getAccountData(userid);
    //let gests = parseFloat(userData[0].vesting_shares.split(" ")[0]);

    //gests = gests / 1000;
    
    let gests = await calculateGests(userData[0].vesting_shares);
    if(gests <= 999) {
        return "Морской конек";
    } else if(gests <= 9999) {
        return "Гольян";
    } else if( gests <= 99999) {
        return "Дельфин";
    } else if( gests <= 999999) {
        return "Косатка";
    } else {
        return "Кит";
    }     
}

async function getAccountHistory(userid, startId, count) {
    try {
        var accountHistory = await steem.api.getAccountHistoryAsync(userid,startId,count);
        return accountHistory;
    } catch(e) {
        console.error(e);
        return [];
    }     
} 

module.exports.getAccountHistory = getAccountHistory;
module.exports.getContent = getContent;
module.exports.getUserPower = getUserPower;
module.exports.getProps = getProps;
module.exports.getAccountData = getAccountData;
module.exports.calculateGests = calculateGests;
module.exports.getCurrentServerTime = getCurrentServerTime;

module.exports.Comment = Comment;
module.exports.Vote = Vote;
module.exports.CurationReward = CurationReward;
module.exports.AuthorReward = AuthorReward;

