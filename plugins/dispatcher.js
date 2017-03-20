var notifier = require("./notifier");



module.exports.process = async function(op, opBody) {
    if(notifier.accept(op)) {
        await notifier.process(op, opBody);
    }
}
