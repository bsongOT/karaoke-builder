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
	fetchMR(dirname, res)
})
app.post('/zip', upload.any("file"), async (req, res) => {
	const zip = new JSZip();
	
	zip.file("sing-along.mp4", Buffer.from(readFileSync("./workspace/sing-along.mp4")));
	zip.file("karaoke.mp4", Buffer.from(readFileSync("./workspace/karaoke.mp4")));
	zip.file("music.mp3", Buffer.from(readFileSync("./workspace/music.mp3")));
	zip.file("mr.mp3", Buffer.from(readFileSync("./workspace/mr.mp3")));
	zip.file("sync.json", Buffer.from(readFileSync("./workspace/sync.json")));

	const zipBlob = await zip.generateAsync({type: 'blob'});
	createWriteStream("workspace/zip.zip").write(Buffer.from(await zipBlob.arrayBuffer()), () => {
		res.status(200).sendFile(import.meta.dirname + "/workspace/zip.zip")
	})
})

app.listen(8080, function(){
    console.log("listening on 8080");
});