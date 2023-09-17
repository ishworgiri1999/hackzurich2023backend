"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAffirmative = void 0;
// Returns true if the text parameter contains any of the strings defined in
// affirmativeKeywords. Returns false otherwise.
function isAffirmative(text) {
    var affirmativeKeywords = [
        'policy covers',
        'is covered',
        'yes',
    ];
    return affirmativeKeywords.some(function (word) { return text.trim().toLowerCase().indexOf(word) > -1; });
}
exports.isAffirmative = isAffirmative;
;
