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
 export const newText = functions.database.ref("/new/{textID}").onCreate(async (snapshot, context)=>{
 
     const tsRequest = {
        input: {text: snapshot.val()},
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
  await mp3File.save(tsResponse.audioContent,options)
  let downURL = await bucket.file(outputFileName).getSignedUrl({
    action: 'read',
    expires: '03-09-2491'
  })
  console.log(downURL)
  //console.log('Audio content written to file: output.mp3');
     ref.child("audio").child(context.params.textID).set({
         text: snapshot.val(),
         url: downURL[0]
     })
     return "OK"
 });
