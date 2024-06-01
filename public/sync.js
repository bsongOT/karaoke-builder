const syncLine = document.getElementById("syncs");

let tindex = [0, 0];

const handle = (e)=>{
    if (e.code === "Backspace"){
        if (tindex[0] === 0 && tindex[1] === 0) return;

        tindex = syncData.prevIndex(tindex);

        syncData.at(tindex).start = undefined;
        syncData.at(tindex).end = undefined;
    }
    else if (e.code === "KeyA"){
        const current = syncData.at(tindex)
        const prev = syncData.prev(tindex);

        current.start = musicAudio.currentTime;
        
        if (prev && !prev.end) prev.end = current.start;
                
        tindex = syncData.nextIndex(tindex);

        if (!syncData.at(tindex)) return;

        for (let i = 0; i < syncData.at(tindex[0]).length; i++){
            syncLine.children[tindex[0]].insertAdjacentHTML("beforeend", `<span class="word">${syncData.at([tindex[0],i]).word.trim()}</span>`);
            syncLine.children[tindex[0]].lastElementChild.style.left = syncData.at(tindex).start + 28 * i + "px";
        }
    }
    else if (e.code === "KeyS"){
        syncData.prev(tindex).end = musicAudio.currentTime;
    }
};
document.addEventListener("keydown", handle);