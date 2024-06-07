import {LyricView} from "./LyricView/LyricView.js"
import {update} from "./update.js"
import {syncData, isRunningMode, notRunningMode} from "./context.js"
import {handle} from "./features.js"
import {lineSentence, lineSentenceWidth} from "./util.js"

import { FFmpeg } from "./assets/ffmpeg/package/dist/esm/index.js";
import { fetchFile } from "./assets/util/package/dist/esm/index.js"

const ffmpeg = new FFmpeg()

async function convert(){
	notRunningMode();
	const musicAudio = document.getElementById("audio");
	const dataURLs = getDataURLs();
	await ffmpeg.load({
		coreURL: "/public/assets/core/package/dist/esm/ffmpeg-core.js"
	});
	ffmpeg.on("progress", ({progress, time}) => {
		console.log(progress, time);
	})
	await ffmpeg.createDir("./scenes")
	for (let i = 0; i < dataURLs.length; i++){
		await ffmpeg.writeFile(`./scenes/scene${("0000" + i).slice(-5)}.jpg`, await fetchFile(dataURLs[i]))
	}
	await ffmpeg.writeFile('music.mp3', await fetchFile(musicAudio.src))
	
	const input = './scenes/scene%05d.jpg';
	const output = "animation.mp4";
	const args = `-start_number 1 -i ${input} -c:v libx264 ${output}`;
	await ffmpeg.exec(args.split(" "));
	await ffmpeg.exec([
	  '-async', "1",
      '-i', "animation.mp4",
      '-i', "music.mp3",
	  '-shortest', ///
      "output.mp4"
    ]);
	const data = await ffmpeg.readFile("output.mp4");

	const url = URL.createObjectURL(
		new Blob([data.buffer], { type: "video/mp4" })
	);
	const a = document.createElement("a")
    a.href = url
    a.download = 'output.mp4'
    a.click()
    a.remove()
}

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
		const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(syncData.data));
		const a = document.createElement("a");
		a.setAttribute("href", dataStr);
		a.setAttribute("download", "sync.json");
		a.click();
	}
	
	return downloader;
}

document.body.append(SyncDataDownloader())

export function getDataURLs(){
	const dataURLs = [];
	const deadline = 30//musicAudio.duration;

	for (let i = 0; i < Math.floor(deadline * 24); i++){
		draw(i / 24)
		dataURLs.push(canvas.toDataURL("image/jpeg"))
	}
	
	return dataURLs;
}

async function sendURLs(){
	notRunningMode();
	const urls = getDataURLs();
	const res = await fetch('/convert', {
	    method: "POST",
	    headers: {
			"content-type": "application/json",
	  	},
	  	body: JSON.stringify({
			urls: urls
		})
	})
	console.log(await res.json())
}

const sendURLsButton = document.createElement("button");
sendURLsButton.innerText = "send";
document.body.append(sendURLsButton)

sendURLsButton.onclick = convert//sendURLs

const barSpeed = 200; //px per second
/**
 * 
 * @param {number} time 
 */
const draw = (time) => {
    cx.clearRect(0, 0, canvas.width, canvas.height);
	cx.beginPath();
	
    const idx = syncData.findLastIndex(a => a.start < time);
	const sync = syncData.at(idx);
	if(!sync?.start) {
		cx.fillStyle = "white";
		cx.fillRect(0, 0, canvas.width, canvas.height);
		return;
	}

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
	
	cx.beginPath();
	cx.globalCompositeOperation = "destination-over";
	cx.fillStyle = "white";
	cx.fillRect(0, 0, canvas.width, canvas.height);
	cx.closePath();
}

document.addEventListener("keydown", handle);