import React, { useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit2, Menu } from "lucide-react";
import ChatItem from "./ChatItem";
import SearchContainer from "../SearchContainer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { UserChatContext } from "@/context/chatContext";
import SearchItem from "./SearchItem";
import { UserContext } from "@/context/context";

const ChatList = ({
  onSelectChat,
  chats,
  onSelectSearchChat,
  socket,
  setCreateGroupModal,
}) => {
  const {
    selectedChat,
    setChats,
    searchedUserAndChats,
    setSearchedUserAndChats,
    setLoadingChats,
    setErrorChats,
  } = useContext(UserChatContext);

  const { onlineUsers } = useContext(UserContext);

  const hasSearchResults =
    searchedUserAndChats && searchedUserAndChats.length > 0;

  // useEffect(() => {
  // }, [onlineUsers]);

  return (
    <div className="flex h-full flex-col border-r relative ">
      <header className="flex h-16 items-center justify-between gap-4 border-b px-4">
        <h1 className="text-xl font-semibold">Chats</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Edit2 className="h-5 w-5" />
            <span className="sr-only">New chat</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </header>
      <SearchContainer />
      <div className="flex-1 overflow-y-auto">
        <ScrollArea className="flex-1">
          {Object.keys(onlineUsers).length > 0 && (
            <div className="space-y-1 p-2">
              {hasSearchResults
                ? searchedUserAndChats.map((searchUser) => (
                    <SearchItem
                      key={searchUser._id}
                      searchUser={searchUser}
                      onSelect={() => onSelectSearchChat(searchUser._id)}
                    />
                  ))
                : chats.map((chat) => (
                    <ChatItem
                      key={chat._id}
                      chat={chat}
                      onSelect={() => onSelectChat(chat._id, chat.users)}
                      selectedChat={selectedChat}
                    />
                  ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            asChild
            onClick={() => {
              setCreateGroupModal(true);
            }}
          >
            <div className="absolute w-[50px] h-[50px] rounded-lg flex justify-center items-center bottom-2 right-2 bg-black text-white p-4 cursor-pointer">
              +
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">Create New Group</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ChatList;
