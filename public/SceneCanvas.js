import { update } from "./update.js";
import { syncData, isRunningMode } from "./context.js";
import { lineSentence, lineSentenceWidth } from "./util.js";

export function SceneCanvas(canvasInfo) {
	const canvas = document.querySelector("#canvas");
	const cx = canvas.getContext("2d");
	const font = new FontFace("Happiness", "url(public/fonts/Happiness-Sans-Title.woff2)");

	async function ready() {
		await font.load();

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
		if (!sync?.start) {
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
		cx.fillStyle = "#ddd";
		const syncArr = syncData.data.flat(1);
		for (let i = 0; i < syncArr.length; i++){
			cx.rect(
				400 + (syncArr[i].start - time) * barSpeed,
				30 + 15 * (i % 3),
				((syncArr[i].end ?? time) - syncArr[i].start) * barSpeed,
				10
			);
		}
		cx.fill();
		cx.closePath();

		cx.beginPath();
		cx.fillStyle = "gold";
		for (let i = 0; i < syncArr.length; i++){
			cx.rect(
				400 + (syncArr[i].start - time) * barSpeed,
				30 + 15 * (i % 3),
				Math.max(Math.min(syncArr[i].end, time) - syncArr[i].start, 0) * barSpeed,
				10
			);
		}
		cx.fill();
		cx.closePath();

		cx.beginPath();
		cx.fillStyle = "black";
		cx.rect(398, 25, 2, 55);
		cx.fill();
		cx.closePath();

		cx.beginPath();
		cx.globalCompositeOperation = "destination-over";
		cx.fillStyle = "white";
		cx.fillRect(0, 0, canvas.width, canvas.height);
		cx.closePath();
	}

	update(() => {
		if (!isRunningMode) return;
		draw(audio.currentTime);
	});

	return canvas;
}
