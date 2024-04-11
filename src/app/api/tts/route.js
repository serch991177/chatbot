import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { PassThrough } from "stream";

export async function GET(req){
    // WARNING: Do not expose your keys
    // WARNING: If you host publicly your project, add an authentication layer to limit the consumption of Azure resources

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env["SPEECH_KEY"],
    process.env["SPEECH_REGION"]
  );
    
  // https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts
  //ja-JP-NanamiNeural (Female)
  //es-BO-SofiaNeural
  //es-US-PalomaNeural (Female)
  //en-US-JennyNeural (Female)
  const teacher = req.nextUrl.searchParams.get("teacher") || "Sofia";
  speechConfig.speechSynthesisVoiceName = `es-BO-${teacher}Neural`;

  const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);
  const visemes = [];
  speechSynthesizer.visemeReceived = function (s, e){
    /*console.log(
        "(Viseme), Audio offset: " +
        e.audioOffset / 10000 +
        "ms. Viseme ID: " +
        e.visemeId
    );*/
    visemes.push([e.audioOffset / 10000,e.visemeId]);
  };    

  const audioStream = await new Promise((resolve,reject)=>{
    speechSynthesizer.speakTextAsync(
        req.nextUrl.searchParams.get("text") || 
        "Hola Como estas, Lo siento por el momento no tengo informacion sobre la pregunta",
        (result) => {
            const { audioData } = result;
            speechSynthesizer.close();
            //convert arraybuffer to stream
            const bufferStream = new PassThrough();
            bufferStream.end(Buffer.from(audioData));
            resolve(bufferStream);
        },
        (error) => {
            console.log(error);
            speechSynthesizer.close();
            reject(error);
        }
    );
  });

  const response = new Response(audioStream,{
    headers:{
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `inline; filename=tts.mp3`,
        Visemes: JSON.stringify(visemes),
    },
  });
  return response;

}