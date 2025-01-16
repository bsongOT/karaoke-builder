import fs from "fs";
import { rootDir } from "../config.js";

const fetchMR = async (req, res) => {
  res.sendFile(rootDir + `/workspace/mr.mp3`);
  res.on("finish", () => {
    fs.rmSync("workspace", {recursive: true});
  })
};

export default fetchMR;
