let font = new FontFace("Happiness", "url(public/fonts/Happiness-Sans-Title.woff2)");
let textXs;
let tid;
let fileName = "my";

function showResult() {
    font.load().then(() => {
        document.fonts.add(font);
        cx.font = "60px Happiness";
        cx.lineWidth = 4;
        cx2.font = "60px Happiness";
        cx2.lineWidth = 4;
        textXs = lines.map(s => (canvas.width - cx.measureText(s).width) / 2)
        tid = setInterval(()=>draw(audio.currentTime, canvas, cx), 25);
    }).catch(console.log);
}

function convertClick(){
    clearInterval(tid);

    nextStep();
    convert(canvas2, draw, document.getElementById("audio").duration, fileName);
}

const draw = (time, canvas, cx) => {
    cx.clearRect(0, 0, canvas.width, canvas.height);
    cx.beginPath();

    let idx = syncData.findIndex(a => a.end > time);
    if (idx[0] !== 0 && idx[1] !== 0 && time < syncData.at(idx)?.start) idx = syncData.prevIndex(idx);
    if (idx[1] < 0) idx = syncData.lastIndex;

    const word = syncData.at(idx);
    const beforeIdx = syncData.prevIndex(idx);
    const beforeWord = syncData.sentence(beforeIdx);
    const currentWord = syncData.sentence(idx).trimEnd();
    let before = cx.measureText(beforeWord).width;
    let now = cx.measureText(currentWord).width;

    if (beforeIdx[0] !== idx[0]) before = 0;

    const ratio = Math.min(1, (time - word.start) / (word.end - word.start));
    const progressWidth = before + (now - before) * ratio;

    cx.rect(textXs[idx[0]], 170 + 150 * (idx[0] % 2), progressWidth, 120);
    cx.fill();

    cx.globalCompositeOperation = "source-in";
    cx.fillStyle = "yellow";
    cx.fillText(lines[idx[0]], textXs[idx[0]], 250 + 150 * (idx[0] % 2));

    cx.globalCompositeOperation = "destination-over";
    cx.fillStyle = "white";
    cx.strokeStyle = "black";
    cx.fillText(lines[idx[0] + idx[0] % 2], textXs[idx[0] + idx[0] % 2], 250);
    cx.strokeText(lines[idx[0] + idx[0] % 2], textXs[idx[0] + idx[0] % 2], 250);
    cx.fillText(lines[idx[0] + 1 - idx[0] % 2], textXs[idx[0] + 1 - idx[0] % 2], 400);
    cx.strokeText(lines[idx[0] + 1 - idx[0] % 2], textXs[idx[0] + 1 - idx[0] % 2], 400);
}