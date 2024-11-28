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
exports.fixPermissions = exports.fixSymlinks = exports.clearCache = exports.migrateFresh = void 0;
const non_streamed_command_1 = require("../services/non-streamed-command");
const migrateFresh = (systemName) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, non_streamed_command_1.execute)(`bash /home/zeuor/scripts/migrate.sh ${systemName}`, 'terminal');
    return `${systemName} database has been migrated`;
});
exports.migrateFresh = migrateFresh;
const clearCache = (systemName) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, non_streamed_command_1.execute)(`bash /home/zeuor/scripts/clearcache.sh ${systemName}`, 'terminal');
    return `${systemName} cache has been cleared`;
});
exports.clearCache = clearCache;
const fixSymlinks = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, non_streamed_command_1.execute)(`bash /home/zeuor/scripts/symlinks.sh`, 'terminal');
    return `All symlinks have been fixed correctly`;
});
exports.fixSymlinks = fixSymlinks;
const fixPermissions = (systemName) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, non_streamed_command_1.execute)(`bash /home/zeuor/scripts/fix_permissions.sh ${systemName}`, 'terminal');
    return `All permissions have been granted correctly`;
});
exports.fixPermissions = fixPermissions;
//# sourceMappingURL=configuration.js.map