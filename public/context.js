import {Article} from "./data-struct/article.js"

export const infos = {
    time: 0,
	currentIndex: [0, 0]
}
export let isRunningMode = true;
export const notRunningMode = () => isRunningMode = false;
export let syncData = new Article([[{word: " "}]]); //obsolete