export function SlideShow(){
	const img = document.createElement("img");
	const dataURLs = [];

	for (let i = 0; i < Math.floor(musicAudio.duration * 24); i++){
		draw(i / 24, canvas, cx)
		dataURLs.push(canvas.toDataURL("image/jpeg", 0.1))
	}
	update(() => {
		if (isRunningMode) return;
		img.src = dataURLs[Math.floor(musicAudio.currentTime * 24)]
	})
	
	return img;
}