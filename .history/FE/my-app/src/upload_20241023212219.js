import React, { useState } from 'react';
import axios from 'axios';
import { BlobServiceClient } from "@azure/storage-blob";

const Upload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = event => {
    setFile(event.target.files[0]);
  };
  const containerName = "kinderblobby";

  const handleSubmit = event => {
    event.preventDefault();
    uploadImage(containerName, file);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload Image</button>
    </form>
  );

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('image', file);
  
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log(response.data.imageUrl);
      const blobName = file.name; // Get the original file name
      const urlResponse = await axios.get(`http://localhost:3000/image-url/${blobName}`);
      setImageUrl(urlResponse.data.imageUrl); // Set the image URL state
    } catch (error) {
      if (error.response) {
        // Server phản hồi với status code nằm ngoài dải 2xx
        console.log('Response error:', error.response.data);
      } else if (error.request) {
        // Yêu cầu đã được gửi đi nhưng không nhận được phản hồi
        console.log('No response from server:', error.request);
      } else {
        // Xảy ra lỗi khác
        console.log('Error:', error.message);
      }
    }
  };
  

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      
      {/* Display the image if the URL exists */}
      {imageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}
    </div>
  );
};



async function uploadImage(containerName, file) {
  const sasToken = "sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-10-23T21:38:44Z&st=2024-10-23T13:38:44Z&spr=https,http&sig=TsePcMqSr7pxRuH63reYftcxRil3LoJqss8IVdk%2FXYU%3D"; // Replace with your SAS token
     // Replace with your container name
    const storageAccountName = "kinderstorageblob"; // Replace with your storage account name

  const blobServiceClient = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net?${sasToken}`
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(file.name);
  const blockBlobClient = blobClient.getBlockBlobClient();
  const result = await blockBlobClient.uploadBrowserData(file, {
    blockSize: 4 * 1024 * 1024,
    concurrency: 20,
    onProgress: ev => console.log(ev)
  });
  console.log("result: ", result);
  console.log(`Upload of file '${file.name}' completed`);
}

export default Upload;
