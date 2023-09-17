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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = require("express");
var fs_1 = __importDefault(require("fs"));
var multer_1 = __importDefault(require("multer"));
var keywordDetection_1 = require("./keywordDetection");
dotenv_1.default.config();
var DESTINATION = 'tmp';
var GOOGLE_CLOUD_AUTH_TOKEN = process.env.GOOGLE_CLOUD_AUTH_TOKEN;
var GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
if (!fs_1.default.existsSync(DESTINATION)) {
    fs_1.default.mkdirSync(DESTINATION);
}
var router = (0, express_1.Router)();
var upload = (0, multer_1.default)({ dest: DESTINATION });
// POST /image-handling
//
// Form Data:
//     image: An image which should be uploaded to the server. Required.
//
// Returns:
//     HTTP 200: Image uploaded and analysed successfully.
//         {
//             fireDamage: True if the image appears to show fire damage.
//                 Otherwise false.
//             glassDamage: True if the image appears to show glass damage.
//                 Otherwise false.
//             panelDamage: True if the image appears to show panel damage.
//                 Otherwise false.
//             vehicleDescription: A description of the make and model of car
//                 which appears to be in the image.
//         }
//     HTTP 400: Too few or two many images were uploaded.
//     HTTP 422: The AI tool could not detect a car in the uploaded image.
router.post('/', upload.array('image'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var file, fileName, filePath, image, encodedImage, prompts, aiRequests, aiResponses, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.files || req.files.length !== 1) {
                    return [2 /*return*/, res.sendStatus(400)];
                }
                file = req.files[0];
                fileName = "".concat(DESTINATION, "/").concat(file.filename);
                filePath = "".concat(fileName, ".").concat(file.mimetype.replace('image/', ''));
                fs_1.default.renameSync("".concat(fileName), filePath);
                image = fs_1.default.readFileSync(filePath);
                encodedImage = Buffer.from(image).toString('base64');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                prompts = [
                    'What does this picture contain?',
                    'What damage does this car have?',
                    'What model is this car?',
                ];
                aiRequests = prompts.map(function (prompt) { return axios_1.default.post("https://us-central1-aiplatform.googleapis.com/v1/projects/".concat(GOOGLE_CLOUD_PROJECT_ID, "/locations/us-central1/publishers/google/models/imagetext:predict"), {
                    instances: [
                        {
                            prompt: prompt,
                            image: {
                                bytesBase64Encoded: encodedImage,
                            },
                        },
                    ],
                    parameters: {
                        sampleCount: 3,
                    },
                }, {
                    headers: {
                        'Authorization': "Bearer ".concat(GOOGLE_CLOUD_AUTH_TOKEN),
                    },
                }); });
                return [4 /*yield*/, axios_1.default.all(aiRequests)];
            case 2:
                aiResponses = (_a.sent()).map(function (response) { return response.data; });
                fs_1.default.rmSync(filePath);
                console.log(aiResponses[1].predictions);
                if (aiResponses[0].predictions.indexOf('car') === -1) {
                    return [2 /*return*/, res.sendStatus(422)];
                }
                return [2 /*return*/, res.status(200).send({
                        fireDamage: (0, keywordDetection_1.hasFireDamageKeywords)(aiResponses[1].predictions),
                        glassDamage: (0, keywordDetection_1.hasGlassDamageKeywords)(aiResponses[1].predictions),
                        panelDamage: (0, keywordDetection_1.hasPanelDamageKeywords)(aiResponses[1].predictions),
                        vehicleDescription: aiResponses[2].predictions[0].toUpperCase(),
                    })];
            case 3:
                e_1 = _a.sent();
                console.error('Failed to Contact Google API. Has the token expired?');
                return [2 /*return*/, res.sendStatus(500)];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
