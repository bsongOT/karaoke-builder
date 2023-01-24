const sign = [".", ",", "!", "?"];

function receiveLyric(){
    if (step !== 2) return;
    lyric = lyricText.value.split("").filter(v => !sign.includes(v)).join("");
    lines = lyric.split("\n");
    syncData = new Article(lines.map(toSylls));

    nextStep();
}