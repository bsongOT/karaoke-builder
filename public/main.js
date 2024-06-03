import {LyricView} from "./LyricView/LyricView.js"
import {update} from "./update.js"
import {syncData, isRunningMode, notRunningMode} from "./context.js"
import {handle} from "./features.js"
import {lineSentence, lineSentenceWidth} from "./util.js"

const canvas = document.getElementById("canvas");
const cx = canvas.getContext("2d");

export const musicAudio = document.getElementById("audio");

const memento = {
    audio: undefined, // audio file
	//syncData: new Article([[{word: " "}]])
}

document.getElementById("music").addEventListener("change", function(){
    const url = URL.createObjectURL(this.files[0]);
    const fileName = this.files[0].name.slice(0, this.files[0].name.lastIndexOf("."));
    musicAudio.src = url;
    musicAudio.controls = "true";
    this.remove();
});

async function readyCanvas() {
    const font = new FontFace("Happiness", "url(public/fonts/Happiness-Sans-Title.woff2)");
    await font.load()
    
    document.fonts.add(font);
    cx.font = "60px Happiness";
    cx.lineWidth = 4;

    update(()=>{
		if (!isRunningMode) return;
		draw(audio.currentTime, canvas, cx)
	});
}
LyricView();
readyCanvas()

export function SyncDataDownloader(){
	const downloader = document.createElement("button");
	downloader.innerText = "Download";
	downloader.onclick = () => {
		const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(syncData));
		const a = document.createElement("a");
		a.setAttribute("href", dataStr);
		a.setAttribute("download", "sync.json");
		a.click();
	}
	
	return downloader;
}

document.body.append(SyncDataDownloader())

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

document.addEventListener("keydown", handle);