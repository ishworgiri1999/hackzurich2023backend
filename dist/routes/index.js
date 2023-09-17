"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var image_handling_1 = __importDefault(require("./image-handling"));
var nearby_services_1 = __importDefault(require("./nearby-services"));
var policy_parsing_1 = __importDefault(require("./policy-parsing"));
var router = (0, express_1.Router)();
router.use('/image-handling', image_handling_1.default);
router.use('/nearby-services', nearby_services_1.default);
router.use('/policy-parsing', policy_parsing_1.default);
exports.default = router;
