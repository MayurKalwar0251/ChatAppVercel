import { UserContext } from "@/context/context";
import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { AudioMessagePlayer } from "./AudioMessagePlayer";

function Message({ message }) {
  const [me, setMe] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const meOrNot = message.sender._id == user._id;
    setMe(meOrNot);
  }, []);

  return (
    <div
      className={cn("flex gap-2", {
        "justify-end": me,
      })}
    >
      <div
        className={cn("rounded-lg px-4 py-2 max-w-[50vw] break-words", {
          "bg-primary text-primary-foreground": me,
          "bg-muted": !me,
        })}
      >
        {message.fileContent ? (
          <>
            {message.fileType === "image" && (
              <img
                src={message.fileContent}
                alt="Uploaded file"
                className="rounded-lg w-32 h-32 object-cover"
              />
            )}
            {message.fileType === "audio" && (
              <AudioMessagePlayer audioUrl={message.fileContent} />
            )}
            {message.fileType === "video" && (
              <video controls className="w-44 h-44 rounded-lg">
                <source src={message.fileContent} type="video/mp4" />
                Your browser does not support the video element.
              </video>
            )}
            {message.fileType === "files" && (
              <iframe
                src={message.fileContent}
                className="w-full h-80 rounded-lg"
                frameBorder="0"
                height="100%" // Adjust height as needed
                width="100%" // Adjust width as needed
              />
            )}
          </>
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}

        <div className="flex items-center justify-end gap-1 mt-2">
          <span className="text-xs opacity-75">{message.createdAt}</span>
          {message.sender._id === user._id && (
            <span>
              {message.isRead ? (
                <CheckCheck className="h-5 w-5 opacity-75 text-green-500" />
              ) : (
                <Check className="h-5 w-5 opacity-75 text-green-500 font-extrabold" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;
