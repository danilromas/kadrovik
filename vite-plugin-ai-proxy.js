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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { loadEnv } from 'vite';
var GEMINI_MODELS = ['gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-flash-8b'];
function fallbackReply(userText, systemPrompt, hint) {
    var prefix = hint ? "".concat(hint, "\n\n---\n\n") : '';
    var t = userText.toLowerCase();
    if (t.includes('резюме') || t.includes('cv')) {
        return "".concat(prefix, "**\u0420\u0435\u0437\u044E\u043C\u0435 (\u041A\u0440\u044B\u043C):**\n- \u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u0433\u043E\u0440\u043E\u0434: \u0421\u0438\u043C\u0444\u0435\u0440\u043E\u043F\u043E\u043B\u044C, \u0421\u0435\u0432\u0430\u0441\u0442\u043E\u043F\u043E\u043B\u044C, \u042F\u043B\u0442\u0430 \u0438 \u0442.\u0434.\n- \u0412 \u00AB\u041E \u0441\u0435\u0431\u0435\u00BB \u2014 3\u20135 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0439 \u0441 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430\u043C\u0438.\n- \u041D\u0430\u0432\u044B\u043A\u0438 \u2014 \u0442\u043E\u043B\u044C\u043A\u043E \u0440\u0435\u043B\u0435\u0432\u0430\u043D\u0442\u043D\u044B\u0435 \u0432\u0430\u043A\u0430\u043D\u0441\u0438\u0438.");
    }
    if (t.includes('ваканс') || t.includes('описан') || t.includes('должност')) {
        return "".concat(prefix, "**\u0422\u0435\u043A\u0441\u0442 \u0432\u0430\u043A\u0430\u043D\u0441\u0438\u0438:**\n1. \u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u2014 \u0434\u043E\u043B\u0436\u043D\u043E\u0441\u0442\u044C + \u0433\u043E\u0440\u043E\u0434.\n2. \u041E\u0431\u044F\u0437\u0430\u043D\u043D\u043E\u0441\u0442\u0438 \u2014 5\u20137 \u043F\u0443\u043D\u043A\u0442\u043E\u0432.\n3. \u0422\u0440\u0435\u0431\u043E\u0432\u0430\u043D\u0438\u044F \u0438 \u0443\u0441\u043B\u043E\u0432\u0438\u044F (\u0437\u0430\u0440\u043F\u043B\u0430\u0442\u0430, \u0433\u0440\u0430\u0444\u0438\u043A).\n\n\u041F\u0440\u0438\u043C\u0435\u0440: \u00AB\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440, \u042F\u043B\u0442\u0430, \u043E\u0442 80 000 \u20BD\u00BB.");
    }
    if (t.includes('собесед') || t.includes('интервью')) {
        return "".concat(prefix, "**\u0421\u043E\u0431\u0435\u0441\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u0435:** \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u044C\u0442\u0435 \u0432\u043E\u043F\u0440\u043E\u0441\u044B \u043E \u0437\u0430\u0434\u0430\u0447\u0430\u0445, \u0443\u0442\u043E\u0447\u043D\u0438\u0442\u0435 \u0433\u0440\u0430\u0444\u0438\u043A \u0438 \u0438\u0441\u043F\u044B\u0442\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0441\u0440\u043E\u043A. \u0412 \u041A\u0440\u044B\u043C\u0443 \u0447\u0430\u0441\u0442\u043E \u0432\u0430\u0436\u043D\u0430 \u0441\u0435\u0437\u043E\u043D\u043D\u043E\u0441\u0442\u044C \u2014 \u0441\u043F\u0440\u043E\u0441\u0438\u0442\u0435 \u043E\u0431 \u044D\u0442\u043E\u043C.");
    }
    if (t.includes('симферополь') || t.includes('севастополь') || t.includes('ялт') || t.includes('крым')) {
        return "".concat(prefix, "\u041D\u0430 **\u041A\u0410\u0414\u0420\u041E\u0412\u0418\u041A** \u0432\u0430\u043A\u0430\u043D\u0441\u0438\u0438 \u043F\u043E \u0432\u0441\u0435\u043C\u0443 \u041A\u0440\u044B\u043C\u0443. \u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0440\u0430\u0437\u0434\u0435\u043B \u00AB\u0412\u0430\u043A\u0430\u043D\u0441\u0438\u0438\u00BB \u0438 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0433\u043E\u0440\u043E\u0434 \u0432 \u0444\u0438\u043B\u044C\u0442\u0440\u0435.");
    }
    if (systemPrompt.includes('работодатель')) {
        return "".concat(prefix, "\u041E\u043F\u0438\u0448\u0438\u0442\u0435 \u0434\u043E\u043B\u0436\u043D\u043E\u0441\u0442\u044C, \u0433\u043E\u0440\u043E\u0434 \u0438 \u0437\u0430\u0440\u043F\u043B\u0430\u0442\u0443 \u2014 \u043F\u043E\u0434\u0441\u043A\u0430\u0436\u0443 \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0443 \u0432\u0430\u043A\u0430\u043D\u0441\u0438\u0438 \u0438 \u0432\u043E\u043F\u0440\u043E\u0441\u044B \u043A\u0430\u043D\u0434\u0438\u0434\u0430\u0442\u0430\u043C.");
    }
    return "".concat(prefix, "\u042F \u043F\u043E\u043C\u043E\u0449\u043D\u0438\u043A **\u041A\u0410\u0414\u0420\u041E\u0412\u0418\u041A** (\u0440\u0430\u0431\u043E\u0442\u0430 \u0432 \u041A\u0440\u044B\u043C\u0443). \u0421\u043F\u0440\u043E\u0441\u0438\u0442\u0435 \u043F\u0440\u043E \u0432\u0430\u043A\u0430\u043D\u0441\u0438\u0438, \u0440\u0435\u0437\u044E\u043C\u0435 \u0438\u043B\u0438 \u0441\u043E\u0431\u0435\u0441\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u0435 \u2014 \u043E\u0442\u0432\u0435\u0447\u0443 \u043F\u043E \u0434\u0435\u043B\u0443.");
}
function callGemini(apiKey, systemPrompt, messages) {
    return __awaiter(this, void 0, void 0, function () {
        var contents, lastError, _i, GEMINI_MODELS_1, model, res, data, text, errText;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    contents = messages.map(function (m) { return ({
                        role: m.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: m.content }],
                    }); });
                    lastError = 'Gemini недоступен';
                    _i = 0, GEMINI_MODELS_1 = GEMINI_MODELS;
                    _f.label = 1;
                case 1:
                    if (!(_i < GEMINI_MODELS_1.length)) return [3 /*break*/, 7];
                    model = GEMINI_MODELS_1[_i];
                    return [4 /*yield*/, fetch("https://generativelanguage.googleapis.com/v1beta/models/".concat(model, ":generateContent?key=").concat(apiKey), {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                systemInstruction: { parts: [{ text: systemPrompt }] },
                                contents: contents,
                                generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
                            }),
                        })];
                case 2:
                    res = _f.sent();
                    if (!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = (_f.sent());
                    text = (_e = (_d = (_c = (_b = (_a = data.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text;
                    if (text)
                        return [2 /*return*/, text];
                    _f.label = 4;
                case 4: return [4 /*yield*/, res.text()];
                case 5:
                    errText = _f.sent();
                    lastError = "".concat(model, ": ").concat(res.status, " ").concat(errText.slice(0, 180));
                    if (res.status !== 429 && res.status !== 404)
                        return [3 /*break*/, 7];
                    _f.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: throw new Error(lastError);
            }
        });
    });
}
function callGroq(apiKey, systemPrompt, messages) {
    return __awaiter(this, void 0, void 0, function () {
        var res, errText, data, text;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, fetch('https://api.groq.com/openai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: "Bearer ".concat(apiKey),
                        },
                        body: JSON.stringify({
                            model: 'llama-3.1-8b-instant',
                            messages: __spreadArray([
                                { role: 'system', content: systemPrompt }
                            ], messages.map(function (m) { return ({ role: m.role, content: m.content }); }), true),
                            max_tokens: 1024,
                            temperature: 0.7,
                        }),
                    })];
                case 1:
                    res = _d.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.text()];
                case 2:
                    errText = _d.sent();
                    throw new Error("Groq: ".concat(res.status, " ").concat(errText.slice(0, 200)));
                case 3: return [4 /*yield*/, res.json()];
                case 4:
                    data = (_d.sent());
                    text = (_c = (_b = (_a = data.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
                    if (!text)
                        throw new Error('Пустой ответ Groq');
                    return [2 /*return*/, text];
            }
        });
    });
}
function quotaHint(hasGemini, hasGroq) {
    if (hasGemini && !hasGroq) {
        return '⚠️ **Лимит Google Gemini исчерпан.** Сейчас ответ из встроенной базы знаний. Подождите до завтра или добавьте бесплатный ключ `GROQ_API_KEY` в `.env` (console.groq.com).';
    }
    if (hasGemini || hasGroq) {
        return '⚠️ **Внешний ИИ временно недоступен.** Ниже — ответ встроенного помощника.';
    }
    return 'ℹ️ **Демо-режим.** Добавьте `GEMINI_API_KEY` или `GROQ_API_KEY` в `.env` для умных ответов.';
}
function createAiMiddleware(geminiKey, groqKey) {
    var _this = this;
    return function (req, res, next) {
        var _a;
        if (req.method !== 'POST' || !((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith('/api/ai/chat'))) {
            next();
            return;
        }
        var chunks = [];
        req.on('data', function (chunk) { return chunks.push(chunk); });
        req.on('end', function () {
            void (function () { return __awaiter(_this, void 0, void 0, function () {
                var body, parsed, messages, systemPrompt, lastUser, content, source, warning, tryGemini, tryGroq, e_1, _a, e_2, e_3;
                var _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _e.trys.push([0, 18, , 19]);
                            body = Buffer.concat(chunks).toString('utf8');
                            parsed = JSON.parse(body);
                            messages = (_b = parsed.messages) !== null && _b !== void 0 ? _b : [];
                            systemPrompt = (_c = parsed.systemPrompt) !== null && _c !== void 0 ? _c : '';
                            lastUser = __spreadArray([], messages, true).reverse().find(function (m) { return m.role === 'user'; });
                            if (!((_d = lastUser === null || lastUser === void 0 ? void 0 : lastUser.content) === null || _d === void 0 ? void 0 : _d.trim())) {
                                res.statusCode = 400;
                                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                                res.end(JSON.stringify({ error: 'Нет сообщения пользователя' }));
                                return [2 /*return*/];
                            }
                            content = void 0;
                            source = 'fallback';
                            warning = void 0;
                            tryGemini = Boolean(geminiKey === null || geminiKey === void 0 ? void 0 : geminiKey.trim());
                            tryGroq = Boolean(groqKey === null || groqKey === void 0 ? void 0 : groqKey.trim());
                            if (!tryGemini) return [3 /*break*/, 11];
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 3, , 10]);
                            return [4 /*yield*/, callGemini(geminiKey.trim(), systemPrompt, messages)];
                        case 2:
                            content = _e.sent();
                            source = 'gemini';
                            return [3 /*break*/, 10];
                        case 3:
                            e_1 = _e.sent();
                            warning = quotaHint(true, tryGroq);
                            if (!tryGroq) return [3 /*break*/, 8];
                            _e.label = 4;
                        case 4:
                            _e.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, callGroq(groqKey.trim(), systemPrompt, messages)];
                        case 5:
                            content = _e.sent();
                            source = 'groq';
                            warning = undefined;
                            return [3 /*break*/, 7];
                        case 6:
                            _a = _e.sent();
                            content = fallbackReply(lastUser.content, systemPrompt, warning);
                            return [3 /*break*/, 7];
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            content = fallbackReply(lastUser.content, systemPrompt, warning);
                            _e.label = 9;
                        case 9:
                            console.warn('[ai-proxy] Gemini failed:', e_1 instanceof Error ? e_1.message : e_1);
                            return [3 /*break*/, 10];
                        case 10: return [3 /*break*/, 17];
                        case 11:
                            if (!tryGroq) return [3 /*break*/, 16];
                            _e.label = 12;
                        case 12:
                            _e.trys.push([12, 14, , 15]);
                            return [4 /*yield*/, callGroq(groqKey.trim(), systemPrompt, messages)];
                        case 13:
                            content = _e.sent();
                            source = 'groq';
                            return [3 /*break*/, 15];
                        case 14:
                            e_2 = _e.sent();
                            warning = quotaHint(false, true);
                            content = fallbackReply(lastUser.content, systemPrompt, warning);
                            console.warn('[ai-proxy] Groq failed:', e_2 instanceof Error ? e_2.message : e_2);
                            return [3 /*break*/, 15];
                        case 15: return [3 /*break*/, 17];
                        case 16:
                            warning = quotaHint(false, false);
                            content = fallbackReply(lastUser.content, systemPrompt, warning);
                            _e.label = 17;
                        case 17:
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json; charset=utf-8');
                            res.end(JSON.stringify({ content: content, source: source, warning: warning }));
                            return [3 /*break*/, 19];
                        case 18:
                            e_3 = _e.sent();
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'application/json; charset=utf-8');
                            res.end(JSON.stringify({
                                error: e_3 instanceof Error ? e_3.message : 'Ошибка сервера',
                            }));
                            return [3 /*break*/, 19];
                        case 19: return [2 /*return*/];
                    }
                });
            }); })();
        });
    };
}
export function aiProxyPlugin() {
    return {
        name: 'kadrovik-ai-proxy',
        configureServer: function (server) {
            var env = loadEnv(server.config.mode, server.config.root, '');
            server.middlewares.use(createAiMiddleware(env.GEMINI_API_KEY, env.GROQ_API_KEY));
        },
        configurePreviewServer: function (server) {
            var _a;
            var env = loadEnv((_a = server.config.mode) !== null && _a !== void 0 ? _a : 'production', server.config.root, '');
            server.middlewares.use(createAiMiddleware(env.GEMINI_API_KEY, env.GROQ_API_KEY));
        },
    };
}
