/**
 * 
 * @param {{
 *   lineIndex:number, 
 *   letterIndex:number
 * }} info 
 */
export function Letter(info){
    const letter = document.createElement("span");

    update(() => {
        if (!document.contains(letter)) return;
        const data = syncData.at([info.lineIndex, info.letterIndex]);
        
        if (data.word !== letter.innerText) 
            letter.innerText = data.word;
        
		let classNames = ["letter"];
        if (data.start) classNames.push("synced-open")
		if (data.end) classNames.push("synced-close")
		if (info.lineIndex === infos.currentIndex[0] && info.letterIndex === infos.currentIndex[1]) classNames.push("current")
		letter.className = classNames.join(" ");
    })

    return letter;
}