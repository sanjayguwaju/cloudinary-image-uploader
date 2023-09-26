import { useState } from 'react'
import axios from "axios";
import './App.css'

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadState, setUploadState] = useState(""); // This state will track the uploading process
  const [copyStatus, setCopyStatus] = useState("");
  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onUpload = async () => {
    // Set the state to 'uploading' once the upload process starts
    setUploadState("uploading");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "g82b49bl");
    formData.append("cloud_name", "dvtw2zpbt");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dvtw2zpbt/image/upload",
        formData
      );
      setImageUrl(response.data.secure_url);
      // Set the state to 'success' once the upload is successful
      setUploadState("success");
    } catch (error) {
      console.error("Error uploading image:", error);
      // Set the state to 'failed' if there's any error during upload
      setUploadState("failed");
    }
  };

  const copyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = imageUrl;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        setCopyStatus("copied");
      } else {
        setCopyStatus("not copied");
      }
    } catch (err) {
      console.error("Failed to copy", err);
      setCopyStatus("not copied");
    }

    document.body.removeChild(textArea);
  };
  return (
    <>
      <div className="App">
        <h1>Upload Image to Cloudinary</h1>
        <input type="file" onChange={onFileChange} />
        <button onClick={onUpload}>Upload</button>

        {uploadState === "uploading" && <p>Uploading...</p>}
        {uploadState === "success" && <p>Upload successful!</p>}
        {uploadState === "failed" && <p>Upload failed.</p>}

        {imageUrl && (
          <div className="url-section">
            <h2>Uploaded Image URL:</h2>
            <a href={imageUrl} target="_blank" rel="noopener noreferrer">
              {imageUrl}
            </a>
            <br />
            <button onClick={copyToClipboard}>Copy URL</button>
            {copyStatus === "copied" && <p>URL Copied!</p>}
            {copyStatus === "not copied" && <p>Failed to copy URL.</p>}
          </div>
        )}
      </div>
    </>
  )
}

export default App
