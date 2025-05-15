
import React, { useState } from "react";

const ChatWindow = ({ threadId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { role: "user", content: input }]);
      setInput("");
    }
  };

  return (
    <div style={{ flex: 1, padding: "10px" }}>
      <h3>Chat – {threadId}</h3>
      <div style={{ height: "80%", overflowY: "auto", border: "1px solid #ddd", padding: "10px" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: "8px" }}>
            <strong>{msg.role === "user" ? "Ty" : "Asistent"}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <textarea
        rows="2"
        style={{ width: "100%", marginTop: "10px" }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <button onClick={handleSend} style={{ marginTop: "5px" }}>Odeslat</button>
    </div>
  );
};

export default ChatWindow;
