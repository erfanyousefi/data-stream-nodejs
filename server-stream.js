const fs = require('fs');
const express = require("express")
const app = express()
const path = require("path")
const music = path.join(__dirname, 'song.mp3'); // filepath
app.use((req, res) => {
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
        res.status(206).header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': content_length,
            'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
        });
        readStream = fs.createReadStream(music, {start, end});
    } else {
        res.header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': stat.size
        });
        readStream = fs.createReadStream(music);
    }
    readStream.pipe(res);
})
app.listen(3600, () => {
    console.log("http://localhost:3600");
})