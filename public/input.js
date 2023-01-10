const musicAudio = document.getElementById("audio")
const mrAudio = document.getElementById("audioMR");

document.getElementById("music").addEventListener("change", function(){
    const url = URL.createObjectURL(this.files[0]);
    musicAudio.src = url;
    musicAudio.controls = "true";
    this.remove();
});

document.getElementById("mr").addEventListener("change", function(){
    const url = URL.createObjectURL(this.files[0]);
    mrAudio.src = url;
    mrAudio.controls = "true";
    this.remove();
});

function receiveLyric(){
    const lyricText = document.getElementById("lyric");
    const confirm = document.getElementById("lyric-confirm");
    lyric = lyricText.value;
    lines = lyric.split("\n");
    lyricText.remove();
    confirm.innerText = "완료";
    confirm.disabled = true;
}