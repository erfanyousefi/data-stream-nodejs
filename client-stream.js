const axios = require("axios");
const httpAdapter = require("axios/lib/adapters/http");
const express = require("express");
const app = express();
const path = require("path")
const music = path.join(__dirname, 'song.mp3'); // filepath
const fs = require("fs")
const INPUT =
  "http://localhost:3600";

app.get("/audio", (req, res) => {
    let stat = fs.statSync(music);
    let range = req.headers.range;
    let readStream;
    if (range !== undefined) {
        let parts = range.replace(/bytes=/, "").split("-");
        let partial_start = parts[0];
        let partial_end = parts[1];
        if ((isNaN(partial_start) && partial_start.length > 1) || (isNaN(partial_end) && partial_end.length > 1)) {
            return res.sendStatus(500);         
        }

        let start = parseInt(partial_start, 10);
        let end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
        let content_length = (end - start) + 1;
        axios
          .get(INPUT, {
            responseType: "stream",
            adapter: httpAdapter,
            "Content-Range": `bytes ${start}-${end}`,
          })
          .then((Response) => {
            const stream = Response.data;
            res.set("content-type", "audio/mp3");
            res.set("accept-ranges", "bytes");
            res.set("content-length", Response.headers["content-length"]);
            console.log(Response);
      
            stream.on("data", (chunk) => {
              res.write(chunk);
            });
      
            stream.on("error", (err) => {
              res.sendStatus(404);
            });
      
            stream.on("end", () => {
              res.end();
            });
          })
          .catch((Err) => {
            console.log(Err.message);
          });
    }
});

app.listen(4000, () => {
  console.log("http://localhost:4000");
});