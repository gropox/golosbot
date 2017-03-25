console.log(__filename);

var log = require("./tools/logger").getLogger(__filename, 2);

log.trace("test trace");
log.debug("test debug");
log.info("test info");
log.warn("test warn");
log.error("test error");


