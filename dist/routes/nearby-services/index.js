"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var servicesList_json_1 = __importDefault(require("./servicesList.json"));
var router = (0, express_1.Router)();
// GET /nearby-services
//
// Query Arguments:
//     lat: the latitude part of coordinates that the system should search near
//         to. Required.
//     lng: the longitude part of coordinates that the system should search
//         near to. Required.
//     num: the number of services which should be returned. Defaults to 3.
//
// Returns:
//     HTTP 200: Services found and returned successfully.
//         {
//             name: The name of the service.
//             type: The type of the service (always `taxi`, `workshop` or
//                 `recovery`).
//             location.lat: The latitude part of coordinates of the service.
//             location.lng: The longitude part of coordinates of the service.
//         }[]
//     HTTP 400: One or more required query parameters were missing.
router.get('/', function (req, res) {
    var _a;
    var lat = Number(req.query.lat);
    var lng = Number(req.query.lng);
    var num = Number((_a = req.query.num) !== null && _a !== void 0 ? _a : 3);
    if (!lat || !lng) {
        return res.sendStatus(400);
    }
    // NOTE: In a production environment, the code would search for real services
    // which could help someone who has been involved in an accident. These may
    // include taxi services, car rental companies, etc. This has been omitted
    // here because we do not have a dataset with these services. Instead, we
    // choose from a pre-defined list.
    var selectedServices = servicesList_json_1.default.sort(function () { return 0.5 - Math.random(); }).slice(0, num);
    return res.status(200).send(selectedServices);
});
exports.default = router;
