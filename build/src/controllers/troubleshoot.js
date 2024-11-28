"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPorts = exports.checkServices = void 0;
const non_streamed_command_1 = require("../services/non-streamed-command");
const http_status_codes_1 = require("http-status-codes");
const checkServices = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, non_streamed_command_1.execute)('systemctl status apache2 | head -n 3', 'terminal');
    (0, non_streamed_command_1.execute)('systemctl status cron | head -n 3', 'terminal');
    (0, non_streamed_command_1.execute)('systemctl status redis', 'terminal');
    (0, non_streamed_command_1.execute)('systemctl status mysql', 'terminal');
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'Check Services done Successfully' });
});
exports.checkServices = checkServices;
const checkPorts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, non_streamed_command_1.execute)('netstat -lptun', 'terminal');
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'Check Ports Done Successfully' });
});
exports.checkPorts = checkPorts;
//# sourceMappingURL=troubleshoot.js.map