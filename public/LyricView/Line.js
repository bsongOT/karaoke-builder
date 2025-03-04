import {update} from "../update.js"
import {lineSentence} from "../util.js"
import {dataify} from "../util.js"
import {Letter} from "./Letter.js"
import {syncData} from "../context.js"

/**
 * 
 * @param {{lineIndex:number}} info 
 * @returns 
 */
export function Line(info){
    const line = document.createElement("li");
    const view = document.createElement("div");
    const text = document.createElement("textarea");

    line.className = "line";
    text.className = "line-text";
	text.rows = "1";

    line.onclick = function(e){
        if (e.ctrlKey){
            syncData.line(info.lineIndex).forEach(l => l.kind = {
                default: "strong",
                strong: "weak",
                weak: "default"
            }[l.kind])
            line.className = `line ${syncData.at([info.lineIndex, 0]).kind.replace("default", "")}`.trim()
            return;
        }
        if (e.altKey) return;
        view.style.display = "none";
        text.style.display = "block";
        text.focus();
		text.value = lineSentence(info.lineIndex);
    }
    text.onblur = function(){
        view.style.display = "block";
        text.style.display = "none";
    }

    text.oninput = () => {
        const dataLine = syncData.line(info.lineIndex);
        const values = text.value.split("\n").map(v => v.trim()).filter(v => v !== "");
        dataLine.splice(0, dataLine.length);
        dataLine.push(...dataify(values[0]))

        if (values.length > 1)
            syncData.insertLine(info.lineIndex + 1, ...values.slice(1).map(v => dataify(v)));
    }
    
    update(()=> {
        const elementSentence = Array.from(view.children).map(c => c.innerText).join("");
        const dataSentence = lineSentence(info.lineIndex);

        if (elementSentence === dataSentence.trim()) return;

        view.innerHTML = "";
        view.append(...syncData.line(info.lineIndex).map((_, i) => Letter({
            lineIndex: info.lineIndex,
            letterIndex: i
        })))
    })

    line.append(
        view,
        text
    )

    return line;
}