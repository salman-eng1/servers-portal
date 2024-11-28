"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({});
// if (process.env.ENABLE_APM === '1') {
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   require('elastic-apm-node').start({
//     serviceName: 'jobber-gateway',
//     serverUrl: process.env.ELASTIC_APM_SERVER_URL,
//     secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
//     environment: process.env.NODE_ENV,
//     active: true,
//     captureBody: 'all',
//     errorOnAbortedRequests: true,
//     captureErrorLogStackTraces: 'always'
//   });
// }
class Config {
    constructor() {
        this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || '';
        this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || '';
        this.NODE_ENV = process.env.NODE_ENV || '';
        this.CLIENT_URL = process.env.CLIENT_URL || '';
    }
}
exports.config = new Config();
//# sourceMappingURL=config.js.map