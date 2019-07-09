/*
* Copyright (c) 2019 - Lal Samuel Varghese (lalsam@gmail.com)
*/

function manglishToMalayalam() {
    var m = document.getElementById("manglish");
    var manglish = m.value;
    var malayalam = transliterate(manglish, false);
    var n = document.getElementById("malayalam");
    n.value = malayalam;
}

var maxseqlen = 3;

let independentVowelMap = new Map([
    ["a", "\u0d05"],
    ["aa", "\u0d06"],
    ["i", "\u0d07"],
    ["ee", "\u0d08"],
    ["u", "\u0d09"],
    ["oo", "\u0d0a"],
    ["ruu", "\u0d0b"],
    ["rua", "\u0d60"],
    ["luu", "\u0d0c"],
    ["lua", "\u0d61"],
    ["e", "\u0d0e"],
    ["ea", "\u0d0f"],
    ["ai", "\u0d10"],
    ["o", "\u0d12"],
    ["oa", "\u0d13"],
    ["au", "\u0d14"],
    ["ou", "\u0d14"]
]);

let dependentVowelMap = new Map([
    ["a", ""],
    ["aa", "\u0d3e"],
    ["i", "\u0d3f"],
    ["ee", "\u0d40"],
    ["u", "\u0d41"],
    ["oo", "\u0d42"],
    ["ruu", "\u0d43"],
    ["rua", "\u0d44"],
    ["luu", "\u0d62"],
    ["lua", "\u0d63"],
    ["e", "\u0d46"],
    ["ea", "\u0d47"],
    ["ai", "\u0d48"],
    ["o", "\u0d4a"],
    ["oa", "\u0d4b"],
    ["au", "\u0d4c"],
    ["ou", "\u0d4c"]
]);

let consonantMap = new Map([
    ["k", "\u0d15"],
    ["kh", "\u0d16"],
    ["g", "\u0d17"],
    ["gh", "\u0d18"],
    ["ng", "\u0d19"],
    ["ch", "\u0d1a"],
    ["chh", "\u0d1b"],
    ["j", "\u0d1c"],
    ["jh", "\u0d1d"],
    ["nj", "\u0d1e"],
    ["t", "\u0d1f"],
    ["ct", "\u0d20"],
    ["cd", "\u0d21"],
    ["cdh", "\u0d22"],
    ["cn", "\u0d23"],
    ["th", "\u0d24"],
    ["thh", "\u0d25"],
    ["d", "\u0d26"],
    ["dh", "\u0d27"],
    ["n", "\u0d28"],
    ["p", "\u0d2a"],
    ["ph", "\u0d2b"],
    ["b", "\u0d2c"],
    ["bh", "\u0d2d"],
    ["m", "\u0d2e"],
    ["y", "\u0d2f"],
    ["r", "\u0d30"],
    ["cr", "\u0d31"],
    ["l", "\u0d32"],
    ["cl", "\u0d33"],
    ["zh", "\u0d34"],
    ["v", "\u0d35"],
    ["z", "\u0d36"],
    ["sh", "\u0d37"],
    ["s", "\u0d38"],
    ["h", "\u0d39"],
    ["nk", "\u0d19\u0d4d\u0d15"],
    ["ngg", "\u0d19\u0d4d\u0d19"],
    ["njj", "\u0d1e\u0d4d\u0d1e"],
    ["nt", "\u0d28\u0d4d\u0d31"],
    ["nth", "\u0d28\u0d4d\u0d24"],
    ["qd", "\u0d26\u0d4d\u0d27"],
    ["qt", "\u0d31\u0d4d\u0d31"],
    ["qth", "\u0d24\u0d4d\u0d25"],
    ["cch", "\u0d1a\u0d4d\u0d1a"],
    ["tth", "\u0d24\u0d4d\u0d24"],
    ["cll", "\u0d33\u0d4d\u0d33"],
    ["cnn", "\u0d23\u0d4d\u0d23"]
]);

let chilluMap = new Map([
    ["m", "\u0d02"],
    ["h", "\u0d03"],
    ["cn", "\u0d7a"],
    ["n", "\u0d7b"],
    ["r", "\u0d7c"],
    ["l", "\u0d7d"],
    ["cl", "\u0d7e"],
    ["k", "\u0d7f"]
]);

function transliterate(manglish, skipTags) {
    var beginning = true;
    var consonant = false;
    var sb = [];

    while (manglish.length > 0) {
        if (skipTags && manglish.charAt(0) === '<') {
            var l;
            for (l = 1; manglish.length > l && manglish.charAt(l) !== '>'; l++);
            if (manglish.length > l && manglish.charAt(l) === '>')
                l++;
            sb.push(manglish.substring(0, l));
            manglish = manglish.substring(l);
            continue;
        }
        
        var i;
        for (i = Math.min(maxseqlen, manglish.length); i > 0; i--) {
            var seq = manglish.substring(0, i);
            var c = manglish.length > i ? manglish.charAt(i) : 0;
            var end = i === manglish.length || !/[a-z]/.test(c) || c === 'x';
            if (beginning && independentVowelMap.has(seq)) {
                sb.push(independentVowelMap.get(seq));
                consonant = false;
            } else if (end && chilluMap.has(seq)) {
                sb.push(chilluMap.get(seq));
                consonant = false;
            } else if (dependentVowelMap.has(seq)) {
                sb.push(dependentVowelMap.get(seq));
                consonant = false;
            } else if (consonantMap.has(seq)) {
                if (consonant)
                    sb.push("\u0d4d");
                sb.push(consonantMap.get(seq));
                if (end)
                    sb.push("\u0d4d");
                consonant = true;
            } else
                continue;
            manglish = manglish.substring(i);
            beginning = false;
            break;
        }

        if (i === 0) {
            var c = manglish.charAt(0);
            if (c === 'c')
                sb.push("്");
            if (consonant && c === 'x')
                sb.push("\u200c");
            if (!/[a-z]/.test(c))
                sb.push(c);
            manglish = manglish.substring(1);
            beginning = true;
            consonant = false;
        }
    }

    return sb.join("");
}
