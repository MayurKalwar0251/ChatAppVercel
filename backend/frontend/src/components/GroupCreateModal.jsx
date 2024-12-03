import React, { useContext, useEffect } from "react";
import { useState } from "react";
import {
  X,
  Search,
  User,
  File,
  Image,
  Mail,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserChatContext } from "@/context/chatContext";
import { UserContext } from "@/context/context";
import { createGroupChat, getSearchedUsersOrChat } from "@/context/Chats/Chats";
import { getUserChatsMessages } from "@/context/Messages/Messages";
import { ChatMessageContext } from "@/context/messageContext";

const GroupCreateModal = ({
  createGroupModal,
  setCreateGroupModal,
  setShowMessages,
  socket,
}) => {
  const { setLoadingChats, setErrorChats, chats, setChats } =
    useContext(UserChatContext);

  const { setMessages, setLoadingMessages, setErrorMessages } =
    useContext(ChatMessageContext);

  const [searchVal, setSearchVal] = useState("");

  const [chatName, setChatName] = useState("");

  const [selectedUsers, setSelectedUsers] = useState([]);

  const [users, setUsers] = useState([]);

  const handleUserClick = (user) => {
    if (!selectedUsers.some((selectedUser) => selectedUser._id === user._id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const removeSelectedUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userId._id));
  };

  function handleSearch(e) {
    const value = e.target.value;
    setSearchVal(value);
    getSearchedUsersOrChat(value, setLoadingChats, setErrorChats, setUsers);
  }

  async function handleCreateGroup() {
    const chat = await createGroupChat(
      chatName,
      selectedUsers,
      setChats,
      setLoadingChats,
      setErrorChats,
      chats
    );

    setCreateGroupModal(false);
    setSelectedChat(chat._id);
    setShowMessages(true);

    socket.emit("join chat", chat._id);
    socket.emit("create chat", chat);

    getUserChatsMessages(
      chat._id,
      setMessages,
      setLoadingMessages,
      setErrorMessages
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-10">
      <Card className="w-full max-w-md md:max-w-2xl mx-auto bg-white rounded-lg shadow-lg max-h-[80vh] flex flex-col">
        <CardHeader className="flex items-center justify-between p-4 border-b">
          <div className="w-full">
            <input
              placeholder="Enter Chat Group Name..."
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              autoFocus
              className="p-2 rounded-md w-full border border-black"
            />
          </div>
          <div className="flex items-center w-full space-x-2">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              placeholder="Search for people, file, image and email..."
              className="w-full p-2  border-b border-black"
              value={searchVal}
              onChange={handleSearch}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCreateGroupModal(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 overflow-y-auto flex-grow">
          <div className="flex flex-col h-full">
            <div className="overflow-y-auto flex-grow mb-4">
              <div>
                <span className="text-sm font-medium">
                  People {users.length}
                </span>
                <ul className="mt-2 space-y-2">
                  {users.map((user) => (
                    <li
                      key={user._id}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                      onClick={() => handleUserClick(user)}
                    >
                      <img
                        src={`/placeholder.svg?height=40&width=40`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[30%]">
              {selectedUsers.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-2 bg-gray-100 rounded"
                    >
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSelectedUser(user)}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full  my-4 flex justify-center">
              <button
                onClick={handleCreateGroup}
                disabled={selectedUsers.length < 2}
                className="bg-black text-white p-3 rounded-md disabled:bg-gray-500"
              >
                Create Group
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupCreateModal;
