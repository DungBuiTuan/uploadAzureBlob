import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
  const [file, setFile] = useState(null);

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
    </div>
  );
};

export default Upload;
