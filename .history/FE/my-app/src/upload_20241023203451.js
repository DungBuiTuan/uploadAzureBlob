import React, { useState } from "react";
import { BlobServiceClient } from "@azure/storage-blob";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [bufferString, setBufferString] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    "BlobEndpoint=https://kinderstorageblob.blob.core.windows.net/;QueueEndpoint=https://kinderstorageblob.queue.core.windows.net/;FileEndpoint=https://kinderstorageblob.file.core.windows.net/;TableEndpoint=https://kinderstorageblob.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-10-23T19:52:42Z&st=2024-10-23T11:52:42Z&spr=https,http&sig=3ewyQc%2FTV4VmbsfY7adF%2Fr2sKl5gsJ4HY5zjQQKiLP4%3D"
  );
  const containerClient = blobServiceClient.getContainerClient("kinderblobby");

  const handleUpload = async () => {
   

    const blockBlobClient = containerClient.getBlockBlobClient(file.name);

    const imageUrl = blockBlobClient.url;
    console.log("imageUrl: ", imageUrl);

    try {
      console.log("Calling Azure Blob");
      await blockBlobClient.uploadData(file);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {bufferString && (
        <div>
          <h3>Buffer Output:</h3>
          <pre>{bufferString}</pre>
        </div>
      )}
    </div>
  );
};

export default Upload;
