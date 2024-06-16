import {syncData, infos, audio} from "./context.js"

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
	
	current.start = audio.time;

	if (prev && !prev.end) prev.end = current.start;

	infos.currentIndex = syncData.nextIndex(infos.currentIndex);
}
export function closeSync(){
	syncData.prev(infos.currentIndex).end = audio.time;
}
export function togglePlay(){
	if (audio.src === '') return;
	if (audio.paused) audio.play();
	else audio.pause()
}
export function goBack(){
	if (audio.src === '') return;
	audio.time--;
}
export function goForward(){
	if (audio.src === '') return;
	audio.time++;
}