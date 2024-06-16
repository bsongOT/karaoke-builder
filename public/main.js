import {update} from "./update.js"
import {syncData, isRunningMode} from "./context.js"
import {handle} from "./features.js"
import {lineSentence, lineSentenceWidth, download} from "./util.js"

export const musicAudio = document.getElementById("audio");

document.getElementById("music").addEventListener("change", function(){
    const url = URL.createObjectURL(this.files[0]);
	const formData = new FormData();
	formData.append("files", this.files[0], "pending.mp3");
	fetch("/remove-vocal", {
		method: "POST",
		body: formData
	}).then(console.log);

    musicAudio.src = url;
    musicAudio.controls = "true";
    this.remove();
});

export function SceneCanvas(canvasInfo) {
	const canvas = document.querySelector("#canvas");
	const cx = canvas.getContext("2d");
    const font = new FontFace("Happiness", "url(public/fonts/Happiness-Sans-Title.woff2)");
    
	async function ready(){
		await font.load()
		
		document.fonts.add(font);
		cx.font = "60px Happiness";
		cx.lineWidth = 4;
	}

	ready();

	canvasInfo.draw = draw;

	const barSpeed = 150; //px per second

	function draw(time) {
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

    update(()=>{
		if (!isRunningMode) return;
		draw(audio.currentTime)
	});

	return canvas;
}

function ConvertButton(){
	const btn = document.createElement("button");
	const progress = document.querySelector("#convert-progress > .progress");
	const onProgress = p => progress.style.width = `${p * 100}%`;

	btn.innerText = "convert";
	btn.onclick = async () => {
		const data = await convert(onProgress);
		download(data.singAlong, "sing-along.mp4");
		download(data.karaoke, "karaoke.mp4");
		download(data.music, "music.mp3");
		download(data.mr, "mr.mp3")
		download(data.syncData, "sync.json");
	}
	
	return btn;
}
document.body.append(ConvertButton())

document.addEventListener("keydown", handle);