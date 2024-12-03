import axios from "axios";
import { server } from "../../utils/server";

export const getUserChats = async (
  setChats,
  setLoadingChats,
  setErrorChats
) => {
  try {
    setLoadingChats(true);
    const response = await axios.get(`${server}/chat/`, {
      withCredentials: true,
    });
    if (response.data.chats) {
      setChats(response.data.chats);
      setLoadingChats(false);
    }
  } catch (error) {
    setLoading(false);
    setErrorChats(error.message);
  } finally {
    setLoadingChats(false);
  }
};

export const getUserChatById = async (
  chatId,
  chats,
  setChats,
  setLoadingChats,
  setErrorChats
) => {
  try {
    setLoadingChats(true);
    const response = await axios.get(`${server}/chat/${chatId}`, {
      withCredentials: true,
    });

    if (response.data.success) {
      const newChat = response.data.chat;

      // Check if chat exists in the current chats list
      let updatedChats = chats.map((chat) =>
        chat._id === newChat._id ? newChat : chat
      );

      // If the chat does not exist, add it to the list
      const chatExists = chats.some((chat) => chat._id === newChat._id);
      if (!chatExists) {
        updatedChats.unshift(newChat);
      }

      // Sort chats based on updatedAt in descending order
      updatedChats = updatedChats.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );

      setChats(updatedChats); // Update the state with the sorted chats
      return newChat._id;
    }
  } catch (error) {
    setErrorChats(error.message); // Handle error by setting an error state
    return null;
  } finally {
    setLoadingChats(false);
  }
};

export const getSearchedUsersOrChat = async (
  searchVal,
  setLoadingChats,
  setErrorChats,
  setSearchedUserAndChats
) => {
  try {
    setLoadingChats(true);
    const response = await axios.post(
      `${server}/chat/search`,
      {
        searchVal,
      },
      {
        withCredentials: true,
      }
    );
    if (response.data.success) {
      setSearchedUserAndChats(response.data.chat);
      setLoadingChats(false);
    }
  } catch (error) {
    setLoading(false);
    setErrorChats(error.message);
  } finally {
    setLoadingChats(false);
  }
};

export const checkOrCreateChat = async (
  userId,
  setChats,
  setLoadingChats,
  setErrorChats,
  chats
) => {
  try {
    setLoadingChats(true);
    const response = await axios.post(
      `${server}/chat/check`,
      { userId },
      {
        withCredentials: true,
      }
    );

    if (response.data.success) {
      const newChat = response.data.chat;

      // Check if chat already exists in the list
      const chatExists = chats.some((chat) => chat._id === newChat._id);

      if (!chatExists) {
        setChats([newChat, ...chats]);
      }

      return newChat;
    }
  } catch (error) {
    setErrorChats(error.message);
    return null; // Return null in case of error
  } finally {
    setLoadingChats(false);
  }
};

export const createGroupChat = async (
  chatName,
  users,
  setChats,
  setLoadingChats,
  setErrorChats,
  chats
) => {
  try {
    setLoadingChats(true);
    const response = await axios.post(
      `${server}/chat/group`,
      { chatName, users },
      {
        withCredentials: true,
      }
    );

    if (response.data.success) {
      const newChat = response.data.chat;
      setChats([newChat, ...chats]);

      return newChat;
    }
  } catch (error) {
    setErrorChats(error.message);
    return null; // Return null in case of error
  } finally {
    setLoadingChats(false);
  }
};
