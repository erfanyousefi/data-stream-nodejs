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
    axios
      .get(INPUT, {
        responseType: "stream",
        adapter: httpAdapter,
        "Content-Range": `bytes 16561-8065611`,
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
});

app.listen(4000, () => {
  console.log("http://localhost:4000");
});