const convertProgress = document.getElementById("convert-progress");
const downloadProgress = document.getElementById("download-progress");

/*
const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({
    log: false,
    corePath: "public/ffmpeg-core.js"
});*/
/*
async function convertToMp4(blob, fileName, duration){
    await ffmpeg.load();
    ffmpeg.FS("writeFile", "my.webm", await fetchFile(blob));
    
    const progress = downloadProgress.querySelector(".progress");
    ffmpeg.setLogger(({message}) => {
        if (!message.startsWith("frame=")) return;
        const frame = message.slice(message.indexOf("frame=") + 6, message.indexOf("fps=")).trim();
        
        progress.style.width = 100 * Number(frame) / (60 * duration) + "%";
    })
    await ffmpeg.run("-i", "my.webm", `${fileName}.mp4`);
    return ffmpeg.FS("readFile", `${fileName}.mp4`);
}*/

async function downloadFile(mp4, fileName){
    const blob = new Blob([mp4.buffer], {type: "video/mp4"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    document.body.appendChild(a);
    a.download = `${fileName}.mp4`;
    a.click();
}

/*
function convert(canvas, drawFunc, endTime, fileName){
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
        const blob = new Blob(recordedChunks, {type: "video/webm"});
        
        await downloadFile(await convertToMp4(blob, fileName, audio.duration), fileName);
    }

    const cx = canvas.getContext("2d")
    const progress = convertProgress.querySelector(".progress");
    
    let anim = () => {
        if (audio.paused) return recorder.stop();

        progress.style.width = 100 * audio.currentTime / audio.duration + "%";
        drawFunc(audio.currentTime, canvas, cx);
        requestAnimationFrame(anim);
    }

    anim();
}*/