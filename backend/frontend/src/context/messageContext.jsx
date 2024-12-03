import { createContext, useState } from "react";

export const ChatMessageContext = createContext("");

import React from "react";

const ChatMessageProvider = ({ children }) => {
  const [messages, setMessages] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorMessages, setErrorMessages] = useState(null);

  return (
    <ChatMessageContext.Provider
      value={{
        messages,
        setMessages,
        loadingMessages,
        setLoadingMessages,
        errorMessages,
        setErrorMessages,
      }}
    >
      {children}
    </ChatMessageContext.Provider>
  );
};

export default ChatMessageProvider;
