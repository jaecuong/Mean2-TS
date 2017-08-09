"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("express-jwt");
var moment = require("moment");
var bcrypt = require("bcryptjs");
var index_1 = require("../../configs/index");
exports.encodeToken = function (profileIdParam, emailParam) {
    var payload = {
        exp: moment().add(14, 'days').unix(),
        iat: moment().unix(),
        sub: profileIdParam,
        email: emailParam,
        iss: index_1.configs.getServerConfig().session.issuer
    };
    return jwt.encode(payload, index_1.configs.getServerConfig().session.secret);
};
exports.decodeToken = function (token, callback) {
    var payload = jwt.decode(token, index_1.configs.getServerConfig().session.secret);
    var now = moment().unix();
    if (now > payload.exp) {
        callback('Token has expired.');
    }
    else {
        callback(null, payload);
    }
};
exports.encrypt = function (passwdParam) {
    var salt = _this.makeSalt();
    return bcrypt.hashSync(passwdParam, salt);
};
exports.makeSalt = function () {
    return bcrypt.genSaltSync();
};
exports.validatePassword = function (passwdParam, dbPasswd) {
    var bool = bcrypt.compareSync(passwdParam, dbPasswd);
    if (!bool) {
        throw new Error('Password do not match !!! ');
    }
    else {
        return true;
    }
};
exports.comparePassword = function (passwdParam, dbPasswd, callback) {
    _this.validatePassword(passwdParam, dbPasswd, function (err, isMatch) {
        if (err) {
            return callback(err);
        }
        else {
            callback(null, isMatch);
        }
    });
};
//# sourceMappingURL=jwtHelper.js.map