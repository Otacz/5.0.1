import React, { useState } from "react";

function Whisper() {
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);

  const startRecording = async () => {
    setTranscript("");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
      setChunks((prev) => [...prev, e.data]);
    };
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const file = new File([blob], "recording.webm", { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", "whisper-1");

      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: formData
      });
      const data = await response.json();
      setTranscript(data.text || "Žádný přepis");
      setChunks([]);
      setAudioUrl(URL.createObjectURL(blob));
    };
    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>🎤 Přepis hlasu (Whisper)</h2>
      {isRecording ? (
        <button onClick={stopRecording}>⏹️ Zastavit nahrávání</button>
      ) : (
        <button onClick={startRecording}>🎙️ Spustit nahrávání</button>
      )}
      {transcript && <p><strong>Přepis:</strong> {transcript}</p>}
      {audioUrl && <audio controls src={audioUrl}></audio>}
    </div>
  );
}

export default Whisper;