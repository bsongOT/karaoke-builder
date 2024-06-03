import {update} from "../update.js"
import {Line} from "./Line.js"
import {syncData} from "../context.js"

export function LyricView(){
    const lyricView = document.querySelector("#lyric")
    let childPairs = [];

    update(() => {
        if (childPairs.length < syncData.lastIndex[0] + 1) {
            childPairs.push(
                ...Array(syncData.lastIndex[0] + 1 - childPairs.length).fill(0).map((_, i) => {
                const cinfo = {lineIndex: i};
                return {
                    element: Line(cinfo),
                    info: cinfo
                }
            }))
        }
        else if (childPairs.length > syncData.lastIndex[0] + 1) {
            childPairs.splice(childPairs.length - 1, childPairs.length - syncData.lastIndex[0] - 1);
        }
        for (let i = 0; i < childPairs.length; i++){
            childPairs[i].info.lineIndex = i;
        }
        if (lyricView.children.length !== childPairs.length){
            lyricView.innerHTML = "";
            lyricView.append(...childPairs.map(c => c.element))
        }
    })

    return lyricView;
}