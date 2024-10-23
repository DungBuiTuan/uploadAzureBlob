import React, { useState } from "react";
import { BlobServiceClient } from "@azure/storage-blob";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [bufferString, setBufferString] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };


  const handleUpload = async () => {
   
    const sasToken = "sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-10-23T21:38:44Z&st=2024-10-23T13:38:44Z&spr=https,http&sig=TsePcMqSr7pxRuH63reYftcxRil3LoJqss8IVdk%2FXYU%3D"; // Replace with your SAS token
    const containerName = "kinderblobby"; // Replace with your container name
    const storageAccountName = "kinderstorageblob"; // Replace with your storage account name

    const blobServiceClient = new BlobServiceClient(
      `https://${storageAccountName}.blob.core.windows.net?${sasToken}`
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(file.name);

    try {
      await blobClient.uploadData(file);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file.');
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
