const BOT = process.argv[2];

var Crawler = require('./crawler');
var global = require("./tools/global");

function showUsage() {
    
    console.error("Unknown bot [" + BOT + "] (crawler, notifier, habreplicator)");
    process.exit(1);
}

new Crawler().start();
