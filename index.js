const BOT = process.argv[2];

var Crawler = require('./crawler');


function showUsage() {
    console.error("Unknown bot [" + BOT + "] (crawler, notifier, habreplicator)");
    process.exit(1);
}

new Crawler().start();
