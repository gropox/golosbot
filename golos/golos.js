var steem = require("steem");
var Comment = require("./ops/comment");
var Vote = require("./ops/vote");

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

async function getProps() {
    await retrieveDynGlobProps();
    return props;
}

/**
 * Вычисляет Gests как в кошельке.
 */
async function calculateGests(userid) {

    let props = await getProps();
    
    let steem_per_mvests = 
        1000000.0 * parseFloat(props.total_vesting_fund_steem.split(" ")[0]) / parseFloat(props.total_vesting_shares.split(" ")[0]); 
  
    let voterData = await getAccountData(userid);

    let gests = parseFloat(voterData[0].vesting_shares.split(" ")[0]);

    gests = steem_per_mvests * gests / 1000000;
    
    return gests;
}


async function getUserPower(userid) {
    let voterData = await getAccountData(voter);
    let gests = parseFloat(voterData[0].vesting_shares.split(" ")[0]);

    gests = gests / 1000;
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

module.exports.getUserPower = getUserPower;
module.exports.getProps = getProps;
module.exports.getAccountData = getAccountData;
module.exports.calculateGests = calculateGests;
module.exports.getCurrentServerTime = getCurrentServerTime;
module.exports.Comment = Comment;
module.exports.Vote = Vote;
