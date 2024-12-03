import { Search, CrossIcon, Cross, X } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { getSearchedUsersOrChat } from "@/context/Chats/Chats";
import { UserChatContext } from "@/context/chatContext";

const SearchContainer = () => {
  const [searchVal, setSearchVal] = useState("");

  const {
    setLoadingChats,
    setErrorChats,
    searchedUserAndChats,
    setSearchedUserAndChats,
  } = useContext(UserChatContext);

  useEffect(() => {
    if (searchVal == "") {
      setSearchedUserAndChats([]);
    }
  }, [searchVal]);

  function handleSubmit(e) {
    e.preventDefault();
    if (searchVal != "") {
      getSearchedUsersOrChat(
        searchVal,
        setLoadingChats,
        setErrorChats,
        setSearchedUserAndChats,
      );
    }
  }

  return (
    <div className="border-b p-2 ">
      <form
        action=""
        onSubmit={handleSubmit}
        className="relative flex w-full  border rounded-lg"
      >
        {/* Left Search Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Input Field */}
        <input
          className={`w-full pl-10 pr-10 py-4  rounded-[10px] `}
          placeholder="Search or start a new chat"
          value={searchVal}
          onChange={(e) => {
            setSearchVal(e.target.value);
          }}
        />

        {/* Right Clear Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <X
            className="h-4 w-4 cursor-pointer"
            onClick={() => {
              setSearchVal("");
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default SearchContainer;
