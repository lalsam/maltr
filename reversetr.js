/*
* Copyright (c) 2019 - Lal Samuel Varghese (lalsam@gmail.com)
*/

function malayalamToManglish() {
    var m = document.getElementById("malayalam");
    var malayalam = m.value;
    var manglish = revtrans(malayalam);
    var n = document.getElementById("manglish");
    n.value = manglish;
}

function revtrans(malayalam) {
var maxseqlen = 3;

let mixMap = new Map([
    ["\u0d4d", ""],
    ["\u200c", "x"],
    ["\u200d", ""]
]);

let independentVowelMap = new Map([
    ["\u0d05", "a"],
    ["\u0d06", "aa"],
    ["\u0d07", "i"],
    ["\u0d08", "ee"],
    ["\u0d09", "u"],
    ["\u0d0a", "oo"],
    ["\u0d0b", "ruu"],
    ["\u0d60", "rua"],
    ["\u0d0c", "luu"],
    ["\u0d61", "lua"],
    ["\u0d0e", "e"],
    ["\u0d0f", "ea"],
    ["\u0d10", "ai"],
    ["\u0d12", "o"],
    ["\u0d13", "oa"],
    ["\u0d14", "au"]
]);

let dependentVowelMap = new Map([
    ["\u0d3e", "aa"],
    ["\u0d3f", "i"],
    ["\u0d40", "ee"],
    ["\u0d41", "u"],
    ["\u0d42", "oo"],
    ["\u0d43", "ruu"],
    ["\u0d44", "rua"],
    ["\u0d62", "luu"],
    ["\u0d63", "lua"],
    ["\u0d46", "e"],
    ["\u0d47", "ea"],
    ["\u0d48", "ai"],
    ["\u0d4a", "o"],
    ["\u0d4b", "oa"],
    ["\u0d4c", "au"]
]);

let consonantMap = new Map([
    ["\u0d15", "k"],
    ["\u0d16", "kh"],
    ["\u0d17", "g"],
    ["\u0d18", "gh"],
    ["\u0d19", "ng"],
    ["\u0d1a", "ch"],
    ["\u0d1b", "chh"],
    ["\u0d1c", "j"],
    ["\u0d1d", "jh"],
    ["\u0d1e", "nj"],
    ["\u0d1f", "t"],
    ["\u0d20", "ct"],
    ["\u0d21", "cd"],
    ["\u0d22", "cdh"],
    ["\u0d23", "cn"],
    ["\u0d24", "th"],
    ["\u0d25", "thh"],
    ["\u0d26", "d"],
    ["\u0d27", "dh"],
    ["\u0d28", "n"],
    ["\u0d2a", "p"],
    ["\u0d2b", "ph"],
    ["\u0d2c", "b"],
    ["\u0d2d", "bh"],
    ["\u0d2e", "m"],
    ["\u0d2f", "y"],
    ["\u0d30", "r"],
    ["\u0d31", "cr"],
    ["\u0d32", "l"],
    ["\u0d33", "cl"],
    ["\u0d34", "zh"],
    ["\u0d35", "v"],
    ["\u0d36", "z"],
    ["\u0d37", "sh"],
    ["\u0d38", "s"],
    ["\u0d39", "h"],
    ["\u0d19\u0d4d\u0d15", "nk"],
    ["\u0d19\u0d4d\u0d19", "ngg"],
    ["\u0d1e\u0d4d\u0d1e", "njj"],
    ["\u0d28\u0d4d\u0d31", "nt"],
    ["\u0d28\u0d4d\u0d24", "nth"],
    ["\u0d26\u0d4d\u0d27", "qd"],
    ["\u0d31\u0d4d\u0d31", "qt"],
    ["\u0d24\u0d4d\u0d25", "qth"],
    ["\u0d1a\u0d4d\u0d1a", "cch"],
    ["\u0d24\u0d4d\u0d24", "tth"],
    ["\u0d33\u0d4d\u0d33", "cll"],
    ["\u0d23\u0d4d\u0d23", "cnn"]
]);

let chilluMap = new Map([
    ["\u0d02", "m"],
    ["\u0d03", "h"],
    ["\u0d7a", "cn"],
    ["\u0d7b", "n"],
    ["\u0d7c", "r"],
    ["\u0d7d", "l"],
    ["\u0d7e", "cl"],
    ["\u0d7f", "k"]
]);

let confusionMap = new Map([
    ["\u0d2e", ""],
    ["\u0d39", ""],
    ["\u0d23", ""],
    ["\u0d28", ""],
    ["\u0d30", ""],
    ["\u0d32", ""],
    ["\u0d33", ""],
    ["\u0d15", ""]
]);

    var beginning = true;
    var sb = [];

    while (malayalam.length > 0) {
        var i;
        for (i = Math.min(maxseqlen, malayalam.length); i > 0; i--) {
            var seq = malayalam.substring(0, i);
            var c = malayalam.length > i ? malayalam.charAt(i) : 0;
            var d = malayalam.length > i + 1 ? malayalam.charAt(i + 1) : 0;
            var end = i == malayalam.length ||
                    ((c < '\u0d00' || c > '\u0d7f') && c != '\u200c' && c != '\u200d');
            var nearend = i == malayalam.length - 1 || ((d < '\u0d00' || d > '\u0d7f') && d != '\u200c' && d != '\u200d');
            if (independentVowelMap.has(seq)) {
                if (!beginning)
                    sb.push('x');
                sb.push(independentVowelMap.get(seq));
            } else if (dependentVowelMap.has(seq)) {
                sb.push(dependentVowelMap.get(seq));
            } else if (chilluMap.has(seq)) {
                sb.push(chilluMap.get(seq));
                if (!end)
                    sb.push('x');
            } else if (consonantMap.has(seq)) {
                sb.push(consonantMap.get(seq));
                if (!dependentVowelMap.has(c) && c != '\u0d4d')
                    sb.push('a');
                if (nearend && c == '\u0d4d' && confusionMap.has(seq))
                    sb.push('c');
            } else if (mixMap.has(seq)) {
                sb.push(mixMap.get(seq));
            } else
                continue;
            malayalam = malayalam.substring(i);
            beginning = false;
            break;
        }

        if (i == 0) {
            sb.push(malayalam.charAt(0));
            malayalam = malayalam.substring(1);
            beginning = true;
        }
    }

    return sb.join("");
}
