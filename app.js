const express = require('express');
const fs = require('fs');
const app = express();

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
})

//get the parameters from request (videoId)
app.get('/:videoId', (req, res) => {
	// get the video ID from the request ex. localhost:3000/scottpilgrim 
	// scottpilgrim is the video id that is used in the videopath
    const videoId = req.params.videoId;
	const range = req.headers.range
	//call the videos dynamically from the dropdown list and added to it .mp4 to play the video
	const videoPath = `./videos/${videoId}.mp4`;

	//for streaming the video is split into chunks and you can change the start and end
	const videoSize = fs.statSync(videoPath).size
	const chunkSize = 1 * 1e6;
	const start = Number(range.replace(/\D/g, ""))
	const end = Math.min(start + chunkSize, videoSize - 1)
	const contentLength = end - start + 1;
	const headers = {
		"Content-Range": `bytes ${start}-${end}/${videoSize}`,
		"Accept-Ranges": "bytes",
		"Content-Length": contentLength,
		"Content-Type": "video/mp4"
	}
	res.writeHead(206, headers)
	const stream = fs.createReadStream(videoPath, {
		start,
		end
	})
	stream.pipe(res)

})

//port that the app is listening to
app.listen(3000);
