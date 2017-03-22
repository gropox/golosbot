var fs = require("fs");
var nedb = require("nedb");

const HOME = require('os').homedir();
const CONFIG_FILE = HOME + "/.golosbot.js";
const GOLOSBOT_DB = HOME + "/.golosbot.db";

const SUBSCRIBTION = "subscription";

var db = null;

function debug(msg) {
    console.log("global: " + msg );
}

function trace(msg) {
    console.log("global: " + msg );
}

module.exports.settings = {
    "host" : "https://golos.io",
    "websocket": "wss://ws.golos.io",	
    "userid":"ropox",
    "telegram":{
        "token":"",
        "chatid":""},
    "postingKey":"5A6F7F..."    
};

function subscribed(post) {
  return new Promise(resolve => {
    db.find({ ob: SUBSCRIBTION, topic : post }, function(err, docs) {
        
        resolve(docs.length > 0);
    });
  });
}

module.exports.subscribe = async function(post){
  return new Promise(async (resolve) => {
    let check = await subscribed(post);
    if(!check) {
        console.log("save subscription to " + post);
        db.insert({ob : SUBSCRIBTION, topic: post}, function(err) {
            if(null != err) {
                throw err;
            }
            console.log("saved");
            resolve(true);
        });
    } else {
        trace("already subscribed to " + post );
    }
    resolve(true);
  });    
}

module.exports.subscribed = subscribed;


function init() {
    //Load setting Object
    try {
        let sets = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
        module.exports.settings = sets;       
    } catch(e) {
        console.log("unable to read config (" + CONFIG_FILE + ")");
        try {
            fs.writeFileSync(CONFIG_FILE, JSON.stringify(module.exports.settings, null, 4), "utf8");
        } catch(e) {
            console.log("unable to create dummy config (" + CONFIG_FILE + ")");
        }
    }
    db = new nedb({filename : GOLOSBOT_DB, autoload : true});
} 

init();
