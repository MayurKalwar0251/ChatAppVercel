import axios from "axios";
import { server } from "../../utils/server";

export const getUserChatsMessages = async (
  chatId,
  setMessages,
  setLoadingMessages,
  setErrorMessages
) => {
  try {
    setLoadingMessages(true);
    const response = await axios.get(`${server}/message/${chatId}`, {
      withCredentials: true,
    });
    if (response.data.success) {
      setMessages(response.data.messages);
      setLoadingMessages(false);
    }
  } catch (error) {
    setLoadingMessages(false);
    setErrorMessages(error.message);
  } finally {
    setLoadingMessages(false);
  }
};

export const sendUserMessage = async ({
  content,
  chatId,
  setMessages,
  setLoadingMessages,
  setErrorMessages,
  messages,
  fileContent,
  fileType,
}) => {
  try {
    setLoadingMessages(true);
    const response = await axios.post(
      `${server}/message`,
      {
        content,
        chatId,
        fileContent,
        fileType,
      },
      {
        withCredentials: true,
      }
    );

    if (response.data.success) {
      // setMessages([...messages, response.data.messageSend]);
      setLoadingMessages(false);

      return response.data.messageSend;
    }
  } catch (error) {
    setLoadingMessages(false);
    setErrorMessages(error.message);
  } finally {
    setLoadingMessages(false);
  }
};
