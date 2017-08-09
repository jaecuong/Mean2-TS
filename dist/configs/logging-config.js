"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
exports.loggingConfig = {
    file: {
        level: "error",
        filename: "LinkReview.log",
        handleExceptions: true,
        json: true,
        maxsize: 5242880,
        maxFiles: 100,
        colorize: false
    },
    console: {
        level: "verbose",
        handleExceptions: true,
        json: false,
        colorize: true,
        timestamp: moment().format('YYYY-MM-DD hh:mm:ss:SSS')
    },
    directory: __dirname
};
//# sourceMappingURL=logging-config.js.map