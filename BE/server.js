const express = require('express');
const { BlobServiceClient } = require('@azure/storage-blob');
const multer = require('multer');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });


const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient('kinderblobby');

app.post('/upload', upload.single('image'), async (req, res) => {
  const blobName = req.file.originalname;
  console.log("blobName:, ", blobName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
console.log("blockBlobClient, ", blockBlobClient);
console.log("req.file.buffer:, ", req.file.buffer);
  await blockBlobClient.uploadData(req.file.buffer);

  const imageUrl = blockBlobClient.url;

  res.send({ imageUrl });
});

app.get('/image-url/:blobName', async (req, res) => {
    const blobName = req.params.blobName;
    const imageUrl = `https://kinderstorageblob.blob.core.windows.net/kinderblobby/${blobName}`;
  
    res.send({ imageUrl });
  });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
