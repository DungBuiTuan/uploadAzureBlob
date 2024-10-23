import React, { useState } from "react";
import axios from "axios";
import { BlobServiceClient } from "@azure/storage-blob";

const Upload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const containerName = "kinderblobby";

  const handleSubmit = (event) => {
    event.preventDefault();
    uploadImage(file, containerName);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload Image</button>
    </form>
  );
};

async function uploadImage( file, containerName = "kinderblobby") {
  const sasToken =
    "sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2024-10-23T22:52:54Z&st=2024-10-23T14:52:54Z&spr=https,http&sig=Fc9rDz7rf0pFMLFlB4FkdvN2ybLANr9d3qHq1sNjW4Y%3D"; // Replace with your SAS token
  // Replace with your container name
  const storageAccountName = "kinderstorageblob"; // Replace with your storage account name

  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );
  const containerClient = blobService.getContainerClient(containerName);
  await containerClient.createIfNotExists({
    access: 'container',
  });
  const blobClient = containerClient.getBlockBlobClient(file.name);
  const option = { blobHTTPHeaders: {blobContentType:file.type} };
  await blobClient.uploadBrowserData(file,option);
  console.log("blobClient: ", blobClient);
}

export default Upload;
