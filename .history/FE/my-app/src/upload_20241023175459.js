import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

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
      const blobName = file.name;
      const urlResponse = await axios.get(`http://localhost:3000/image-url/${blobName}`);
      setImageUrl(urlResponse.data.imageUrl);
    } catch (error) {
      if (error.response) {
        console.log('Response error:', error.response.data);
      } else if (error.request) {
        console.log('No response from server:', error.request);
      } else {
        console.log('Error:', error.message);
      }
    }
  };
  

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {imageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}
    </div>
  );
};

export default Upload;
