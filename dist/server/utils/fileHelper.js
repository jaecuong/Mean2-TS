"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
function flatten(lists) {
    return lists.reduce(function (a, b) {
        return a.concat(b);
    }, []);
}
function getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
        .map(function (file) { return path.join(srcpath, file); })
        .filter(function (path) { return fs.statSync(path).isDirectory(); });
}
exports.getDirRecursive = function (srcpath) {
    return [srcpath].concat(flatten(getDirectories(srcpath).map(exports.getDirRecursive)));
};
//# sourceMappingURL=fileHelper.js.map