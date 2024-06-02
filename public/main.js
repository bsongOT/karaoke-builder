const canvas = document.getElementById("canvas");
const cx = canvas.getContext("2d");

const musicAudio = document.getElementById("audio");
const lyricText = document.getElementById("lyric");

const convertProgress = document.getElementById("convert-progress");
const downloadProgress = document.getElementById("download-progress");

const memento = {
    audio: undefined, // audio file
}
const infos = {
    time: 0,
	currentIndex: [0, 0]
}

let syncData = new Article([[{word: " "}]]);
let fileName = "my";

const updateQueue = [];
setInterval(() => {
	for (const q of updateQueue) q()
}, 25)
function update(f){
    updateQueue.push(f);
}
function LyricView(){
    const lyricView = document.querySelector("#lyric")
    let childPairs = [];

    update(() => {
        if (childPairs.length < syncData.lastIndex[0] + 1) {
            childPairs.push(
                ...Array(syncData.lastIndex[0] + 1 - childPairs.length).fill(0).map((_, i) => {
                const info = {lineIndex: i};
                return {
                    element: Line(info),
                    info: info
                }
            }))
        }
        else if (childPairs.length > syncData.lastIndex[0] + 1) {
            childPairs.splice(childPairs.length - 1, childPairs.length - syncData.lastIndex[0] - 1);
        }
        for (let i = 0; i < childPairs.length; i++){
            childPairs[i].info.lineIndex = i;
        }
        if (lyricView.children.length !== childPairs.length){
            lyricView.innerHTML = "";
            lyricView.append(...childPairs.map(c => c.element))
        }
    })

    return lyricView;
}
/**
 * 
 * @param {{lineIndex:number}} info 
 * @returns 
 */
function Line(info){
    const line = document.createElement("li");
    const view = document.createElement("div");
    const text = document.createElement("textarea");

    line.classList.add("line");
    text.classList.add("line-text");

    line.onclick = function(){
        view.style.display = "none";
        text.style.display = "inline-block";
        text.focus();
		text.value = lineSentence(info.lineIndex);
    }
    text.onblur = function(){
        view.style.display = "block";
        text.style.display = "none";
    }

    text.oninput = () => {
        const dataLine = syncData.line(info.lineIndex);
        const values = text.value.split("\n").map(v => v.trim()).filter(v => v !== "");
        dataLine.splice(0, dataLine.length);
        dataLine.push(...dataify(values[0]))

        if (values.length > 1)
            syncData.insertLine(info.lineIndex + 1, ...values.slice(1).map(v => dataify(v)));
        text.value = values[0];
    }
    
    update(()=> {
        const elementSentence = Array.from(view.children).map(c => c.innerText).join("");
        const dataSentence = lineSentence(info.lineIndex);

        if (elementSentence === dataSentence.trim()) return;

        view.innerHTML = "";
        view.append(...syncData.line(info.lineIndex).map((_, i) => Letter({
            lineIndex: info.lineIndex,
            letterIndex: i
        })))
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
        const data = syncData.at([info.lineIndex, info.letterIndex]);
        
        if (data.word !== letter.innerText) 
            letter.innerText = data.word;
        
		let className = "";
        className += data.start && data.end ? "synced" : ""
		className += info.lineIndex === infos.currentIndex[0] && info.letterIndex === infos.currentIndex[1] ? "current" : ""
		letter.className = className;
    })

    return letter;
}

document.getElementById("music").addEventListener("change", function(){
    const url = URL.createObjectURL(this.files[0]);
    fileName = this.files[0].name.slice(0, this.files[0].name.lastIndexOf("."));
    musicAudio.src = url;
    musicAudio.controls = "true";
    this.remove();
});
function lineSentence(line, to){
	if (!syncData.line(line)) return ""
    const sylls = syncData.line(line).map(d => d.word)
    if (!isNaN(to)) return sylls.slice(0, to + 1).join("");
    return sylls.join("");
}
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

    update(()=>draw(audio.currentTime, canvas, cx));
}

function convertClick(){
    convert(canvas, draw, musicAudio.duration, fileName);
}
LyricView();
readyCanvas();

function lineSentenceWidth(cx, idx, shouldTrim){
	if (idx[0] < 0 || idx[1] < 0) return 0;
	const sentence = lineSentence(idx[0], idx[1]);
		
	if (shouldTrim) return cx.measureText(sentence.trim()).width;
	return cx.measureText(sentence).width;
}
const barSpeed = 200; //px per second
/**
 * 
 * @param {number} time 
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} cx 
 */
const draw = (time, canvas, cx) => {
    cx.clearRect(0, 0, canvas.width, canvas.height);
    cx.beginPath();
	
    const idx = syncData.findLastIndex(a => a.start < time);
	const sync = syncData.at(idx);
	if(!sync?.start) return;

    const before = lineSentenceWidth(cx, [idx[0], idx[1] - 1]);
    const now = lineSentenceWidth(cx, idx, true);
	
	if (idx[0] < 0 || idx[1] < 0) return;

    const ratio = sync.end ? Math.min(1, (time - sync.start) / (sync.end - sync.start)) : 1;
    const progressWidth = before + (now - before) * ratio;

    const currentSentence = lineSentence(idx[0]);
    const nextSentence = lineSentence(idx[0] + 1);

    const currentTextX = (canvas.width - cx.measureText(currentSentence).width) / 2;
    const nextTextX = (canvas.width - cx.measureText(nextSentence).width) / 2;
		
    cx.rect(currentTextX, 170 + 150 * (idx[0] % 2), progressWidth, 120);
    cx.fill();

    cx.globalCompositeOperation = "source-in";
    cx.fillStyle = "yellow";
    cx.fillText(currentSentence, currentTextX, 250 + 150 * (idx[0] % 2));

    cx.globalCompositeOperation = "destination-over";
    cx.fillStyle = "white";
    cx.strokeStyle = "black";
    if (idx[0] % 2 === 0) {
        cx.fillText(currentSentence, currentTextX, 250);
        cx.strokeText(currentSentence, currentTextX, 250);
        cx.fillText(nextSentence, nextTextX, 400);
        cx.strokeText(nextSentence, nextTextX, 400);        
    }
    else {
        cx.fillText(nextSentence, nextTextX, 250);
        cx.strokeText(nextSentence, nextTextX, 250);
        cx.fillText(currentSentence, currentTextX, 400);
        cx.strokeText(currentSentence, currentTextX, 400);
    }
	cx.closePath();
	
	cx.beginPath();
    cx.globalCompositeOperation = "source-over";
	cx.fillStyle = "skyblue";
	const syncArr = syncData.data.flat(1);
	for (let i = 0; i < syncArr.length; i++)
		cx.rect(
			400 + (syncArr[i].start - time) * barSpeed, 
			30 + 15 * (i % 3), 
			(syncArr[i].end - syncArr[i].start) * barSpeed, 
			10
		);
	cx.fill()
	cx.closePath();
	
	cx.beginPath();
	cx.fillStyle = "black";
	cx.rect(398, 25, 4, 55)
	cx.fill()
	cx.closePath();
}