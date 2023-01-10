const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({
    log: true,
    corePath: "public/ffmpeg-core.js"
});

async function convertToMp4(blob){
    await ffmpeg.load();
    ffmpeg.FS("writeFile", "my.webm", await fetchFile(blob));
    await ffmpeg.run("-i", "my.webm", "my.mp4");
    return ffmpeg.FS("readFile", "my.mp4");
}

async function downloadFile(mp4){
    const blob = new Blob([mp4.buffer], {type: "video/mp4"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    document.body.appendChild(a);
    a.download = "my.mp4";
    a.click();
}

function convert(canvas, drawFunc, endTime){
    let stream = canvas.captureStream(60);
    let recordedChunks = [];

    let audio = document.getElementById("audioMR");
    let ctx = new AudioContext();
    let dest = ctx.createMediaStreamDestination();
    let sourceNode = ctx.createMediaElementSource(audio);
    sourceNode.connect(dest);
    sourceNode.connect(ctx.destination);
    let audioTrack = dest.stream.getAudioTracks()[0];

    let finalStream = new MediaStream([audioTrack, stream.getVideoTracks()[0]])
    let recorder = new MediaRecorder(finalStream);

    recorder.start();
    document.getElementById("audio").pause();
    audio.currentTime = 0;
    audio.play();
    recorder.ondataavailable = (e) => {
        recordedChunks.push(e.data);
    }
    recorder.onstop = async () => {
        let blob = new Blob(recordedChunks, {type: "video/webm"});
        let url = URL.createObjectURL(blob);
        
        await downloadFile(await convertToMp4(blob));
        //video.src = url;
    }

    let anim = () => {
        if (audio.paused) return recorder.stop();
        drawFunc(audio.currentTime);
        requestAnimationFrame(anim);
    }

    anim();
}