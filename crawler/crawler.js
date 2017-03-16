var Golos = require('../golos');
var golos = new Golos();

module.exports = function Crawler () {
    
    this.NAME = "crawler";
    this.lastRetrievedBlock = 0;
    
    this.start = async function() {
        await golos.retrieveDynGlobProps();
        console.log("current server time = " + golos.props.time);

        this.lastRetrievedBlock = golos.props.head_block_number;
     
        while(true) {
            //console.log("last block = " + this.lastRetrievedBlock);
            var block = await golos.getBlock(this.lastRetrievedBlock);
            if(block != null) {
                //console.log("got next block " + JSON.stringify(block));
                var transactions = block.transactions;
                //console.log("got block with transactions : " + JSON.stringify(transactions));
                for(var i = 0; i < transactions.length; i++) {
                    let operations = transactions[i].operations;
                    for(var o = 0; o < operations.length; o++) {
                        handleOp(operations[o]);
                    }
                }
                this.lastRetrievedBlock++;
            } else {
                await sleep(3000);
            }
        }
    }
}

function handleOp(op) {
    let opType = op[0];
    let opBody = op[1];
    console.log("handle op : " + opType);
    console.log("body op : " + JSON.stringify(opBody));
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
