const express = require('express');
const mongoose = require('mongoose');
const { BlobServiceClient } = require('@azure/storage-blob');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const imageSchema = new mongoose.Schema({
  url: String,
  name: String,
});

const Image = mongoose.model('Image', imageSchema);

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient('your-container-name');

app.post('/upload', upload.single('image'), async (req, res) => {
  const blobName = req.file.originalname;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(req.file.buffer);

  const imageUrl = blockBlobClient.url;
  const image = new Image({ url: imageUrl, name: blobName });
  await image.save();

  res.send({ imageUrl });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
