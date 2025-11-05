import React from "react";

export default function ChatBox({ response, isTyping }) {
  if (!response && !isTyping) return null;
  return (
    <div className="response-container">
      {isTyping ? (
        <p className="typing">Aurora is typing...</p>
      ) : (
        <p className="response-text">{response}</p>
      )}
    </div>
  );
}
