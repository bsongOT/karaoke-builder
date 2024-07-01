import { dataify, download } from "./util.js"
import { audio, setSyncData, infos, syncData } from "./context.js"
import { goBack, goForward, togglePlay, eraseSync, insertSync, closeSync } from "./features.js"
import { convert, getSyncDataBlob } from "./convert.js";

document.getElementById("file").addEventListener("change", function(){
    const url = URL.createObjectURL(this.files[0]);
	const formData = new FormData();
	formData.append("files", this.files[0], "pending.mp3");
	fetch("/remove-vocal", {
		method: "POST",
		body: formData
	}).then(console.log);

    audio.src = url;
    audio.controls = "true";
	audio.name = this.files[0].name.slice(0, this.files[0].name.lastIndexOf("."));
	document.querySelector("#workspace").style.display = "flex";
	this.remove();
});

document.getElementById("load-sync").onclick = () => document.getElementById("sync-file").click();
document.getElementById("sync-file").onchange = async function() {
	const text = await this.files[0].text();
	setSyncData(JSON.parse(text));
	infos.currentIndex = syncData.lastIndex
}
document.getElementById("save-sync").onclick = async () => {
	download(
		URL.createObjectURL(await getSyncDataBlob()),
		"sync.json"
	)
}
document.getElementById("split-line").onclick = () => {
	for (let i = 0; i < syncData.data.length; i++){
		const line = syncData.line(i);
		const sentence = line.map(si => si.word).join("");

		if (getSentenceWidth(sentence) <= 14) continue;
		
		syncData.removeLine(i);
		syncData.insertLine(i, ...splitSentence(sentence).map(s => dataify(s)));
	}
}

function getSentenceWidth(sentence){
	return sentence.split("").map(l => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(l) ? 1 : 0.5).reduce((a, b) => a + b);
}

function splitSentence(sentence){
	let splitWidth = 0;
    let beforeSplitIndex = -1;
	let splitIndex = 0;
    let sentences = [];
	const totalWidth = getSentenceWidth(sentence);
	const averageWidth = totalWidth / Math.ceil(totalWidth / 14);

	for (let j = 0; j < sentence.length; j++){
		splitWidth += /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(sentence[j]) ? 1 : 0.5;
        if (sentence[j] === ' ') splitIndex = j;
		if (splitWidth > averageWidth) {
            sentences.push(sentence.slice(beforeSplitIndex + 1, splitIndex));
            beforeSplitIndex = splitIndex;
            splitWidth = 0;
        }
	}
    if (beforeSplitIndex !== sentence.length - 1){
        sentences.push(sentence.slice(beforeSplitIndex + 1))
    }

	return sentences.filter(s=> s !== "");
}

function ConvertButton(){
	const btn = document.createElement("button");
	const progressBar = document.querySelector("#convert-progress");
	const progress = document.querySelector("#convert-progress > .progress");
	const convertMessage = document.querySelector("#convert-message");
	const onProgress = pinfo => {
		convertMessage.textContent = pinfo.message;
		progress.style.width = `${pinfo.percent * 100}%`;
	}

	btn.className = "convert-button"
	btn.innerText = "convert";
	btn.onclick = async () => {
		progressBar.style.display = "";
		btn.remove();

		const data = await convert({onProgress});
		const requireds = [
			["music", data.music, "music.mp3"],
			["mr", data.mr, "mr.mp3"],
			["sing-along", data.singAlong, "sing-along.mp4"],
			["karaoke", data.karaoke, "karaoke.mp4"],
			["sync", data.syncData, "sync.json"],
		]

		onProgress({
			percent: 1,
			message: "Holding on final zip file..."
		})

		await fetch('/name', {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: audio.name
			})
		})
		for (let i = 0; i < requireds.length; i++){
			const form = new FormData();
			form.append(...requireds[i]);
			await fetch('/post-file', {
				method: "POST",
				body: form
			})
		}

		const zipRes = await fetch('/zip')
		const zipBlob = await zipRes.blob();
		const zipURL = URL.createObjectURL(zipBlob);
		
		download(zipURL, `${audio.name}.zip`)
	}
	
	return btn;
}
document.body.append(ConvertButton())

document.addEventListener("keydown", (e)=>{
	if (document.activeElement !== document.body) return;
	const $ = (query) => document.querySelector(query);
	switch(e.code){
		case "ArrowLeft": 
			$("#key-arrow-left").classList.add("pressed")
			return goBack();
		case "ArrowRight": 
			$("#key-arrow-right").classList.add("pressed")
			return goForward();
		case "Space":
			$("#key-spacebar").classList.add("pressed") 
			return togglePlay();
		case "Backspace": 
			$("#key-backspace").classList.add("pressed")
			return eraseSync();
		case "KeyA": 
			$("#key-a").classList.add("pressed")
			return insertSync();
		case "KeyS": 
			$("#key-s").classList.add("pressed")
			return closeSync();
	}
});
document.addEventListener("keyup", (e)=>{
	const $ = (query) => document.querySelector(query);
	switch(e.code){
		case "ArrowLeft": return $("#key-arrow-left").classList.remove("pressed")
		case "ArrowRight": return $("#key-arrow-right").classList.remove("pressed")
		case "Space": return $("#key-spacebar").classList.remove("pressed") 
		case "Backspace": return $("#key-backspace").classList.remove("pressed")
		case "KeyA": return $("#key-a").classList.remove("pressed")
		case "KeyS": return $("#key-s").classList.remove("pressed")
	}
});