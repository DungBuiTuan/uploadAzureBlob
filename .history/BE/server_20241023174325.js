const express = require('express');
const { BlobServiceClient } = require('@azure/storage-blob');
const multer = require('multer');
const dotenv = require('dotenv');
const cors = require('cors');


// Các route khác của bạn

dotenv.config();

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });


const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient('kinderblobby');

app.post('/upload', upload.single('image'), async (req, res) => {
  const blobName = req.file.originalname;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(req.file.buffer);

  const imageUrl = blockBlobClient.url;
  await image.save();

  res.send({ imageUrl });
});

app.get('/image-url/:blobName', async (req, res) => {
    const blobName = req.params.blobName;
  
    // Construct the URL to the blob
    const imageUrl = `https://kinderstorageblob.blob.core.windows.net/kinderblobby/${blobName}`;
  
    res.send({ imageUrl });
  });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});