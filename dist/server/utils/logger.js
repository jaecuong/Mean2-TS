"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cluster = require("cluster");
var mkdirp = require("mkdirp");
var path = require("path");
var index_1 = require("../../configs/index");
var winston_1 = require("winston");
var config = index_1.configs.getLoggingConfig();
config.file.filename = path.join(config.directory, '../logs') + "/" + config.file.filename;
if (cluster.isMaster) {
    mkdirp.sync(path.join(config.directory, '../logs'));
}
exports.logging = new winston_1.Logger({
    transports: [
        new winston_1.transports.File(config.file),
        new winston_1.transports.Console(config.console)
    ],
    exitOnError: false
});
exports.skipping = function (req, res) {
    return res.statusCode >= 200;
};
exports.streaming = {
    write: function (message, encoding) {
        exports.logging.info(message);
    }
};
//# sourceMappingURL=logger.js.map