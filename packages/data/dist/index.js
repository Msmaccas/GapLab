"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRawGapInputs = loadRawGapInputs;
exports.loadRawGapInputsSync = loadRawGapInputsSync;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
/**
 * Loads the raw gap inputs from the fixtures directory.  This function reads a
 * JSON file containing an array of objects and returns them typed as GapInput.
 */
async function loadRawGapInputs() {
    const filePath = path_1.default.resolve(__dirname, '../../../fixtures/raw/gaps.json');
    const content = await promises_1.default.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    return parsed;
}
/**
 * Synchronous version of loadRawGapInputs.  Useful for CLI scripts where
 * asynchronous operations are not desirable.
 */
function loadRawGapInputsSync() {
    const filePath = path_1.default.resolve(__dirname, '../../../fixtures/raw/gaps.json');
    const content = require('fs').readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
}
//# sourceMappingURL=index.js.map