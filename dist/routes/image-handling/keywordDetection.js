"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPanelDamageKeywords = exports.hasGlassDamageKeywords = exports.hasFireDamageKeywords = void 0;
// Returns true if the predictions parameter contains any of the strings
// defined in fireDamageKeywords. Returns false otherwise.
function hasFireDamageKeywords(predictions) {
    var fireDamageKeywords = [
        'fire',
        'burned',
        'fire damage',
    ];
    return predictions.some(function (prediction) { return fireDamageKeywords.indexOf(prediction) > -1; });
}
exports.hasFireDamageKeywords = hasFireDamageKeywords;
// Returns true if the predictions parameter contains any of the strings
// defined in glassDamageKeywords. Returns false otherwise.
function hasGlassDamageKeywords(predictions) {
    var glassDamageKeywords = [
        'broken window',
        'broken glass',
        'broken windows',
    ];
    return predictions.some(function (prediction) { return glassDamageKeywords.indexOf(prediction) > -1; });
}
exports.hasGlassDamageKeywords = hasGlassDamageKeywords;
// Returns true if the predictions parameter contains any of the strings
// defined in panelDamageKeywords. Returns false otherwise.
function hasPanelDamageKeywords(predictions) {
    var panelDamageKeywords = [
        'smashed',
        'broken',
        'scratches',
    ];
    return predictions.some(function (prediction) { return panelDamageKeywords.indexOf(prediction) > -1; });
}
exports.hasPanelDamageKeywords = hasPanelDamageKeywords;
