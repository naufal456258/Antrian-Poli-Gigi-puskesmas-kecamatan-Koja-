const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schema
const AntrianSchema = new mongoose.Schema({
  nama: String,
  tanggal: String,
  jamDaftar: String
});

const Antrian = mongoose.model('Antrian', AntrianSchema);

// Routes
app.get('/api/antrian/:tanggal', async (req, res) => {
  const data = await Antrian.find({ tanggal: req.params.tanggal });
  res.json(data);
});

app.post('/api/antrian', async (req, res) => {
  const { nama, tanggal } = req.body;
  const dataHariIni = await Antrian.find({ tanggal });

  if (dataHariIni.length >= 40) {
    return res.status(400).json({ message: 'Kuota penuh, pilih tanggal lain' });
  }

  const baru = new Antrian({
    nama,
    tanggal,
    jamDaftar: new Date().toLocaleTimeString('id-ID')
  });

  await baru.save();
  res.status(201).json(baru);
});

// Halaman utama
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
