const fs = require("fs")
const express = require('express');
const app = express();

app.use("/public", express.static('./public/'));
app.use(express.json({ limit : "50mb" }));
app.use(express.urlencoded({ limit:"50mb", extended: false }));

app.listen(8080, function(){
    console.log("listening on 8080");
});

app.post('/convert', function(req, res){
	const dataURLs = req.body;
	console.log(req.body)
	//fs.writeFileSync('processing_images/scene0.png', new Buffer(dataURLs[0], 'base64'));
	
	/*
	const ffmpeg = require('fluent-ffmpeg');
	
	ffmpeg()
		.input("./processing_images/image%1d.jpg")
		.save("./test.mp4")
		.outputFPS(1)
		.frames(2)
		.on('end', () => {
			console.log("done");
		});*/
	
	res.status(200).json({
		message: "download complete"
	})
})

app.get('', function(req, res){
    res.sendFile(__dirname + "/public/index.html");
});
