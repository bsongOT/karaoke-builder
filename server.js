import express, { json, urlencoded } from 'express';
import multer, { diskStorage } from "multer";
import convert from "./Music-Remover/controllers/convert.js"
import fetchMR from "./Music-Remover/controllers/fetchMR.js"
import { existsSync, createWriteStream, mkdirSync, readFileSync } from "fs";
import JSZip from 'jszip';

const app = express();

const storage = diskStorage({
	filename: function (req, file, cb) {
	  cb(null, file.originalname)
	},
	destination: function (req, file, cb) {
	  if (!existsSync("./workspace")) mkdirSync("./workspace");
	  cb(null, './workspace')
	},
  })  
const upload = multer({ storage })

app.use("/public", express.static('./public/'));
app.use("/public/jszip", express.static("./node_modules/jszip"))
app.use(json({ limit : "50mb" }));
app.use(urlencoded({ limit:"50mb", extended: false }));

app.get('', function(req, res){
    const dirname = import.meta.dirname;
	res.sendFile(dirname + "/public/index.html");
});

app.post('/remove-vocal', upload.any("file"), convert)
app.get('/fetch-mr', (req, res) => {
	const dirname = import.meta.dirname + "/workspace/mr.mp3";
	if (!existsSync(dirname)) return res.status(200).json({message: "Not ready mr yet"});
	fetchMR(dirname, res)
})
app.post('/post-file', upload.any("file"), (req, res) => {
	res.status(200).json({message: "success to post file"});
})
app.get('/zip', async (req, res) => {
	if (!existsSync("./workspace/sing-along.mp4")) return res.status(200).json({message: "sing-along.mp4 doesn't exist"})
	if (!existsSync("./workspace/karaoke.mp4")) return res.status(200).json({ message: "karaoke.mp4 doesn't exist" })
	if (!existsSync("./workspace/music.mp3")) return res.status(200).json({ message: "music.mp3 doesn't exist" })
	if (!existsSync("./workspace/mr.mp3")) return res.status(200).json({ message: "mr.mp3 doesn't exist" })
	if (!existsSync("./workspace/sync.json")) return res.status(200).json({ message: "sync.json doesn't exist" })	

	const zip = new JSZip();
	
	zip.file("sing-along.mp4", Buffer.from(readFileSync("./workspace/sing-along.mp4")));
	zip.file("karaoke.mp4", Buffer.from(readFileSync("./workspace/karaoke.mp4")));
	zip.file("music.mp3", Buffer.from(readFileSync("./workspace/music.mp3")));
	zip.file("mr.mp3", Buffer.from(readFileSync("./workspace/mr.mp3")));
	zip.file("sync.json", Buffer.from(readFileSync("./workspace/sync.json")));

	const zipBlob = await zip.generateAsync({type: 'blob'});
	createWriteStream("workspace/zip.zip").write(Buffer.from(await zipBlob.arrayBuffer()), () => {
		res.status(200).sendFile(import.meta.dirname + "/workspace/zip.zip")
		res.on("finish", () => {
			fs.rmSync("workspace", {recursive: true});
		})
	})
})

app.listen(8080, function(){
    console.log("listening on 8080");
});