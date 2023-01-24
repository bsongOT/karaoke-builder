document.getElementById("music").addEventListener("change", function(){
    if (step !== 1) return;
    const url = URL.createObjectURL(this.files[0]);
    fileName = this.files[0].name.slice(0, this.files[0].name.lastIndexOf("."));
    musicAudio.src = url;
    musicAudio.controls = "true";
});

document.getElementById("mr").addEventListener("change", function(){
    if (step !== 1) return;
    const url = URL.createObjectURL(this.files[0]);
    mrAudio.src = url;
    mrAudio.controls = "true";
});