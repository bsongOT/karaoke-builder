import {syncData, infos} from "./context.js"
import {musicAudio} from "./main.js"

export function eraseSync(){
	if (infos.currentIndex[0] === 0 && infos.currentIndex[1] === 0) return;

	infos.currentIndex = syncData.prevIndex(infos.currentIndex);
	
	syncData.at(infos.currentIndex).start = undefined;
	syncData.at(infos.currentIndex).end = undefined;
}
export function insertSync(){
	const current = syncData.at(infos.currentIndex);
	const prev = syncData.prev(infos.currentIndex);
	
	if (!current) return;
	
	current.start = musicAudio.currentTime;

	if (prev && !prev.end) prev.end = current.start;

	infos.currentIndex = syncData.nextIndex(infos.currentIndex);
}
export function closeSync(){
	syncData.prev(infos.currentIndex).end = musicAudio.currentTime;
}
export function togglePlay(){
	if (!musicAudio.controls) return;
	if (musicAudio.paused) musicAudio.play();
	else musicAudio.pause()
}
export function goBack(){
	if (!musicAudio.controls) return;
	musicAudio.currentTime -= 1;
}
export function goForward(){
	if (!musicAudio.controls) return;
	musicAudio.currentTime += 1;
}
export const handle = (e)=>{
	switch(e.code){
		case "ArrowLeft": return goBack();
		case "ArrowRight": return goForward();
		case "Space": return togglePlay();
		case "Backspace": return eraseSync();
		case "KeyA": return insertSync();
		case "KeyS": return closeSync();
	}
};