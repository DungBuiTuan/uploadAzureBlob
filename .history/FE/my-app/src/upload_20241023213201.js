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
    uploadImage(containerName, file);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload Image</button>
    </form>
  );
};

async function uploadImage(containerName, file) {
  const sasToken =
    "sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-10-23T21:38:44Z&st=2024-10-23T13:38:44Z&spr=https,http&sig=TsePcMqSr7pxRuH63reYftcxRil3LoJqss8IVdk%2FXYU%3D"; // Replace with your SAS token
  // Replace with your container name
  const storageAccountName = "kinderstorageblob"; // Replace with your storage account name

  const blobServiceClient = new BlobServiceClient(
    `BlobEndpoint=https://kinderstorageblob.blob.core.windows.net/;QueueEndpoint=https://kinderstorageblob.queue.core.windows.net/;FileEndpoint=https://kinderstorageblob.file.core.windows.net/;TableEndpoint=https://kinderstorageblob.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-10-23T21:38:44Z&st=2024-10-23T13:38:44Z&spr=https,http&sig=TsePcMqSr7pxRuH63reYftcxRil3LoJqss8IVdk%2FXYU%3D/${sasToken}`
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(file.name);
  const blockBlobClient = blobClient.getBlockBlobClient();
  const result = await blockBlobClient.uploadData(file, {
    blockSize: 4 * 1024 * 1024,
    concurrency: 20,
    onProgress: (ev) => console.log(ev),
  });
  console.log("result: ", result);
  console.log(`Upload of file '${file.name}' completed`);
}

export default Upload;
