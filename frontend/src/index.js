import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./style.css"; // ⬅️ your portfolio theme (galaxy glow, etc.)
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
