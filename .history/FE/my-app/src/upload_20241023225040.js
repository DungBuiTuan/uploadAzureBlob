import React, { useState } from "react";
import axios from "axios";
import { BlobServiceClient } from "@azure/storage-blob";


async function uploadImage( file, containerName = "kinderblobby") {
  const sasToken =
    ""; // Replace with your SAS token
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
  console.log("blobClient: ", blobClient.url);
}

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


export default Upload;
