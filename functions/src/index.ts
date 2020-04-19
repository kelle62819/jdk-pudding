import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
var AudioContext = require('web-audio-api').AudioContext
  , audioCtx = new AudioContext
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();
const app = admin.initializeApp()
const ref = app.database().ref()
const bucket = admin.storage().bucket()

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
 export const newText = functions.database.ref("/new/{textID}").onCreate(async (snapshot, context)=>{
 
     const tsRequest = {
        input: {ssml: snapshot.val()},
        // Select the language and SSML voice gender (optional)
        voice: {
            "languageCode": "fr-FR",
            "name": "fr-FR-Wavenet-B"
          },
        // select the type of audio encoding
        audioConfig: {audioEncoding: 'MP3',
        "pitch": -1.6,
        "speakingRate": 0.93
    },
      };
  // Performs the text-to-speech request
  const [tsResponse] = await client.synthesizeSpeech(tsRequest);

  let outputFileName = context.params.textID + '.mp3';
  let mp3File = bucket.file(outputFileName)
  const options = { // construct the file to write
    metadata: {
        contentType: 'audio/mpeg',
        metadata: {
            source: 'Google Text-to-Speech'
        }
    }
};
//console.log(tsResponse.audioContent.data.length)
//tsResponse.audioContent.data = null
//console.log(tsResponse.audioContent)

audioCtx.decodeAudioData(tsResponse.audioContent, (audioBuffer:any)=>{
  ref.child("audio").child(context.params.textID).update({
    wave: filterData(audioBuffer)
  })
})
await mp3File.save(tsResponse.audioContent,options)
let downURL = await bucket.file(outputFileName).getSignedUrl({
    action: 'read',
      expires: '03-09-2491'
    })
    //console.log('Audio content written to file: output.mp3');

     ref.child("audio").child(context.params.textID).update({
         text: snapshot.val(),
         url: downURL[0]
     })
     return "OK"
 });

 const filterData = (audioBuffer: AudioBuffer)=> {
    const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
    console.log(audioBuffer.duration)
    const samples = Math.ceil(audioBuffer.duration*10); // Number of samples we want to have in our final data set
    const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
    const filteredData = [];
    for (let i = 0; i < samples; i++) {
      let blockStart = blockSize * i; // the location of the first sample in the block
      let sum = 0;

      for (let j = 0; j < blockSize; j++) {
        sum = sum + Math.abs(rawData[blockStart + j]) // find the sum of all the samples in the block
      }
      filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
    }
    return normalizeData(filteredData);
  }

  const normalizeData = (filteredData:any) => {
    const multiplier = Math.pow(Math.max(...filteredData), -1);
    return filteredData.map((n:number) => n * multiplier);
  }