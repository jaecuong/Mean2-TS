"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
exports.serverConfig = {
    port: 3000,
    session: {
        issuer: "Pham Nguyen Phi",
        secret: "linkreview-secret-string",
        name: "linkreview-secret-session",
        resave: true,
        saveUninitialized: true,
        proxy: false
    },
    apiUrl: "http://localhost:3000/api/",
    publicPathHtml: path.join(__dirname, '../public/index.html'),
    publicPath: path.join(__dirname, '../public')
};
//# sourceMappingURL=server-config.js.map