import express, { json } from "express";
import cors from "cors";
import multer, { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import convert from "./controllers/convert.js";
import fetchMR from "./controllers/fetchMR.js";
import { rootDir } from "./config.js";

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

const app = express();
const port = 8080;

app.use(cors());
app.set('view engine', 'ejs');
app.use(json());

app.get("/", (req, res) => {
  res.sendFile(rootDir + "/index.html");
});

app.post("/convert", upload.any("file"), convert);
app.get("/fetch-mr", fetchMR);

app.listen(port, () =>
  console.log(`Vocals Splitter listening on port ${port}!`)
);
