const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const { engine } = require( 'express-handlebars');
const dotenv = require("dotenv");
const cors = require('cors');
const mongoose = require('mongoose');
const UploadImg = require('./routes/index');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "vitamim",
  api_key: "562993249483824",
  api_secret: "uo6dYnuiMvn-gOspPxvzA__28qo"
});
dotenv.config();
const PORT = process.env.PORT || 1505;
mongoose.Promise = global.Promise;

app.engine('.hbs', engine({extname:'.hbs'}));
app.set('view engine', '.hbs');
app.set('views','./views');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true, })
    .then(() => { console.log('Database is connected') },
      err => { console.log('Can not connect to the database' + err) }
    );
}
connectDB()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));
// app.use('/upload', UploadImg);


// const UploadImg = require('./routes/Upload.route');
UploadImg(app);

app.listen(PORT, function () {
  console.log('Server is running on Port:', PORT);
});