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
exports.changeNetworkSettings = void 0;
const network_settings_1 = require("../services/network-settings");
const logging_1 = require("../utils/logging");
const http_status_codes_1 = require("http-status-codes");
const changeNetworkSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        (0, network_settings_1.updateNetplanIP)(req.body.ip, req.body.mask, req.body.dns, req.body.gateway);
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: "server IP has been set successfully" });
    }
    catch (error) {
        logging_1.logger.log('error', 'error in updateNetplanIp() method', `Failed to update netplan configuration: ${error}`);
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: `coldn't change server ip, please try again, ${error}` });
    }
});
exports.changeNetworkSettings = changeNetworkSettings;
//# sourceMappingURL=network-settings.js.map