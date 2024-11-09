import OpenAI from 'openai';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { Readable } from 'stream';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function transcribeAudio(audioUrl) {
  try {
    const response = await fetch(audioUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch audio file');
    }
    
    const buffer = await response.arrayBuffer();
    const stream = Readable.from(Buffer.from(buffer));
    const formData = new FormData();
    
    formData.append('file', stream, {
      filename: 'audio.mp3',
      contentType: 'audio/mp3'
    });
    formData.append('model', 'whisper-1');

    const transcription = await openai.audio.transcriptions.create({
      file: formData.get('file'),
      model: "whisper-1",
    });

    return transcription.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}