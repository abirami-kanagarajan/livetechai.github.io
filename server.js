import express from "express";
import http from "http";
import { Server } from "socket.io";
import OpenAI from "openai";
import multer from "multer";
import fs from "fs";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const upload = multer({ dest: "uploads/" });

const openai = new OpenAI({
  apiKey: "YOUR_OPENAI_API_KEY"
});

app.use(express.static("public"));

app.post("/transcribe", upload.single("audio"), async (req, res) => {

  const audioFile = req.file.path;

  try {

    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioFile),
      model: "whisper-1"
    });

    const text = response.text;

    io.emit("liveText", text);

    res.json({ text });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }

});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
