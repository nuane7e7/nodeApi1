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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var google_translate_api_1 = require("google-translate-api");
var fs_1 = require("fs");
var extractFles = /** @class */ (function () {
    function extractFles(langs, fsName, reg) {
        this.langs = ["en"];
        this.langs = langs;
        this.fsName = fsName;
        this.reg = reg;
    }
    extractFles.prototype.readFile = function () {
        var _this = this;
        if (!this.langs || !this.fsName || !this.reg) {
            console.log("\u8BF7\u4F20\u5165\u6B63\u786E\u7684\u53C2\u6570");
            return;
        }
        try {
            /**????????????????????? */
            var data_1 = fs_1["default"].readFileSync(this.fsName, 'utf8').match(this.reg).map(function (item) { return item.slice(4, -2); });
            var str_1 = data_1.join(",");
            langs.forEach(function (lang) {
                _this.getTranslate(lang, str_1).then(function (res) {
                    _this.writeFs(lang, _this.getJSON(res.text.split(","), data_1));
                });
            });
        }
        catch (err) {
            console.error(err);
        }
    };
    extractFles.prototype.getJSON = function (data, arr) {
        var obj = {};
        data.forEach(function (item, i) {
            obj[arr[i]] = item;
        });
        return obj;
    };
    extractFles.prototype.writeFs = function (lang, content) {
        fs_1["default"].writeFile("./lang/" + lang + ".js", "let " + lang + " = " + JSON.stringify(content) + ";", function (err) {
            if (err) {
                console.error(err);
                return;
            }
            //?????????????????????
        });
    };
    extractFles.prototype.getTranslate = function (lang, text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, google_translate_api_1(text, {
                            to: lang
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return extractFles;
}());
/***???????????? */
var langs = ["en", "th", "hi", "vi"];
/**????????????????????? */
var reg = /__\('(\S*)'\)/g;
/**?????????????????? */
var fsName = "./index.vue";
var funFile = new extractFles(langs, fsName, reg);
funFile.readFile();
