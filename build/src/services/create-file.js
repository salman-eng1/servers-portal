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
exports.appendToFile = exports.createFile = void 0;
const promises_1 = require("fs/promises");
const fs_1 = require("fs");
const createFile = (configContent, filePath, mode) => __awaiter(void 0, void 0, void 0, function* () {
    (0, fs_1.writeFileSync)(filePath, configContent.trim(), { mode });
});
exports.createFile = createFile;
const appendToFile = (filePath, content) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Append content to the file with proper options
        yield (0, promises_1.appendFile)(filePath, `\n${content.trim()}`, { encoding: 'utf8' });
        console.log(`Content successfully appended to ${filePath}`);
    }
    catch (error) {
        console.error(`Error appending to file ${filePath}:`, error);
    }
});
exports.appendToFile = appendToFile;
//# sourceMappingURL=create-file.js.map