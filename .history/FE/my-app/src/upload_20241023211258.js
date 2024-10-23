import React, { useState } from "react";
import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import { convertFileToArrayBuffer } from './lib/convert-file-to-arraybuffer';

const Upload = () => {
  const [file, setFile] = useState(null);

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
     const blobName = file.src + new Date().getTime();
     const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
      // const fileArrayBuffer = await convertFileToArrayBuffer(file)
      console.log("fileBuffer: ", blobName);
      const uploadBlobResponse = await blockBlobClient.uploadFile(file.src);
      console.log("blobClient: ", uploadBlobResponse);
      
    } catch (error) {
      console.error('Error uploading file:', error);
    }

  };

  
  

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
       <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default Upload;
