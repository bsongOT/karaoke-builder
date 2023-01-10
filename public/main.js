let canvas = document.getElementById("canvas");
let cx = canvas.getContext("2d");
let playbar = document.getElementById("playbar");

let font = new FontFace("Happiness", "url(public/fonts/Happiness-Sans-Title.woff2)");
let textXs;
let tid;

function showResult() {
    font.load().then(() => {
        document.fonts.add(font);
        cx.font = "60px Happiness";
        cx.lineWidth = 4;
        textXs = lines.map(s => (canvas.width - cx.measureText(s).width) / 2)
    }).catch(console.log);
    playbar.style.display = "block";
    tid = setInterval(()=>draw(audio.currentTime), 25);
}

function convertClick(){
    clearInterval(tid);
    convert(canvas, draw, document.getElementById("audio").duration);
}

const draw = (time) => {
    cx.clearRect(0, 0, canvas.width, canvas.height);

    cx.beginPath();
    let idx = sync.findIndex(a => a.end > time);
    if (idx !== 0 && time < sync[idx]?.start) idx--;
    if (idx < 0) idx = sync.length - 1;
    const beforeWord = lines[sync[idx - 1]?.line]?.slice(0, sync[idx]?.indexInLine);
    const lineProgress = lines[sync[idx].line].slice(0, sync[idx].indexInLine + 1);
    const before = sync[idx - 1]?.line === sync[idx].line ? cx.measureText(beforeWord).width : 0;
    const now = cx.measureText(lineProgress).width;
    const ratio = Math.min(1, (time - sync[idx].start) / (sync[idx].end - sync[idx].start));
    const progressWidth = before + (now - before) * ratio;

    playbar.style.left = 120 * (time - sync[idx - sync[idx].syncIndexInLine].start) + "px";

    if (sync[idx - 1]?.line !== sync[idx].line) {
        syncLine.innerHTML = "";
        const l = lines[sync[idx].line].split(" ").join("");
        for (let i = 0; i < l.length; i++) {
            syncLine.insertAdjacentHTML("beforeend",
                `<div class="word">${l[i]}</div>`);
            const getLast = arr => arr[arr.length - 1];
            const sn = sync[idx - sync[idx].syncIndexInLine + i];
            getLast(syncLine.children).style.width = 120 * (sn.end - sn.start) + "px";
        }
    }

    cx.rect(textXs[sync[idx].line], 170 + 150 * (sync[idx].line % 2), progressWidth, 120);
    cx.fill();

    cx.globalCompositeOperation = "source-in";
    cx.fillStyle = "yellow";
    cx.fillText(lines[sync[idx].line], textXs[sync[idx].line], 250 + 150 * (sync[idx].line % 2));

    cx.globalCompositeOperation = "destination-over";
    cx.fillStyle = "white";
    cx.strokeStyle = "black";
    cx.fillText(lines[sync[idx].line + sync[idx].line % 2], textXs[sync[idx].line + sync[idx].line % 2], 250);
    cx.strokeText(lines[sync[idx].line + sync[idx].line % 2], textXs[sync[idx].line + sync[idx].line % 2], 250);
    cx.fillText(lines[sync[idx].line + 1 - sync[idx].line % 2], textXs[sync[idx].line + 1 - sync[idx].line % 2], 400);
    cx.strokeText(lines[sync[idx].line + 1 - sync[idx].line % 2], textXs[sync[idx].line + 1 - sync[idx].line % 2], 400);
}
