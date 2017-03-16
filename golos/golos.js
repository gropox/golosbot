var steem = require("steem");
const golos_ws = "wss://ws.golos.io";
steem.api.setWebSocket(golos_ws);

module.exports = function Golos () {
    
    this.NAME = "golos";
    this.props = {};
    
    /** holt properties */
    this.retrieveDynGlobProps = async function() {
        try {
            this.props = await steem.api.getDynamicGlobalPropertiesAsync();
        } catch(e) {
            console.error(e);
        }        
    }
    /** time in miliseconds */
    this.getCurrentServerTime = function() {
        return Date.parse(props.time);
    }
    
    this.getBlock = async function(number) {
        try {
            var block = await steem.api.getBlockAsync(number);
            return block;
        } catch(e) {
            console.error(e);
        }        
    }
    
}
