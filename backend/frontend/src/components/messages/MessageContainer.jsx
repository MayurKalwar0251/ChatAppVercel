import React, { useContext, useEffect, useState, useRef } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Image, Menu, Mic } from "lucide-react";
import Message from "./Message";
import ScrollableFeed from "react-scrollable-feed";
import { sendUserMessage } from "@/context/Messages/Messages";
import { ChatMessageContext } from "@/context/messageContext";
import { UserContext } from "@/context/context";

import { SendIcon } from "lucide-react";
import { getUserChatById } from "@/context/Chats/Chats";
import { UserChatContext } from "@/context/chatContext";
import AudioMessage from "./AudioMessage";
import SendImageVideo from "./SendImageVideo";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { server } from "@/utils/server";
import axios from "axios";

function MessageContainer({ chatId, onBack, chats, socket }) {
  const chat = chats.find((c) => c._id === chatId);
  if (!chat) return null;

  const { user, onlineUsers } = useContext(UserContext);
  const { messages, setMessages, setLoadingMessages, setErrorMessages } =
    useContext(ChatMessageContext);
  const { selectedChat, setChats, setLoadingChats, setErrorChats } =
    useContext(UserChatContext);

  const [content, setContent] = useState("");

  const [typing, setTyping] = useState(false); // For tracking current user's typing status
  const [isTyping, setIsTyping] = useState(false); // For tracking other user's typing status
  const [userTypingDetails, setUserTypingDetails] = useState(null);

  // states for recording
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [showOnline, setShowOnline] = useState(false);

  // states for images and videos
  const [files, setFiles] = useState([]);
  const [fileType, setFileType] = useState("image");

  // state for disabling button when sending eg loading
  const [sendingMsgLoading, setSendingMsgLoading] = useState(false);

  // Determine recipient ID
  useEffect(() => {
    setIsRecording(false);
    setAudioBlob(null);
    setAudioUrl(null);

    if (!chat.isGroupChat) {
      const isAnyOnline = chat.users.some(
        (u) => onlineUsers[u._id] && u._id !== user._id
      );
      setShowOnline(isAnyOnline);
    }
  }, [chat.users, onlineUsers, chat.isGroupChat, user._id]);

  // function for submitting audiio and message
  async function handleSubmit(e) {
    e.preventDefault();
    setSendingMsgLoading(true);

    const formData = new FormData();

    // Add content, chatId, and other necessary fields to the formData
    formData.append("content", content.trim());
    formData.append("chatId", chat._id);

    if (audioBlob) {
      // If there is an audio blob, append it to formData
      formData.append("fileContent", audioBlob, "audiofile.mp3"); // Adjust the file name and extension as needed
      formData.append("fileType", "audio");
    }

    // Send the formData to the backend using axios
    try {
      const response = await axios.post(`${server}/message`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // Ensure that credentials (cookies) are included
      });

      const msg = response.data.messageSend; // Assuming the backend sends the message in the response

      if (typing) {
        setTyping(false);
        socket.emit("stop typing", selectedChat);
      }
      socket.emit("new message", msg);

      // Update the UI with the new message
      setMessages((prevMessages) => [...prevMessages, msg]);

      // Refresh the chat state
      getUserChatById(chatId, chats, setChats, setLoadingChats, setErrorChats);

      // Reset state after sending the message
      setAudioBlob(null);
      setAudioUrl("");
      setContent("");
      setSendingMsgLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setSendingMsgLoading(false);
    }
  }

  // Socket event listeners for typing and receiving messages
  useEffect(() => {
    socket.on("typing", (userTyping) => {
      setIsTyping(true);
      setUserTypingDetails(userTyping);
    });
    socket.on("stop typing", () => {
      setUserTypingDetails(null);
      setIsTyping(false);
    });

    return () => {
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [socket]);

  const typingTimeoutRef = useRef(null);
  const lastTypingTimeRef = useRef(null);
  // Handle typing status
  function handleContentTyping(e) {
    const value = e.target.value;
    setContent(value);

    if (!typing && value != "") {
      setTyping(true);
      socket.emit("typing", selectedChat, user);
    }

    lastTypingTimeRef.current = new Date().getTime();
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTimeRef.current;

      if (timeDiff >= 3000 && typing) {
        socket.emit("stop typing", selectedChat);
        setTyping(false);
      }
    }, 3000);
  }

  useEffect(() => {
    socket.on("message recieved", (newMsgRcv) => {
      if (chatId == newMsgRcv.chatBW._id && user._id != newMsgRcv.sender._id)
        setMessages([...messages, newMsgRcv]);
    });

    return () => {
      socket.off("message recieved");
    };
  });

  useEffect(() => {
    const handleUpdateMessageStatus = ({ messageIds, isRead }) => {
      setMessages((prevMessages) => {
        let hasUpdated = false;

        const updatedMessages = prevMessages.map((msg) => {
          if (messageIds.includes(msg._id) && msg.isRead !== isRead) {
            hasUpdated = true;
            return { ...msg, isRead };
          }
          return msg;
        });

        // Only return the updated messages if changes were made to avoid unnecessary renders
        return hasUpdated ? updatedMessages : prevMessages;
      });
    };

    socket.on("updateMessageStatus", handleUpdateMessageStatus);

    return () => {
      socket.off("updateMessageStatus", handleUpdateMessageStatus);
    };
  }, [socket]);

  const getUserName = (users) => {
    return users[0]._id === user._id ? users[1].name : users[0].name;
  };

  const handleImagesSubmit = async (e) => {
    e.preventDefault();
    setSendingMsgLoading(true);

    if (files && files.length > 0) {
      const messagesArray = [];
      const fileUploadPromises = files.map(async (file) => {
        try {
          // Create FormData and append the necessary fields
          const formData = new FormData();
          formData.append("content", content.trim()); // Message content
          formData.append("fileContent", file); // The file to upload (will be handled by backend)
          formData.append("fileType", fileType); // Type of the file (image/audio/video, etc.)
          formData.append("chatId", chat._id); // Chat ID

          // Send FormData to the backend API
          const response = await axios.post(`${server}/message`, formData, {
            headers: {
              "Content-Type": "multipart/form-data", // Let axios set this header correctly
            },
            withCredentials: true, // Ensures credentials like cookies are sent with the request
          });

          const data = await response.data;

          console.log("DATA,", data);

          if (!data.success) {
            throw new Error(data.message || "Message send failed");
          }

          const msg = data.messageSend; // Message object returned from backend
          messagesArray.push(msg);

          // Emit the message via socket
          socket.emit("new message", msg);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      });

      // Wait for all file uploads and message sends to complete
      await Promise.all(fileUploadPromises);

      // Update messages and chat states
      setMessages((prevMessages) => [...prevMessages, ...messagesArray]);
      getUserChatById(chatId, chats, setChats, setLoadingChats, setErrorChats);

      // Cleanup and reset states
      setFiles([]);
      setAudioBlob(null);
      setAudioUrl("");
      setContent("");
      setSendingMsgLoading(false);
    }
  };

  useEffect(() => {
    const unseenMessages = messages.filter(
      (msg) =>
        !msg.isRead && msg.receiver[0]._id === user._id && !chat.isGroupChat
    );

    if (unseenMessages.length > 0) {
      socket.emit("message seen", {
        conversationId: chatId,
        userId: user._id,
        messageIds: unseenMessages.map((msg) => msg._id),
      });
      getUserChatById(chatId, chats, setChats, setLoadingChats, setErrorChats);
    }
  }, [messages, user._id, chatId]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex h-16 items-center gap-3 border-b px-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back to chats</span>
        </Button>
        <div className="flex flex-1 items-center justify-between">
          <div>
            {chat.isGroupChat ? (
              <h2 className="font-semibold">{chat.chatName}</h2>
            ) : (
              <h2 className="font-semibold">{getUserName(chat.users)}</h2>
            )}
            <p className="text-sm text-muted-foreground">
              {showOnline ? "Online" : `${user.lastSeen}`}
            </p>
          </div>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Chat menu</span>
          </Button>
        </div>
      </header>

      {/* Messages */}
      <ScrollableFeed className="p-4">
        <div className="space-y-2">
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
        </div>
      </ScrollableFeed>

      {/* Typing Indicator */}
      {isTyping && userTypingDetails && (
        <span className="px-4">{userTypingDetails.name} Typing...</span>
      )}

      {/* Footer */}
      <footer className="border-t p-4 flex items-center gap-3 justify-between">
        {files.length == 0 && (
          <div className="audio-message-container ">
            <AudioMessage
              audioBlob={audioBlob}
              setAudioBlob={setAudioBlob}
              audioUrl={audioUrl}
              setAudioUrl={setAudioUrl}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
            />
          </div>
        )}
        {!audioBlob && !isRecording && (
          <div className="image-message-container ">
            <SendImageVideo
              files={files}
              setFiles={setFiles}
              fileType={fileType}
              setFileType={setFileType}
            />
          </div>
        )}

        {/* Form for sending text messages */}
        {!isRecording && !audioBlob && files.length == 0 && (
          <form
            onSubmit={handleSubmit}
            className="message-form flex gap-2 justify-between max-h-12 w-full"
          >
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Type a message"
              onChange={handleContentTyping}
              value={content}
              minLength={1}
              autoFocus
              required
            />
            <button
              type="submit"
              className="bg-black text-white p-2 rounded-md text-right"
            >
              <SendIcon />
            </button>
          </form>
        )}

        {/* Secondary button for sending the message manually */}
        {audioBlob && (
          <Button
            onClick={handleSubmit}
            className="bg-black text-white p-2 rounded-md text-right"
            disabled={sendingMsgLoading}
          >
            <SendIcon />
          </Button>
        )}

        {files.length > 0 && (
          <Button
            onClick={handleImagesSubmit}
            className="bg-black text-white p-2 rounded-md text-right"
            disabled={sendingMsgLoading}
          >
            <SendIcon />
          </Button>
        )}
      </footer>
    </div>
  );
}

export default MessageContainer;
