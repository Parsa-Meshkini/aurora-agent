import React from "react";

export default function ChatMessage({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={[
          "max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 leading-relaxed",
          "shadow-aurora",
          isUser
            ? "bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[#e6eef6]"
            : "bg-[rgba(20,25,25,0.9)] border border-[rgba(120,255,160,0.18)] text-[#d1fcd2]"
        ].join(" ")}
        style={{ backdropFilter: "blur(6px)" }}
      >
        {content}
      </div>
    </div>
  );
}
