import {SyncInfo} from "./data.js"
import {syncData} from "./context.js"

export function syllabify(words) {
	const syllableRegex = /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;
    const arr = words.match(syllableRegex);
    if (arr) return arr;
    return [words];
}

export function toSylls(sentence){
    const words = sentence.split(" ");
    let syllables = [];

    for (let i = 0; i < words?.length; i++){
        const english = /^[A-Za-z]*$/;

        if (english.test(words[i][0])){
            syllables.push(...syllabify(words[i]).map(w => new SyncInfo(w)))
        }
        else{
            syllables.push(...words[i].split("").map(w => new SyncInfo(w)))
        }

        if (i < words.length - 1){
            syllables[syllables.length - 1].word += " ";
        }
    }

    return syllables
}

export function lineSentence(line, to){
	if (!syncData.line(line)) return ""
    const sylls = syncData.line(line).map(d => d.word)
    if (!isNaN(to)) return sylls.slice(0, to + 1).join("");
    return sylls.join("");
}

export function dataify(sentence){
    const sign = [".", ",", "!", "?"];
    const refinedSentence = sentence.split("").filter(v => !sign.includes(v)).join("");
    
    return toSylls(refinedSentence)
}

export function lineSentenceWidth(cx, idx, shouldTrim){
	if (idx[0] < 0 || idx[1] < 0) return 0;
	const sentence = lineSentence(idx[0], idx[1]);
		
	if (shouldTrim) return cx.measureText(sentence.trim()).width;
	return cx.measureText(sentence).width;
}

export function download(url, name){
	const a = document.createElement("a")
    a.href = url
    a.download = name;
    a.click()
    a.remove()
}