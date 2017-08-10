"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageNotFound = function (req, res) {
    var viewFilePath = '404';
    var statusCode = 404;
    var result = {
        status: statusCode
    };
    res.status(result.status);
    res.render(viewFilePath, function (err) {
        if (err) {
            return res.json(result, result.status);
        }
        res.render(viewFilePath);
    });
};
//# sourceMappingURL=errors.js.map