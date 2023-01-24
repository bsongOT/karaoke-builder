const audio = document.getElementById("audio");
const syncLine = document.getElementById("syncs");

let tindex = [0, 0];

const handle = (e)=>{
    if (step !== 3) return;
    if (e.code === "Backspace"){
        if (tindex[0] === 0 && tindex[1] === 0) return;
        tindex[1]--;
        if (!syncData.at(tindex)){
            tindex[0]--;
            tindex[1] = syncData.at(tindex[0]).length - 1;
        }

        syncLine.children[tindex[0]].children[tindex[1]].classList.remove("synced");

        syncData.at(tindex).start = undefined;
        syncData.at(tindex).end = undefined;
    }
    else if (e.code === "KeyA"){
        const current = syncData.at(tindex)
        const prev = syncData.prev(tindex);

        current.start = audio.currentTime;
        
        if (prev && !prev.end) prev.end = current.start;
        
        syncLine.children[tindex[0]].children[tindex[1]].classList.add("synced");
        
        tindex[1]++;
        if (!syncData.at(tindex)){
            tindex[0]++;
            tindex[1] = 0;

            if (!syncData.at(tindex)) return;

            syncLine.insertAdjacentHTML("beforeend", `<div class="measure"></div>`)
            for (let i = 0; i < syncData.at(tindex[0]).length; i++){
                syncLine.children[tindex[0]].insertAdjacentHTML("beforeend", `<span class="word">${syncData.at([tindex[0],i]).word.trim()}</span>`);
                syncLine.children[tindex[0]].lastElementChild.style.left = syncData.at(tindex).start + 28 * i + "px";
            }
        }
    }
    else if (e.code === "KeyS"){
        syncData.prev(tindex).end = audio.currentTime;
        if (!syncData.at(tindex[0], tindex[1] + 1) && !syncData.at(tindex[0] + 1, 0)){
            showResult();
            return document.removeEventListener("keydown", handle);
        }
    }
};
document.addEventListener("keydown", handle);