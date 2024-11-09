const { OpenAI } = require('openai');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function downloadAudio(url) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  const tempPath = path.join(__dirname, '../temp', `audio-${Date.now()}.mp3`);
  const writer = fs.createWriteStream(tempPath);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(tempPath));
    writer.on('error', reject);
  });
}

async function transcribeAudio(audioUrl) {
  try {
    const audioPath = await downloadAudio(audioUrl);
    
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
    });

    // Clean up temporary file
    fs.unlink(audioPath, (err) => {
      if (err) console.error('Error deleting temporary file:', err);
    });

    return transcription.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}

module.exports = { transcribeAudio };