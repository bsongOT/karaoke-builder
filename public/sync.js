const syncLine = document.getElementById("syncs");

function eraseSync(){
	if (infos.currentIndex[0] === 0 && infos.currentIndex[1] === 0) return;

	infos.currentIndex = syncData.prevIndex(infos.currentIndex);
	
	syncData.at(infos.currentIndex).start = undefined;
	syncData.at(infos.currentIndex).end = undefined;
}
function insertSync(){
	const current = syncData.at(infos.currentIndex);
	const prev = syncData.prev(infos.currentIndex);
	
	if (!current) return;
	
	current.start = musicAudio.currentTime;

	if (prev && !prev.end) prev.end = current.start;

	infos.currentIndex = syncData.nextIndex(infos.currentIndex);
}
function closeSync(){
	syncData.prev(infos.currentIndex).end = musicAudio.currentTime;
}
function togglePlay(){
	if (!musicAudio.controls) return;
	if (musicAudio.paused) musicAudio.play();
	else musicAudio.pause()
}
function goBack(){
	if (!musicAudio.controls) return;
	musicAudio.currentTime -= 1;
}
function goForward(){
	if (!musicAudio.controls) return;
	musicAudio.currentTime += 1;
}
const handle = (e)=>{
	switch(e.code){
		case "ArrowLeft": return goBack();
		case "ArrowRight": return goForward();
		case "Space": return togglePlay();
		case "Backspace": return eraseSync();
		case "KeyA": return insertSync();
		case "KeyS": return closeSync();
	}
};
document.addEventListener("keydown", handle);