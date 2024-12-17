const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const morganMiddleware = require('./middlewares/logger');
const routers = require('./routes/v1');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

require('dotenv').config({ path: path.join(__dirname, '.env') });

const port = 3002;

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use(cors())
app.use('/uploads', express.static('uploads'));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(morganMiddleware);
app.get('/health', (req, res) => res.send({ message: 'ok' }));
app.use('/v1', routers);

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
      return res.status(400).send('No file uploaded.');
  }

  res.status(200).send({
      message: 'Image uploaded successfully',
      file: req.file
  });
});
const server = app.listen(port, () => {
  console.log(`Datatys App running on port ${port}.`);
});
module.exports = server;
