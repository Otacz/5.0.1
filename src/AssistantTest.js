import React, { useState } from "react";
import { getAssistantReply } from "./getAssistantReply";

const AssistantTest = () => {
  const [userId, setUserId] = useState("test-user");
  const [chatId, setChatId] = useState("test-chat");
  const [systemPrompt, setSystemPrompt] = useState("Jsi přátelský asistent.");
  const [memory, setMemory] = useState("");
  const [messages, setMessages] = useState([
    { role: "user", content: "Ahoj, co umíš?" },
  ]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRunTest = async () => {
    setLoading(true);
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    try {
      const assistantReply = await getAssistantReply(
        userId,
        chatId,
        systemPrompt,
        memory,
        messages,
        apiKey
      );
      setReply(assistantReply);
    } catch (error) {
      console.error("Chyba při testu asistenta:", error);
      setReply("Chyba při volání asistenta.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Test asistenta</h2>
      <label>System Prompt:</label>
      <textarea
        rows={2}
        value={systemPrompt}
        onChange={(e) => setSystemPrompt(e.target.value)}
        style={{ width: "100%" }}
      />

      <label>Memory:</label>
      <textarea
        rows={2}
        value={memory}
        onChange={(e) => setMemory(e.target.value)}
        style={{ width: "100%" }}
      />

      <label>Messages (JSON):</label>
      <textarea
        rows={4}
        value={JSON.stringify(messages, null, 2)}
        onChange={(e) => {
          try {
            setMessages(JSON.parse(e.target.value));
          } catch {}
        }}
        style={{ width: "100%", fontFamily: "monospace" }}
      />

      <button onClick={handleRunTest} disabled={loading} style={{ marginTop: "1rem" }}>
        {loading ? "Načítám..." : "Spustit test"}
      </button>

      <h3>Odpověď:</h3>
      <pre style={{ background: "#f4f4f4", padding: "1rem" }}>{reply}</pre>
    </div>
  );
};

export default AssistantTest;