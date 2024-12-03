import React, { useRef, useState } from "react";
import { Upload, ImageIcon, Film, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SendImageVideo = ({ files, setFiles, fileType, setFileType }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles = selectedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles(newFiles);
  };

  const triggerFileInput = (type) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = getFileAcceptType(type);
      setFileType(type);
      fileInputRef.current.click();
    }
  };

  const getFileAcceptType = (type) => {
    switch (type) {
      case "image":
        return "image/*";
      case "video":
        return "video/*";
      case "files":
        return ".pdf,.docx,.txt";
      default:
        return "";
    }
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="w-10 h-10">
            <Upload className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          align="center"
          side="top"
          sideOffset={5}
        >
          <DropdownMenuItem onClick={() => triggerFileInput("image")}>
            <ImageIcon className="mr-2 h-4 w-4" />
            <span>Upload Image</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => triggerFileInput("video")}>
            <Film className="mr-2 h-4 w-4" />
            <span>Upload Video</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => triggerFileInput("files")}>
            <FileIcon className="mr-2 h-4 w-4" />
            <span>Upload File</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Input
        id="file-upload"
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        multiple
      />

      {files.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              {file.type.startsWith("image/") ? (
                <img
                  src={file.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : file.type.startsWith("video/") ? (
                <video
                  src={file.preview}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                  <FileIcon className="w-8 h-8 text-gray-500" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setFiles(files.filter((_, i) => i !== index));
                    URL.revokeObjectURL(file.preview);
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SendImageVideo;
