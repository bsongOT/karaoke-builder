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


function convert(dataURLs){
    
}