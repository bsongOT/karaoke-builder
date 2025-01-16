import {path} from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg"

const ffmpegPath = path;

const convertToMP3 = (_path) => new Promise(resolve => {
    ffmpeg(_path)
    .setFfmpegPath(ffmpegPath)
    .toFormat("mp3")
    .on('end', () => {
        resolve()
    })
    .save("workspace/mr.mp3")
})

export default convertToMP3