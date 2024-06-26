import { syncData, notRunningMode, draw, audio, canvas } from "./context.js"
import { FFmpeg } from "./assets/ffmpeg/package/dist/esm/index.js";
import { fetchFile } from "./assets/util/package/dist/esm/index.js"

const ffmpeg = new FFmpeg()

export async function convert(events){
	notRunningMode();
	let message = "";
    const mrBlob = await getMR();
	const blobs = await getBlobs(events);
	await ffmpeg.load({
		coreURL: "/public/assets/core/package/dist/esm/ffmpeg-core.js"
	});
	ffmpeg.on("progress", ({progress}) => {
		events?.onProgress?.({
			percent: Math.min(1, progress),
			message: message
		});
	})
	await ffmpeg.writeFile('music.mp3', await fetchFile(audio.src))
	await ffmpeg.writeFile("mr.mp3", await fetchFile(mrBlob))
	await ffmpeg.createDir("./scenes")
	for (let i = 0; i < blobs.length; i++){
		await ffmpeg.writeFile(`./scenes/scene${("0000" + i).slice(-5)}.jpg`, await fetchFile(blobs[i]))
	}
	
	const animationCommand = `-framerate 24 -start_number 1 -i ./scenes/scene%05d.jpg -c:v libx264 animation.mp4`;
	const singAlongCommand = '-i animation.mp4 -i music.mp3 singalong.mp4';
	const karaokeCommand = "-i animation.mp4 -i mr.mp3 karaoke.mp4"

	message = "(2/4) Converting frames to video..."
	await ffmpeg.exec(animationCommand.split(" "));
	message = "(3/4) Creating a sing-along(music + frames) video..."
	await ffmpeg.exec(singAlongCommand.split(" "));
	message = "(4/4) Creating a karaoke(mr + frames) video..."
	await ffmpeg.exec(karaokeCommand.split(" "));

	const singAlong = await ffmpeg.readFile("singalong.mp4");
	const karaoke = await ffmpeg.readFile("karaoke.mp4");

	return {
		singAlong: new Blob([singAlong.buffer], { type: "video/mp4" }),
		karaoke: new Blob([karaoke.buffer], { type: "video/mp4" }),
		music: await (await fetch(audio.src)).blob(),
		mr: mrBlob,
		syncData: await getSyncDataBlob()
	}
}

function toBlobAsync(canvas){
	return new Promise((resolve) => {
		canvas.toBlob(resolve, "image/jpeg")
	})
}
async function getBlobs(events){
	const blobs = [];
	const deadline = audio.duration;
	const message = "(1/4) Fetching frames...";
	const frameCount = Math.floor(deadline * 24);

	for (let i = 0; i < frameCount; i++){
		draw(i / 24)
		blobs.push(await toBlobAsync(canvas));
		events?.onProgress?.({
			percent: i / frameCount,
			message: message
		})
	}
	
	return blobs;
}

async function getMR(){
	const mrRes = await fetch("/fetch-mr");

	return mrRes.blob();
}

export async function getSyncDataBlob(){
	const syncRes = await fetch("data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(syncData.data)));

	return syncRes.blob();
}