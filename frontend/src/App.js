import React, { useRef, useState } from "react";
import axios from "axios";
import "./style.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

export default function App() {
  // === State ===
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // store all chat messages
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);

  // === Send message to backend ===
  const sendMessage = async () => {
    if (!message.trim()) return;

    // add user's message immediately
    const newUserMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, newUserMessage]);

    setMessage(""); // clear input
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
    setIsTyping(true);

    try {
      const res = await axios.post(`${API_BASE}/api/ask/`, { message });
      const reply = (res.data?.reply ?? "Sorry, I didn’t understand that.").toString();

      // typing animation for Aurora’s reply
      let currentText = "";
      const newBotMessage = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, newBotMessage]);

      for (let i = 0; i < reply.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 20));
        currentText += reply[i];

        // update the last message progressively
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: currentText };
          return updated;
        });
      }

      setIsTyping(false);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error connecting to server." },
      ]);
      setIsTyping(false);
    }
  };

  const handleInput = (e) => {
    e.target.style.height = "auto";
    const nextHeight = Math.min(e.target.scrollHeight, 160);
    e.target.style.height = `${nextHeight}px`;
  };

  // === Handle Enter ===
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // === UI ===
  return (
    <div className="aurora-app">
      <div className="aurora-bg" aria-hidden="true">
        <span className="aurora-orb orb-a" />
        <span className="aurora-orb orb-b" />
        <span className="aurora-orb orb-c" />
        <span className="aurora-sheen" />
      </div>

      <div className="aurora-shell">
        <header className="aurora-header">
          <div>
            <p className="aurora-kicker">Personal AI</p>
            <h1 className="aurora-title">Aurora Agent</h1>
          </div>
          <p className="aurora-subtitle">
            Demo Version • Created by Parsa Meshkini
          </p>
        </header>

        <section className="chat-panel">
          {messages.length === 0 ? (
            <p className="empty-state">Ask Aurora something ✨</p>
          ) : (
            <div className="chat-stream">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`message ${msg.role === "user" ? "message-user" : "message-bot"}`}
                >
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>
          )}

          {isTyping && <p className="typing-indicator">Aurora is typing...</p>}
        </section>

        <section className="composer">
          <textarea
            className="composer-input"
            rows="2"
            placeholder="Type your message..."
            value={message}
            ref={inputRef}
            onChange={(e) => setMessage(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyPress}
          />
          <button className="composer-send" onClick={sendMessage}>
            Send
          </button>
        </section>
      </div>
    </div>
  );
}
