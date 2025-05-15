import React, { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const buildImagePrompt = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("svg")) {
      return `Minimalistic SVG-style line art: ${text}. Vector look, black lines on white background.`;
    }
    if (lower.includes("animovaný") || lower.includes("kreslený") || lower.includes("cartoon")) {
      return `Cartoon-style colorful illustration: ${text}, white background, centered.`;
    }
    return text;
  };

  const sendTextToGPT = async () => {
    setIsLoading(true);
    setImageUrl("");
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo", // změněno z gpt-3.5/gpt-4-preview
        messages: [{ role: "user", content: input }],
      }),
    });
    const data = await res.json();
    setResponse(data.choices?.[0]?.message?.content || "Žádná odpověď.");

    try {
      await addDoc(collection(db, "geriapp-history"), {
        question: input,
        answer: data.choices?.[0]?.message?.content || "Žádná odpověď.",
        createdAt: Timestamp.now()
      });
    } catch (e) {
      console.error("Chyba při ukládání do Firebase:", e);
    }
    setIsLoading(false);
  };

  const generateImage = async () => {
    setIsLoading(true);
    setResponse("");
    const prompt = buildImagePrompt(input);

    try {
      await addDoc(collection(db, "geriapp-history"), {
        question: input,
        answer: "obrázek",
        createdAt: Timestamp.now()
      });
    } catch (e) {
      console.error("Chyba při ukládání do Firebase:", e);
    }

    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 1,
        size: "512x512",
      }),
    });
    const data = await res.json();
    setImageUrl(data.data?.[0]?.url || "");
    setIsLoading(false);
  };

  return (
    <div className="App">
      <h1>GeriApp Chat + Obrázky</h1>
      <textarea
        rows="4"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendTextToGPT();
          }
        }}
        placeholder="Zadej text nebo hlasem..."
      />
      <br />
      <button onClick={sendTextToGPT} disabled={isLoading}>💬 Zeptej se GPT</button>
      <button onClick={generateImage} disabled={isLoading}>🖼️ Vygeneruj obrázek</button>

      {isLoading && <p>Načítání...</p>}

      {response && (
        <p><strong>Odpověď:</strong> {response}</p>
      )}

      {imageUrl && (
        <>
          <img src={imageUrl} alt="Vygenerovaný obrázek" style={{ marginTop: "20px" }} />
          <br />
          <a
            href={imageUrl}
            download="vysledek.png"
            style={{
              display: "inline-block",
              marginTop: "10px",
              padding: "8px 14px",
              backgroundColor: "#007acc",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px"
            }}
          >
            ⬇️ Stáhnout obrázek
          </a>
        </>
      )}
    </div>
  );
}

export default App;
