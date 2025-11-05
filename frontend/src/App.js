import React, { useState } from "react";
import axios from "axios";
import "./style.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

export default function App() {
  // === State ===
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // store all chat messages
  const [isTyping, setIsTyping] = useState(false);

  // === Send message to backend ===
  const sendMessage = async () => {
    if (!message.trim()) return;

    // add user's message immediately
    const newUserMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, newUserMessage]);

    setMessage(""); // clear input
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

  // === Handle Enter ===
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // === UI ===
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-black text-white">
      {/* Aurora Background */}
      <div id="aurora-bg" />

      <div className="relative z-10 flex flex-col justify-between h-screen max-w-2xl mx-auto p-4">
        {/* Logo / Header */}
        <div className="flex flex-col justify-center items-center py-3">
          <h1 className="text-3xl font-semibold text-aurora drop-shadow-md">Aurora</h1>
          <p className="text-xs text-gray-400 mt-1 tracking-wide">
            Demo Version • Created by Parsa Meshkini
          </p>
        </div>


        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 bg-transparent backdrop-blur-sm rounded-lg space-y-3">
          {messages.length === 0 ? (
            <p className="text-gray-500 italic text-center">
              Ask Aurora something ✨
            </p>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-emerald-500/20 self-end text-right"
                    : "bg-white/10 self-start text-left border border-white/10"
                }`}
              >
                <p className="whitespace-pre-line">{msg.content}</p>
              </div>
            ))
          )}

          {isTyping && (
            <p className="typing text-green-300 mt-2 animate-pulse">
              Aurora is typing...
            </p>
          )}
        </div>

        {/* Input */}
        <div className="flex mt-4">
          <textarea
            className="flex-1 resize-none p-3 rounded-lg bg-gray-900/70 text-gray-200 focus:outline-none border border-white/10"
            rows="2"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={sendMessage}
            className="ml-2 px-6 py-3 rounded-lg bg-emerald-400/80 hover:bg-emerald-400 text-black font-semibold transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
