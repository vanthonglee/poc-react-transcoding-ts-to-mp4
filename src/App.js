import React, { useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import './App.css';

function App() {
  const [videoSrc, setVideoSrc] = useState('');
  const [message, setMessage] = useState('Click Start to transcode');
  const ffmpeg = createFFmpeg({
    log: true,
  });
  
  const doTranscode = async () => {
    setMessage('Loading ffmpeg-core.js');
    await ffmpeg.load();
    setMessage('Start transcoding');
    // console.log('fet', await fetchFile('/index.m3u8'))
    // const response = await fetch("https://media1-us-west.cloudokyo.cloud/video/v5/03/c2/28/03c228f5-d816-4e31-a6f8-505335b0f903/master.m3u8");
    ffmpeg.FS('writeFile', 'index.ts', await fetchFile("https://media1-us-west.cloudokyo.cloud/video/v5/03/c2/28/03c228f5-d816-4e31-a6f8-505335b0f903/v360p/segment.ts"));
    await ffmpeg.run('-i', 'index.ts', "-c:v", "libx264", "-c:a", "aac", "-strict", "-2", "-bsf:a", "aac_adtstoasc", "-vcodec", "copy", 'result.mp4');
    setMessage('Complete transcoding');
    const data = await ffmpeg.FS('readFile', 'result.mp4');
    setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })));
  };
  return (
    <div className="App">
      <p/>
      <video src={videoSrc} controls></video><br/>
      { videoSrc && <a href={videoSrc} download="result.mp4">Download</a> }
      <button onClick={doTranscode}>Start</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
