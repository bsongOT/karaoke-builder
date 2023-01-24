const canvas = document.getElementById("canvas");
const cx = canvas.getContext("2d");
const canvas2 = document.getElementById("canvas2");
const cx2 = canvas2.getContext("2d");
const playbar = document.getElementById("playbar");
const musicAudio = document.getElementById("audio");
const mrAudio = document.getElementById("audioMR");
const containers = document.getElementsByClassName("container");
const steps = document.querySelectorAll(".step");
const stepEdges = document.querySelectorAll(".step-edge");
const lyricText = document.getElementById("lyric");
const confirm = document.getElementById("lyric-confirm");
const lyricPanel = document.getElementById("lyric-panel");
const convertProgress = document.getElementById("convert-progress");
const downloadProgress = document.getElementById("download-progress");

let step = 1;

let isAllowedNext = [
    () => musicAudio.controls && mrAudio.controls,
    () => lyricText.value.trim() !== "",
    () => true
]

const load = [
    () => {},
    () => {},
    () => {
        lyricPanel.innerHTML = syncData.map(l => 
            '<div class="line">' + 
            l.map(s => s.word).join("") + 
            '</div><br>'
        ).join("");
        document.querySelector(".line").classList.add("current");

        syncLine.insertAdjacentHTML("beforeend", `<div class="measure"></div>`)
        for (let i = 0; i < syncData.at(0).length; i++){
            syncLine.children[0].insertAdjacentHTML("beforeend", `<span class="word">${syncData.at([0, i]).word.trim()}</span>`);
            syncLine.children[0].lastElementChild.style.left = 28 * i + "px";
        }
        let tid2 = setInterval(() => {
            if (step !== 3) return clearInterval(tid2);

            const time = musicAudio.currentTime;
            playbar.style.left = (260 * time % 1300) + "px";
            syncLine.style.left = -1300 * Math.floor(time / 5) + "px";

            if (tindex[0] === 0 && tindex[1] === 0) return;

            const prevIndex = syncData.prevIndex(tindex);
            const prev = syncLine.children[prevIndex[0]].children[prevIndex[1]];
            const prevData = syncData.prev(tindex);

            const lines = Array.from(lyricPanel.querySelectorAll(".line"));
            const obsoleteIndex = lines.findIndex(e => e.classList.contains("current"));
            if (obsoleteIndex !== tindex[0]){
                lines[obsoleteIndex]?.classList?.remove("current");
                lines[tindex[0]]?.classList?.add("current");
            }
            prev.style.left = (260 * prevData.start) + "px";
            prev.style.width = (260 * ((prevData.end ?? time) - prevData.start)) + "px";
        }, 25);
    },
    () => {}
]

function nextStep(){
    if (!isAllowedNext[step - 1]()) return alert("잘못된 입력입니다.");
    
    containers[step - 1].style.display = "none";

    if (step === 2) containers[step].style.display = "grid";
    else containers[step].style.display = "block";

    steps[step].style.background = "greenyellow";
    if (stepEdges[step]) stepEdges[step].style.background = "greenyellow";

    load[step]();
    
    step++;
}