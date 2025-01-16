import { rootDir } from "../config.js";
import convertToMP3 from "./convertToMP3.js";
import mrify from "./mrify.js";
import { rmSync } from "fs";

const convert = async (req, res) => {
  const filename = req.files[0].filename;
  const simpleName = filename.slice(0, filename.lastIndexOf('.'));
  const mrPath = `${rootDir}/workspace/${simpleName}/accompaniment.wav`;
  
  await mrify(filename);
  await convertToMP3(mrPath);
  rmSync(`workspace/${simpleName}`, {recursive: true});
};

export default convert;
