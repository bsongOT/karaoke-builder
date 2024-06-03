/**
 * 
 * @param {{lineIndex:number}} info 
 * @returns 
 */
export function Line(info){
    const line = document.createElement("li");
    const view = document.createElement("div");
    const text = document.createElement("textarea");

    line.classList.add("line");
    text.classList.add("line-text");
	text.rows = "1";

    line.onclick = function(){
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
        text.value = values[0];
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