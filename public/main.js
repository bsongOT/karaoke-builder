const canvas = document.getElementById("canvas");
const cx = canvas.getContext("2d");

const musicAudio = document.getElementById("audio");
const lyricText = document.getElementById("lyric");

const convertProgress = document.getElementById("convert-progress");
const downloadProgress = document.getElementById("download-progress");

const memento = {
    audio: undefined, // audio file
    lyricLines: []
}
const infos = {
    time: 0,
    currentIndex: [0, 0]
}

let lyric;
let lines;
let syncData = new Article([[{word: " "}]]);

let textXs;
let tid;
let fileName = "my";


function update(f){
    setInterval(f, 25);
}
document.querySelector("#lyric").append(
    ...syncData.map((_, i) => Line({lineIndex: i}))
)
/**
 * 
 * @param {{lineIndex:number}} info 
 * @returns 
 */
function Line(info){
    const line = document.createElement("li");
    const view = document.createElement("div");
    const text = document.createElement("textarea", {className: ""});

    text.oninput = () => {
        const dataLine = syncData.line(info.lineIndex);
        dataLine.splice(0, dataLine.length);
        dataLine.push(...dataify(text.value))

        view.innerHTML = "";
        view.append(
            ...dataLine.map((_, i) => Letter({
                lineIndex: info.lineIndex,
                letterIndex: i
            }))
        )
    }
    
    update(()=> {
        syncData.at([info.lineIndex])
    })

    line.append(
        view,
        text
    )

    return line;
}
/**
 * 
 * @param {{
 *   lineIndex:number, 
 *   letterIndex:number
 * }} info 
 */
function Letter(info){
    const letter = document.createElement("span");

    update(() => {
        if (!document.contains(letter)) return;
        const data = syncData.at([info.lineIndex, info.letterIndex]).word;
        if (data === letter.innerText) return;
        letter.innerText = data;
    })

    return letter;
}

/*
for (let i = 0; i < syncData.at(0).length; i++){
    syncLine.children[0].insertAdjacentHTML("beforeend", `<span class="word">${syncData.at([0, i]).word.trim()}</span>`);
    syncLine.children[0].lastElementChild.style.left = 28 * i + "px";
}
update(() => {
    const time = musicAudio.currentTime;
    syncLine.style.left = -1300 * Math.floor(time / 5) + "px";

    if (tindex[0] === 0 && tindex[1] === 0) return;

    const prevIndex = syncData.prevIndex(tindex);
    const prev = syncLine.children[prevIndex[0]].children[prevIndex[1]];
    const prevData = syncData.prev(tindex);

    const lines = Array.from(lyricPanel.querySelectorAll(".line"));
    const obsoleteIndex = lines.findIndex(e => e.classList.contains("current"));
    if (obsoleteIndex !== tindex[0]){
        lines[obsoleteIndex]?.classList?.remove("current");
        lines[tindex[0]]?.classList?.add("current");
    }
    prev.style.left = (260 * prevData.start) + "px";
    prev.style.width = (260 * ((prevData.end ?? time) - prevData.start)) + "px";
});*/

document.getElementById("music").addEventListener("change", function(){
    const url = URL.createObjectURL(this.files[0]);
    fileName = this.files[0].name.slice(0, this.files[0].name.lastIndexOf("."));
    musicAudio.src = url;
    musicAudio.controls = "true";
    this.remove();
});

function dataify(sentence){
    const sign = [".", ",", "!", "?"];
    const refinedSentence = sentence.split("").filter(v => !sign.includes(v)).join("");
    
    return toSylls(refinedSentence)
}

async function readyCanvas() {
    const font = new FontFace("Happiness", "url(public/fonts/Happiness-Sans-Title.woff2)");
    await font.load()
    
    document.fonts.add(font);
    cx.font = "60px Happiness";
    cx.lineWidth = 4;
    textXs = lines.map(s => (canvas.width - cx.measureText(s).width) / 2)

    update(()=>draw(audio.currentTime, canvas, cx));
    
}

function convertClick(){
    convert(canvas, draw, musicAudio.duration, fileName);
}
/**
 * 
 * @param {number} time 
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} cx 
 */
const draw = (time, canvas, cx) => {
    cx.clearRect(0, 0, canvas.width, canvas.height);
    cx.beginPath();

    let idx = syncData.findIndex(a => a.end > time);
    if (idx[0] !== 0 && idx[1] !== 0 && time < syncData.at(idx)?.start) idx = syncData.prevIndex(idx);
    if (idx[1] < 0) idx = syncData.lastIndex;

    const word = syncData.at(idx);
    const beforeIdx = syncData.prevIndex(idx);
    const beforeWord = syncData.sentence(beforeIdx);
    const currentWord = syncData.sentence(idx).trimEnd();
    let before = cx.measureText(beforeWord).width;
    let now = cx.measureText(currentWord).width;

    if (beforeIdx[0] !== idx[0]) before = 0;

    const ratio = Math.min(1, (time - word.start) / (word.end - word.start));
    const progressWidth = before + (now - before) * ratio;

    cx.rect(textXs[idx[0]], 170 + 150 * (idx[0] % 2), progressWidth, 120);
    cx.fill();

    cx.globalCompositeOperation = "source-in";
    cx.fillStyle = "yellow";
    cx.fillText(lines[idx[0]], textXs[idx[0]], 250 + 150 * (idx[0] % 2));

    cx.globalCompositeOperation = "destination-over";
    cx.fillStyle = "white";
    cx.strokeStyle = "black";
    cx.fillText(lines[idx[0] + idx[0] % 2], textXs[idx[0] + idx[0] % 2], 250);
    cx.strokeText(lines[idx[0] + idx[0] % 2], textXs[idx[0] + idx[0] % 2], 250);
    cx.fillText(lines[idx[0] + 1 - idx[0] % 2], textXs[idx[0] + 1 - idx[0] % 2], 400);
    cx.strokeText(lines[idx[0] + 1 - idx[0] % 2], textXs[idx[0] + 1 - idx[0] % 2], 400);

    cx.globalCompositeOperation = "source-over";
}