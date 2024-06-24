import lamejs from "lamejs";

const handleCompressAudio = async ({ music, download }) => {
  const startTime = performance.now(); // Catat waktu mulai
  let fileSizeInBytes = 0;

  const encodeAudioBufferLame = async (audioBuffer) => {
    var mp3encoder = new lamejs.Mp3Encoder(2, audioBuffer.sampleRate, 128); // Stereo, 128 kbps

    var mp3Data = [];

    const [left, right] = [
      audioBuffer.getChannelData(0),
      audioBuffer.getChannelData(1),
    ];

    // The transformed data, this is what you will pass to lame instead
    // If you are sure to use a Float32Array you can skip this and use [left, right] const.
    const l = new Float32Array(left.length);
    const r = new Float32Array(right.length);

    // Convert to required format
    for (let i = 0; i < left.length; i++) {
      l[i] = left[i] * 32767.5;
      r[i] = right[i] * 32767.5;
    }

    const sampleBlockSize = 1152; // Can be anything but make it a multiple of 576 to make encoders life easier

    for (let i = 0; i < l.length; i += sampleBlockSize) {
      const leftChunk = l.subarray(i, i + sampleBlockSize);
      const rightChunk = r.subarray(i, i + sampleBlockSize);

      let mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);

      if (mp3buf.length > 0) {
        mp3Data.push(new Int8Array(mp3buf));
      }
    }

    let mp3buf = mp3encoder.flush(); // Finish writing mp3

    if (mp3buf.length > 0) {
      mp3Data.push(new Int8Array(mp3buf));
    }

    return mp3Data;
  };
  try {
    // Create an audio context
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    // Read the file as array buffer
    const fileData = await music.arrayBuffer();

    // Decode the audio data
    const audioBuffer = await audioContext.decodeAudioData(fileData);

    // Encode audio data using lamejs
    const mp3Data = await encodeAudioBufferLame(audioBuffer);

    // Create a Blob from the encoded MP3 data
    const processedBlob = new Blob(mp3Data, { type: "audio/mpeg" });
    fileSizeInBytes += processedBlob.size;

    if (download) {
      // Create a downloadable URL
      const url = window.URL.createObjectURL(processedBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = new Date().getTime() + ".mp3"; // Set the download filename
      link.click();
    }
    const endTime = performance.now(); // Catat waktu selesai
    const compressionTime = (endTime - startTime) / 1000; // Hitung waktu kompresi dalam detik

    console.log(compressionTime);
    return {
      originalName: [music.name],
      compressedName: [`compressed_${music.name}.mp3`], // Ubah ekstensi sesuai dengan file audio
      originalSize: [music.size.toFixed(2) / 1024], // Konversi ke KB
      compressedSize: [fileSizeInBytes / 1024], // Konversi ke KB
      compressionTime: [compressionTime.toFixed(2)],
    };
  } catch (error) {
    console.error("Error compressing music:", error);
  }
};

export default handleCompressAudio;
