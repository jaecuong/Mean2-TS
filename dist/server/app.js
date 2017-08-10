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
var cors = require("cors");
var index_1 = require("../configs/index");
var index_2 = require("./utils/index");
var routes_1 = require("./routes");
var mongoose = require("mongoose");
var dotenv = require("dotenv");
var chalk = require('chalk');
var Server = (function () {
    function Server() {
        this._app = express();
        dotenv.load({ path: '.env' });
        this._app.use(compression());
        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({ extended: false }));
        this._app.use(cookieParser());
        this._app.use(express.static(index_1.configs.getServerConfig().publicPath));
        this._app.use(morgan('combined', { skip: index_2.skip, stream: index_2.stream }));
        this._app.options('*', cors());
        routes_1.setRoutes(this._app);
        this._app.get('/*', function (req, res) {
            res.sendFile(index_1.configs.getServerConfig().publicPathHtml);
        });
        this._app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
            res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Request-Headers', 'charset,content-type');
            next();
        });
        this._app.use(function (req, res, next) {
            var err = new Error('Not Found');
            err['status'] = 404;
            next(err);
        });
        if (process.env.NODE_ENV === 'development') {
            this._app.use(function (error, req, res, next) {
                index_2.logger.error("Request got error = " + error.message);
                res.status(error['status'] || 500);
                res.render('error', {
                    message: error.message,
                    error: error
                });
            });
        }
        else if (process.env.NODE_ENV === 'production') {
            this._app.use(function (error, req, res, next) {
                res.status(error['status'] || 500);
                res.render('error', {
                    message: error.message,
                    error: {}
                });
            });
        }
        if (process.env.NODE_ENV === 'development') {
            var connect = require('connect');
            var errorhandler = require('errorhandler');
            var notifier_1 = require('node-notifier');
            this._app.use(errorhandler({
                log: function (err, str, req) {
                    var title = 'Error in ' + req.method + ' ' + req.url;
                    notifier_1.notify({
                        title: title,
                        message: str
                    });
                }
            }));
        }
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
        var interfaces = require('os').networkInterfaces();
        var addresses = Object.keys(interfaces)
            .reduce(function (results, name) { return results.concat(interfaces[name]); }, [])
            .filter(function (iface) { return iface.family === 'IPv4' && !iface.internal; })
            .map(function (iface) { return iface.address; });
        console.log(chalk.green("Server is Listening on " + bind));
        console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
        console.log(chalk.green('Server Name:     ' + os.hostname()));
        console.log(chalk.green('Server IP        ' + addresses));
        console.log(chalk.green('Database:        ' + process.env.MONGODB_URI));
    };
    ;
    Server.prototype.start = function () {
        var _this = this;
        if (cluster.isMaster) {
            mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
            global.Promise = require('q').Promise;
            var db = mongoose.connection;
            mongoose.Promise = global.Promise;
            db.on('error', function () {
                index_2.logger.error("Database connection error !!! ----> " + console);
                console.log(chalk.red("Database connection error !!! ----> " + console));
                console.error.bind(console, 'connection error:');
            });
            db.once('open', function () {
                index_2.logger.info("Connected to MongoDB");
                var numberWorkers = os.cpus().length;
                index_2.logger.info("Master " + process.pid + " is running");
                index_2.logger.info("Cluster is running on CPU with " + numberWorkers + " logical processors");
                for (var c = 0; c < numberWorkers; c++) {
                    cluster.fork();
                }
                _this.workerEvents();
            });
        }
        else {
            this._server.listen(process.env.PORT || 3000, function () {
                index_2.logger.info('Process ' + process.pid + ' is listening to all incoming requests');
            });
            this._server.on('error', function (error) { return _this._onError(error); });
            this._server.on('listening', function () { return _this._onListening(); });
        }
    };
    Server.prototype.workerEvents = function () {
        cluster.on('online', function (worker) {
            index_2.logger.info("Worker " + worker.process.pid + " is online");
        });
        cluster.on('exit', function (worker, code, signal) {
            if (signal) {
                index_2.logger.error("Worker " + worker.process.pid + " was killed by signal: " + signal);
            }
            else if (code !== 0) {
                index_2.logger.error("Worker " + worker.process.pid + " exited with error code: " + code);
            }
            else {
                index_2.logger.info("Worker " + worker.process.pid + " success!");
            }
            index_2.logger.info("Starting a new worker");
            cluster.fork();
        });
        cluster.on('listening', function (worker, address) {
            index_2.logger.info("Worker " + worker.process.pid + " connected to port " + address.port + ".");
        });
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