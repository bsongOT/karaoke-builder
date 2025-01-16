import { spawn } from "child_process";
import fs from "fs";

const mrify = (filename) => {
  return new Promise(resolve => {
    const isExists = fs.existsSync(`workspace/${filename}`);

    if (!isExists) return resolve("File Not Found")

    console.log("processing");

    const spleeter = spawn("spleeter", [
      "separate",
      "-p",
      "spleeter:2stems-16kHz",
      "-o",
      "workspace/",
      `workspace/${filename}`,
    ]);

    spleeter.stderr.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    spleeter.on("close", (code) => {
      console.log(`child process closed with code ${code}`);
      if (code !== 0) return;
      resolve()
    });
  })
};

export default mrify;