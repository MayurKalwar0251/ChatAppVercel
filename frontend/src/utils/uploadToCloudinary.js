import axios from "axios";

export const uploadToCloudinary = async ({ file }) => {
  if (!file) return alert("No Data Send!");

  // Detect the file type
  const fileType = file.type;
  console.log("FILETYPE ", fileType);

  // Prepare the form data
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "media_upload_preset"); // Replace with your preset
  formData.append("cloud_name", "dfiw6zwz0"); // Replace with your cloud name

  // Set the resource_type based on file type
  let resourceType = "image"; // Default to image if file is an image
  if (fileType.startsWith("video/")) {
    resourceType = "video";
  } else if (
    fileType === "application/pdf" ||
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    resourceType = "raw"; // PDF and DOCX should be handled as raw files
  }

  formData.append("resource_type", resourceType);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dfiw6zwz0/upload`,
      formData
    );

    const uploadedUrl = response.data.secure_url;
    console.log("Uploaded File URL:", uploadedUrl);
    return uploadedUrl;
  } catch (error) {
    console.error("Error uploading File:", error);
    alert("Failed to upload File!");
  }
};
