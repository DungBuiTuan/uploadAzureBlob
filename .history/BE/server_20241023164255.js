const express = require('express');
const mongoose = require('mongoose');
const { BlobServiceClient } = require('@azure/storage-blob');
const multer = require('multer');
const dotenv = require('dotenv');
const cors = require('cors');


// Các route khác của bạn

dotenv.config();

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const imageSchema = new mongoose.Schema({
  url: String,
  name: String,
});

const Image = mongoose.model('Image', imageSchema);

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient('kinderblobby');

app.post('/upload', upload.single('image'), async (req, res) => {
  const blobName = req.file.originalname;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(req.file.buffer);

  const imageUrl = blockBlobClient.url;
  const image = new Image({ url: imageUrl, name: blobName });
  await image.save();

  res.send({ imageUrl });
});

app.get('/image-url/:blobName', async (req, res) => {
    const blobName = req.params.blobName;
  
    // Construct the URL to the blob
    const imageUrl = `https://kinderstorageblob.blob.core.windows.net/kinderblobby/${blobName}?sp=r&st=2024-10-23T09:41:45Z&se=2024-10-23T17:41:45Z&sv=2022-11-02&sr=b&sig=JYNwurFNep9Oivqt2H0XjPoPF%2Bja6OqcqdFxchIVd%2Fo%3D`;
  
    res.send({ imageUrl });
  });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
