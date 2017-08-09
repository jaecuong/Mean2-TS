"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var database_config_1 = require("./database-config");
var logging_config_1 = require("./logging-config");
var server_config_1 = require("./server-config");
var statusCode_config_1 = require("./statusCode-config");
var Configs = (function () {
    function Configs() {
        this._databaseConfig = database_config_1.databaseConfig;
        this._loggingConfig = logging_config_1.loggingConfig;
        this._serverConfig = server_config_1.serverConfig;
        this._statusCodeConfig = statusCode_config_1.statusCodeConfig;
    }
    Configs.prototype.getDatabaseConfig = function () {
        return this._databaseConfig;
    };
    Configs.prototype.getLoggingConfig = function () {
        return this._loggingConfig;
    };
    Configs.prototype.getServerConfig = function () {
        return this._serverConfig;
    };
    Configs.prototype.getStatusCodeoConfig = function () {
        return this._statusCodeConfig;
    };
    return Configs;
}());
exports.configs = new Configs();
//# sourceMappingURL=index.js.map