import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import UserProvider from "./context/context.jsx";
import UserChatProvider from "./context/chatContext";
import ChatMessageProvider from "./context/messageContext";

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <UserChatProvider>
      <ChatMessageProvider>
        <App />
      </ChatMessageProvider>
    </UserChatProvider>
  </UserProvider>
);
