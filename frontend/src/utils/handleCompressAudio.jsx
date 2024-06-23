import lamejs from "lamejs";

const handleCompressAudio = async ({ music, percentageAudio }) => {
  const encodeAudioBufferLame = async (audioBuffer) => {
    var mp3encoder = new lamejs.Mp3Encoder(2, audioBuffer.sampleRate, 128); // 44100 is replaced. It needs the real AudioBuffer sample rate. In my test case 48000.

    var mp3Data = [];

    const [left, right] = [
      audioBuffer.getChannelData(0),
      audioBuffer.getChannelData(1),
    ];

    // The transformed data, this is what you will pass to lame instead
    // If you are sure to use a Float32Array you can skip this and use [left, right] const.
    const l = new Float32Array(left.length);
    const r = new Float32Array(right.length);

    //Convert to required format
    for (let i = 0; i < left.length; i++) {
      l[i] = left[i] * 32767.5;
      r[i] = right[i] * 32767.5;
    }

    const sampleBlockSize = 1152; //can be anything but make it a multiple of 576 to make encoders life easier

    for (let i = 0; i < l.length; i += sampleBlockSize) {
      const leftChunk = l.subarray(i, i + sampleBlockSize);
      const rightChunk = r.subarray(i, i + sampleBlockSize);

      let mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);

      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }
    }
    let mp3buf = mp3encoder.flush(); //finish writing mp3

    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }

    return mp3Data;
  };
  try {
    // Create an audio context
    console.log("run");
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    // Read the file as array buffer
    const fileData = await music.arrayBuffer();

    // Decode the audio data
    const audioBuffer = await audioContext.decodeAudioData(fileData);
    encodeAudioBufferLame(audioBuffer);

    // Initialize MP3 encoder
    const encoder = new lamejs.Mp3Encoder(1, audioBuffer.sampleRate, 128); // Mono, 44.1 kHz, 128 kbps

    // Initialize variables
    const samples = audioBuffer.getChannelData(0); // Assuming mono audio
    const sampleBlockSize = 1152; // MP3 frame size
    const mp3Data = [];

    // Encode audio data
    for (let i = 0; i < samples.length; i += sampleBlockSize) {
      const sampleChunk = samples.subarray(i, i + sampleBlockSize);
      const mp3buf = encoder.encodeBuffer(sampleChunk);
      if (mp3buf.length > 0) {
        mp3Data.push(new Int8Array(mp3buf));
      }
    }

    // Finalize encoding
    const finalMp3buf = encoder.flush();
    if (finalMp3buf.length > 0) {
      mp3Data.push(new Int8Array(finalMp3buf));
    }

    // Create a Blob from the encoded MP3 data
    const processedBlob = new Blob(mp3Data, { type: "audio/mpeg" });
    console.log("run");

    // Create a downloadable URL
    const url = window.URL.createObjectURL(processedBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = new Date().getTime() + ".mp3"; // Set the download filename
    link.click();
    console.log("done");
  } catch (error) {
    console.error("Error compressing music:", error);
  }
};

export default handleCompressAudio;
