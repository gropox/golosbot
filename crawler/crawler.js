var golos = require('../golos');
var pluginDispatcher = require("../plugins/dispatcher");

module.exports = function Crawler () {
    
    this.NAME = "crawler";
    this.lastRetrievedBlock = 0;
    
    this.start = async function() {
        let props = await golos.getProps();
        this.lastRetrievedBlock = props.head_block_number;
        this.lastRetrievedBlock = 4434060;
        console.log("starting loop");
        while(true) {
            try  {
                //console.log("last block = " + this.lastRetrievedBlock);
                var block = await golos.getBlock(this.lastRetrievedBlock);
                if(block != null) {
                    //console.log("got next block " + JSON.stringify(block));
                    var transactions = block.transactions;
                    //console.log("got block with transactions : " + JSON.stringify(transactions));
                    for(var i = 0; i < transactions.length; i++) {
                        let operations = transactions[i].operations;
                        for(var o = 0; o < operations.length; o++) {
                            let d = new Date();
                            handleOp(operations[o]);
                            d = new Date();
                        }
                    }
                    this.lastRetrievedBlock++;
                } else {
                    await sleep(3000);
                }
            } catch(e) {
                console.error("error ", e);
                await sleep(3000);
            }
        }
    }
}

async function handleOp(op) {
    let opType = op[0];
    let opBody = op[1];
    console.log("handle op : " + opType);
    //console.log("body op : " + JSON.stringify(opBody));
    pluginDispatcher.process(opType,opBody);
    
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
