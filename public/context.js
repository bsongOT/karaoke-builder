import {Article} from "./data-struct/article.js"
import {LyricView} from "./LyricView/LyricView.js"
import { SceneCanvas } from "./SceneCanvas.js";

const musicAudio = document.getElementById("audio");

export default {
    currentIndex: [0, 0],
    isRunningMode: true,
    syncData: new Article([[{word: " "}]]),

}

export const infos = {
	currentIndex: [0, 0]
}
export let isRunningMode = true;
export const notRunningMode = () => isRunningMode = false;
export const syncData = new Article([[{word: " "}]]);
export const setSyncData = (arr) => syncData.data = arr;

export const audio = {
    get time(){
        return musicAudio.currentTime;
    },
    set time(v){
        musicAudio.currentTime = v;
    },
    get src(){
        return musicAudio.src;
    },
    set src(v){
        musicAudio.src = v;
    },
    get duration(){
        return musicAudio.duration;
    },
    get controls(){
        return musicAudio.controls
    },
    set controls(v){
        musicAudio.controls = true;
    },
    get paused(){
        return musicAudio.paused;
    },
    play: () => musicAudio.play(),
    pause: () => musicAudio.pause(),
    name: ""
}

export const lyricView = LyricView();
export const canvasInfo = {};
export const canvas = SceneCanvas(canvasInfo);
export const draw = canvasInfo.draw;