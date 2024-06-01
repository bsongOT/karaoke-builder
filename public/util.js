const syllableRegex = /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;

function syllabify(words) {
    const arr = words.match(syllableRegex);
    if (arr) return arr;
    return [words];
}

function toSylls(sentence){
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