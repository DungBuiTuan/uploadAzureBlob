import React, { useState } from "react";
import axios from "axios";
import { BlobServiceClient } from "@azure/storage-blob";
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
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('http://localhost:85/users/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('response', response);
      
      // console.log(response.data.imageUrl);
      // const blobName = file.name;
      // const urlResponse = await axios.get(`http://localhost:3000/image-url/${blobName}`);
      // setImageUrl(urlResponse.data.imageUrl);


    } catch (error) {
      console.log("errr: ", error);
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
