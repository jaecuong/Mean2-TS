"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var index_1 = require("./utils/index");
var cat_1 = require("./controllers/cat");
var user_1 = require("./controllers/user");
var routes = express_1.Router();
exports.setRoutes = function (app) {
    index_1.logger.info("Route setup is starting !!!");
    var catCtrl = new cat_1.default();
    var userCtrl = new user_1.default();
    app.use('/api', routes);
    routes.post('/login', userCtrl.login);
    routes.get('/users', userCtrl.getAll);
    routes.get('/users/count', userCtrl.count);
    routes.post('/user', userCtrl.insert);
    routes.get('/user/:id', userCtrl.get);
    routes.put('/user/:id', userCtrl.update);
    routes.delete('/user/:id', userCtrl.delete);
};
//# sourceMappingURL=routes.js.map