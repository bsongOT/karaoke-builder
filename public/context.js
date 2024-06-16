import {Article} from "./data-struct/article.js"
import {LyricView} from "./LyricView/LyricView.js"

export const infos = {
    time: 0,
	currentIndex: [0, 0]
}
export let isRunningMode = true;
export const notRunningMode = () => isRunningMode = false;
export const syncData = new Article([[{word: " "}]]);

export const lyricView = LyricView();
export const canvasInfo = {};
export const canvas = SceneCanvas(canvasInfo);