const fs = require("fs")
const express = require('express');
const app = express();
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);

app.use("/public", express.static('./public/'));
app.use("/node_modules/buffer", express.static('./buffer/'));
app.use(express.json({ limit : "50mb" }));
app.use(express.urlencoded({ limit:"50mb", extended: false }));

app.listen(8080, function(){
    console.log("listening on 8080");
});

app.post('/convert', function(req, res){
	const dataURLs = req.body;
	
	if (!fs.existsSync("processing_images")) fs.mkdirSync("processing_images");
	for (let i = 0; i < dataURLs.length; i++){
		fs.writeFileSync(`processing_images/scene${("00000" + i).slice(-5)}.jpg`, Buffer.from(dataURLs[i].split(",")[1], 'base64'));
	}
	
	ffmpeg()
		.input("./processing_images/scene%05d.jpg")
		.save("./test.mp4")
		.fps(24)
		.frames(dataURLs.length)
		.on('end', () => {
			fs.rmSync("./processing_images", { recursive: true });
			ffmpeg()
				.addInput("./test.mp4")
				.addInput("./audio.mp3")
				.save("./test2.mp4")
			res.status(200).json({
				message: "download complete"
			})
		})
		.on('error', (err) => {
			fs.rmSync("./processing_images", { recursive: true });
			console.log(err);
		});
})

app.get('', function(req, res){
    res.sendFile(__dirname + "/public/index.html");
});
