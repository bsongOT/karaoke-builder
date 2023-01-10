const audio = document.getElementById("audio");
const syncLine = document.getElementById("syncs");
let index = 0;
let line = 0;
let indexInLine = 0;
let syncIndexInLine = 0;
const handle = (e)=>{
    if (e.code === "Backspace"){

    }
    else if (e.code === "KeyA"){
        while (lyric[index] === '\n' || lyric[index] === ' ' || typeof lyric[index] == "undefined") {
            if (lyric[index] === '\n') {
                line++;
                indexInLine = 0;
                syncIndexInLine = 0;
                syncLine.innerHTML = "";
            }
            else indexInLine++;
            index++;

            if (index >= lyric.length || index < 0) break;
        }
        if (sync.length > 0) sync[sync.length - 1].end = sync[sync.length - 1].end ?? audio.currentTime;
        sync.push({
            start: audio.currentTime,
            end: undefined,
            line: line,
            indexInLine: indexInLine,
            syncIndexInLine: syncIndexInLine,
            word: lyric[index],
            index: index
        })
        syncLine.insertAdjacentHTML("beforeend", 
                    `<div class="word">${lyric[index]}</div>`);
        index++;
        syncIndexInLine++;
        indexInLine++;
    }
    else if (e.code === "KeyS"){
        sync[sync.length - 1].end = audio.currentTime;
        if (index >= lyric.length){
            showResult();
            console.log(sync);
            return document.removeEventListener("keydown", handle);
        }
    }
};
document.addEventListener("keydown", handle);