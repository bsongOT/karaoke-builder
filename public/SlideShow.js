export function SlideShow(){
	const img = document.createElement("img");
	const dataURLs = getDataURLs();
	
	update(() => {
		if (isRunningMode) return;
		img.src = dataURLs[Math.floor(musicAudio.currentTime * 24)]
	})
	
	return img;
}