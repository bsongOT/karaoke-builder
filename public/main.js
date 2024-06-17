import { download } from "./util.js"
import { audio } from "./context.js"
import { goBack, goForward, togglePlay, eraseSync, insertSync, closeSync } from "./features.js"
import { convert } from "./convert.js";
import {JSZIP} from "./jszip/dist/jszip.js";

console.log(JSZIP);
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
	console.log(audio.name)
	document.querySelector("#workspace").style.display = "flex";
	this.remove();
});

function ConvertButton(){
	const btn = document.createElement("button");
	const progressBar = document.querySelector("#convert-progress");
	const progress = document.querySelector("#convert-progress > .progress");
	const onProgress = p => progress.style.width = `${p * 100}%`;

	btn.className = "convert-button"
	btn.innerText = "convert";
	btn.onclick = async () => {
		progressBar.style.display = "";
		btn.remove();
		const data = await convert({onProgress});
		/*
		const zip = new JSZip();

		zip.file("sing-along.mp4", data.singAlong);
		zip.file("karaoke.mp4", data.karaoke);
		zip.file("music.mp3", data.music);
		zip.file("mr.mp3", data.mr)
		zip.file("sync.json", data.syncData);

		const zipBlob = await zip.generateAsync({type: 'blob'});
		const zipFileURL = URL.createObjectURL(zipBlob);

		download(zipFileURL, audio.name)*/
	}
	
	return btn;
}
document.body.append(ConvertButton())

document.addEventListener("keydown", (e)=>{
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