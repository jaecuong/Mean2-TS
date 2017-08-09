"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var cluster = require("cluster");
var compression = require("compression");
var cookieParser = require("cookie-parser");
var express = require("express");
var http = require("http");
var morgan = require("morgan");
var os = require("os");
var path = require("path");
var index_1 = require("../configs/index");
var index_2 = require("./utils/index");
var routes_1 = require("./routes");
var mongoose = require("mongoose");
var dotenv = require("dotenv");
var options = {
    allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization'],
    credentials: true,
    methods: 'GET,POST',
    origin: '*',
    preflightContinue: false
};
var Server = (function () {
    function Server() {
        this._app = express();
        dotenv.load({ path: '.env' });
        this._app.use(compression());
        this._app.use('/', express.static(path.join(__dirname, '../public')));
        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({ extended: false }));
        this._app.use(cookieParser());
        this._app.use(express.static(index_1.configs.getServerConfig().publicPath));
        this._app.use(morgan('combined', { skip: index_2.skip, stream: index_2.stream }));
        this._app.use(function (error, req, res, next) {
            if (error) {
                index_2.logger.error("Request got error = " + error.message);
                res.status(400).send(error);
            }
        });
        this._app.get('/*', function (req, res) {
            res.sendFile(index_1.configs.getServerConfig().publicPathHtml);
        });
        this._server = http.createServer(this._app);
    }
    Server.prototype._onError = function (error) {
        if (error.syscall) {
            index_2.logger.error(error.syscall + " with message = " + error.message);
            throw error;
        }
        var port = process.env.PORT || 3000;
        var bind = "Port " + port;
        switch (error.code) {
            case 'EACCES':
                index_2.logger.error("[EACCES] " + bind + " requires elevated privileges.");
                process.exit(1);
                break;
            case 'EADDRINUSE':
                index_2.logger.error("[EADDRINUSE] " + bind + " is already in use.");
                process.exit(1);
                break;
            default:
                throw error;
        }
    };
    ;
    Server.prototype._onListening = function () {
        var address = this._server.address();
        var bind = "port " + address.port;
        index_2.logger.info("Server is Listening on " + bind + ".");
    };
    ;
    Server.prototype.start = function () {
        var _this = this;
        if (cluster.isMaster && process.env.NODE_ENV !== 'development') {
            mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
            var db = mongoose.connection;
            mongoose.Promise = global.Promise;
            db.on('error', function () {
                index_2.logger.error("Database connection error !!! ----> " + console);
                console.error.bind(console, 'connection error:');
            });
            db.once('open', function () {
                index_2.logger.info("Connected to MongoDB");
                routes_1.default(_this._app);
                index_2.logger.info("Cluster is running on CPU with " + os.cpus().length + " logical processors");
                for (var c = 0; c < os.cpus().length; c++) {
                    cluster.fork();
                }
                cluster.on('exit', function (worker, code, signal) {
                    index_2.logger.info("Worker " + worker.process.pid + " died.");
                });
                cluster.on('listening', function (worker, address) {
                    index_2.logger.info("Worker " + worker.process.pid + " connected to port " + address.port + ".");
                });
            });
        }
        else {
            this._server.listen(process.env.PORT || 3000);
            this._server.on('error', function (error) { return _this._onError(error); });
            this._server.on('listening', function () { return _this._onListening(); });
        }
    };
    Server.prototype.stop = function () {
        this._server.close();
        process.exit(0);
    };
    return Server;
}());
var server = new Server();
server.start();
process.on('SIGINT', function () {
    server.stop();
});
//# sourceMappingURL=app.js.map