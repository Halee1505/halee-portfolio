const express = require('express');
const router = express.Router();
const uploadController = require('../../controllers/upload.controller');
const showImgController = require('../../controllers/showimg.controller');
const multer = require('multer');
const storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //   cb(null, '././uploads/')
    // },
    filename: function (req, file, cb) {
      if(req.body.owned_gallery == 0)
      {
        const uniqueSuffix = req.body.gallery+"ImgName"+ Math.round(Math.random() * 1E9)
        cb(null,uniqueSuffix + file.originalname)
      }
      else{
        const uniqueSuffix = req.body.owned_gallery +"ImgName"+ Math.round(Math.random() * 1E9)
        cb(null,uniqueSuffix + file.originalname)
      }
    }
  })
  
const upload = multer({ storage: storage })
// const upload = multer({ dest: '././uploads/' })


router.get('/upload',uploadController.index);
router.get('/',uploadController.changedes);
router.post('/upload',upload.any(),uploadController.upload);
router.post('/del-img',uploadController.delImg);
router.post('/del-collection',uploadController.delCollection);
router.get('/show',showImgController.index);
router.get('/loadImg',showImgController.loadImg);

module.exports = router;
