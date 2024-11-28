"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importStar(require("winston"));
require("winston-daily-rotate-file");
const { combine, timestamp, printf } = winston_1.format;
// Define a custom format with timestamp
const customFormat = printf((_a) => {
    var { level, message, timestamp } = _a, rest = __rest(_a, ["level", "message", "timestamp"]);
    return `${timestamp} ${level}: ${message} ${JSON.stringify(rest)}`;
});
// Define daily rotate file transport for info level logs
const infoRotateFileTransport = new winston_1.default.transports.DailyRotateFile({
    filename: 'combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'info',
    dirname: './logs',
    maxSize: '20m',
    maxFiles: '2d', // Keep logs for 14 days
});
// Define daily rotate file transport for error level logs
const errorRotateFileTransport = new winston_1.default.transports.DailyRotateFile({
    filename: 'errors-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    dirname: './logs',
    maxSize: '20m',
    maxFiles: '2d', // Keep logs for 14 days
});
exports.logger = winston_1.default.createLogger({
    format: combine(timestamp(), customFormat, winston_1.default.format.colorize({ level: true })),
    transports: [
        infoRotateFileTransport,
        errorRotateFileTransport
    ]
});
// If we're not in production then log to the `console` with the format:
if (process.env.NODE_ENV !== 'production') {
    exports.logger.add(new winston_1.default.transports.Console({
        format: combine(timestamp(), customFormat),
    }));
}
//# sourceMappingURL=logging.js.map