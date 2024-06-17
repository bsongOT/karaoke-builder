import express, { json, urlencoded } from 'express';
import multer, { diskStorage } from "multer";
import convert from "./Music-Remover/controllers/convert.js"
import fetchMR from "./Music-Remover/controllers/fetchMR.js"
import { existsSync, mkdirSync } from "fs";

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

app.listen(8080, function(){
    console.log("listening on 8080");
});