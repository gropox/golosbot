var golos = require('../golos');
var global = require('../tools/global');
var pluginDispatcher = require("../plugins/dispatcher");

module.exports = function Crawler () {
    
    this.NAME = "crawler";
    this.lastRetrievedBlock = 0;
    
    this.start = async function() {
        
        // Инициализация стартого блока и стартового id истории аккаунта
        // для этого из глобальных переменных вытаскиваем номер последнего блока
        // а из истории аккаунта вытаскиваем последний ID
        
        let props = await golos.getProps();
        let userHistory = await golos.getAccountHistory(global.settings.userid, -1, 0);
        let lastHistId = userHistory[0][0];
        lastHistId = 2438; // для отладки 
        //console.log("got account history " + JSON.stringify(userHistory));
        console.log("Last History Id = " + lastHistId),
        this.lastRetrievedBlock = props.head_block_number;
        this.lastRetrievedBlock = 4415505; // для отладки
        console.log("starting loop");
        
        // бесконечный цикл
        //   берем следующий блок и обрабьатываем операции из него
        //   берем следующую запись из истории аккаунта и обрабатваем единственную операцию
        while(true) {
            try  {
                //console.log("last block = " + this.lastRetrievedBlock);
                var block = await golos.getBlock(this.lastRetrievedBlock);
                if(block != null) {
                    processBlock(block);
                    this.lastRetrievedBlock++;
                }
                
                // некоторые операции, типа *_reward не доступны почему то в блоках
                // поэтому вытаскиваем их из истории аккаунта
                let nextId = lastHistId + 1;
                //console.log("nextId = " + nextId);
                userHistory = await golos.getAccountHistory(global.settings.userid, nextId, 0);
                //console.log("got userHistory = " + JSON.stringify(userHistory));
                let currentHistoryId = userHistory[0][0];
                if(currentHistoryId == nextId) {
                    processUserHistoryEntry(userHistory[0][1].op);
                    lastHistId = currentHistoryId;
                }
                
                //если нет нового блока и в истории ничего новго нет, заснем на пару секунд, что бы не грузить
                if(block === null && nextId > currentHistoryId) {
                    await sleep(3000);
                }
            } catch(e) {
                console.error("error ", e);
                await sleep(3000);
            }
        }
    }
}

async function processBlock(block) {
    //console.log("got next block " + JSON.stringify(block));
    var transactions = block.transactions;
    //console.log("got block with transactions : " + JSON.stringify(transactions));
    let doBlock = true;
    for(var i = 0; i < transactions.length; i++) {
        if(doBlock) {
            doBlock = false;
            console.log("process block " + this.lastRetrievedBlock);
        }
        let operations = transactions[i].operations;
        for(var o = 0; o < operations.length; o++) {
            let d = new Date();
            handleOp(operations[o]);
            d = new Date();
        }
    }
}

async function processUserHistoryEntry(op) {

    let opType = op[0];
    console.log("process history entry " + opType );   
    switch(opType) {
        //эти операции можно получить только из истории аккаунта
        case "curation_reward" :
        case "author_reward" :
            handleOp(op);
            break;
        default:
           // остальные операции из цепочки блоков 
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
