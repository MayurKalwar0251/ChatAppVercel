import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

function SearchItem({ searchUser, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className="flex w-full items-center gap-3 rounded-lg p-3 text-left hover:bg-muted"
    >
      {/*
       <Avatar>
        <AvatarImage src={searchUser.avatar} alt={searchUser.name} />
        <AvatarFallback>{searchUser.name[0]}</AvatarFallback>
      </Avatar>
      */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="font-medium">{searchUser.name}</span>{" "}
          {/*Will change to sender name or group name*/}
        </div>
      </div>
    </button>
  );
}

export default SearchItem;
