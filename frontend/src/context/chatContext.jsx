import { createContext, useState } from "react";

export const UserChatContext = createContext("");

import React from "react";

const UserChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loadingChats, setLoadingChats] = useState(false);
  const [errorChats, setErrorChats] = useState(null);
  const [searchedUserAndChats, setSearchedUserAndChats] = useState([]);

  return (
    <UserChatContext.Provider
      value={{
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        loadingChats,
        setLoadingChats,
        errorChats,
        setErrorChats,
        searchedUserAndChats,
        setSearchedUserAndChats,
      }}
    >
      {children}
    </UserChatContext.Provider>
  );
};

export default UserChatProvider;
