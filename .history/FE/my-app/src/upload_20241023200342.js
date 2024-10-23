import React, { useState } from "react";
import { BlobServiceClient } from "@azure/storage-blob";
import { Buffer } from "buffer"; // Import Buffer from the buffer package

const Upload = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    "BlobEndpoint=https://kinderstorageblob.blob.core.windows.net/;QueueEndpoint=https://kinderstorageblob.queue.core.windows.net/;FileEndpoint=https://kinderstorageblob.file.core.windows.net/;TableEndpoint=https://kinderstorageblob.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-10-23T19:52:42Z&st=2024-10-23T11:52:42Z&spr=https,http&sig=3ewyQc%2FTV4VmbsfY7adF%2Fr2sKl5gsJ4HY5zjQQKiLP4%3D"
  );
  const containerClient = blobServiceClient.getContainerClient("kinderblobby");

  const handleUpload = async () => {
    try {
      console.log("Calling Azure Blob");
      console.log("file: ", file.name);

      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = async () => {
        const arrayBuffer = reader.result;
        const buffer = Buffer.from(arrayBuffer); // Use Buffer from the 'buffer' package
        console.log(buffer); // Log the buffer to check

        const blockBlobClient = containerClient.getBlockBlobClient(file.name);
        await blockBlobClient.uploadData(buffer); // Upload the buffer to Azure

        const imageUrl = blockBlobClient.url;
        setImageUrl(imageUrl);
      };
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {imageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img
            src={imageUrl}
            alt="Uploaded"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      )}
    </div>
  );
};

export default Upload;
