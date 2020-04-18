import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();
const app = admin.initializeApp()
const ref = app.database().ref()
const bucket = admin.storage().bucket()
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
 export const addText = functions.https.onRequest(async (request, response) => {
     const tsRequest = {
        input: {text: request.query.text},
        // Select the language and SSML voice gender (optional)
        voice: {
            "languageCode": "en-AU",
            "name": "en-AU-Wavenet-D"
          },
        // select the type of audio encoding
        audioConfig: {audioEncoding: 'MP3',
        "pitch": -4.8,
        "speakingRate": 1
    },
      };
  // Performs the text-to-speech request
  const [tsResponse] = await client.synthesizeSpeech(tsRequest);
  let mp3File = bucket.file('output.mp3')
  const options = { // construct the file to write
    metadata: {
      contentType: 'audio/mpeg',
      metadata: {
        source: 'Google Text-to-Speech'
      }
    }
  };
  await mp3File.save(tsResponse.audioContent,options)
  let downURL = await bucket.file('output.mp3').getSignedUrl({
    action: 'read',
    expires: '03-09-2491'
  })
  console.log(downURL)
  //console.log('Audio content written to file: output.mp3');
     ref.child("audio").set(downURL[0])
     response.send('<a href="'+downURL[0]+'">Audio</a>');
 });
