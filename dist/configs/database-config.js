"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = {
    username: 'sa',
    password: '123',
    database: 'LinkReview',
    host: '192.168.1.40',
    port: 1433,
    dialect: 'mssql',
    logging: true,
    force: true,
    timezone: '+00:00',
    maxConcurrentQueries: 100,
    pool: {
        max: 5000,
        min: 0,
        idle: 10000
    }
};
//# sourceMappingURL=database-config.js.map