const Img = require('../models/img.model')
const sharp = require("sharp");
const fs = require("fs")
const cloudinary = require("cloudinary").v2;


function NewImgCollection(req, img) {
    return new Promise((resolve, rejects) => {
        let k = 0;
        for (let i = 0; i < req.files.length; i++) {
            const UploadImg = async () => {
                await sharp(req.files[i].path).resize(700).toFile('./uploads/' + req.files[i].filename)
                await cloudinary.uploader.upload('./uploads/' + req.files[i].filename)
                    .then((result) => {
                        img.path.push(result.url)
                        k = k + 1
                        if (k == req.files.length) {
                            resolve()
                        }

                    })
            }
            UploadImg();
        }
    })
}

function DeleteCollection(col) {
    return new Promise((resolve, rejects) => {
        let k = 0;
        for (let i = 0; i < col.path.length; i++) {
            const DelImg = async () => {
                await cloudinary.uploader.destroy(col.path[i].split('/')[col.path[i].split('/').length - 1].split('.')[0])
                    .then(() => {
                        k = k + 1
                        if (k == col.path.length) {
                            resolve()
                        }
                    })
            }
            DelImg();
        }
    })
}
class Upload {
    index(req, res, next) {
        Img.find({}, async function (err, img) {
            img = img.map(i => i.toObject())
            if (!err) await res.render('upload', { img });
            else {
                res.json("error")
            }
        })

    }
    changedes(req, res, next) {
        res.redirect('/upload');
    }


    upload(req, res, next) {
        if (req.body.owned_gallery == 0) {
            // thêm 1 bộ sưu tập mới
            Img.find({ gallery: req.body.gallery }, function (err, val) {
                if (val.length == 0) {
                    //nếu bộ sưu tập mới không trùng tên với bộ sưu tập cũ => thêm mới
                    let img = new Img();
                    img.gallery = req.body.gallery;
                    const SaveImg = async () => {
                        await NewImgCollection(req, img);
                        img.save()
                        res.redirect('/upload');
                        // console.log(img);
                    }
                    SaveImg()
                }
                else {
                    // nếu đã tồn tại bộ sưu tập trùng tên => update
                    const SaveImg = async () => {
                        await NewImgCollection(req, val[0]);
                        val[0].save()
                        res.redirect('/upload');
                        // console.log(img);
                    }
                    SaveImg()
                }

            })

        }
        else {
            //cập nhật bộ sưu tập hiện có
            Img.find({ gallery: req.body.owned_gallery }, function (err, val) {
                if (err) {
                    console.log(err);
                }
                else {
                    const SaveImg = async () => {
                        await NewImgCollection(req, val[0]);
                        val[0].save()
                        res.redirect('/upload');
                        // console.log(img);
                    }
                    SaveImg()
                }
            })
        }

    }

    delImg(req, res, next) {
        Img.find({ gallery: req.body.gal }, async function (err, img) {
            if (err) {
                console.log(err);
            }
            else {
                img[0].path = img[0].path.filter(item => item != req.body.img)
                //xóa khỏi file gốc- thay bằng xóa khỏi cloudinary
                await cloudinary.uploader.destroy(req.body.img.split('/')[req.body.img.split('/').length - 1].split('.')[0], function (error, result) {
                    console.log(result, error)
                });

                if (img[0].path.length == 0) {
                    Img.findOneAndRemove({ gallery: req.body.gal }, async function (err, docs) {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            await res.redirect('/upload')
                        }
                    })
                }
                else {
                    img[0].save()
                    await res.redirect('/show?owned_gallery=' + req.body.gal);
                }

            }
        })
    }
    delCollection(req, res, next) {
        Img.findOneAndRemove({ gallery: req.body.collection }, async function (err, col) {
            if (err) {
                console.log(err)
            }
            else {
                //xóa khỏi file - thay bằng xóa khỏi cloudinary
                const DelImgs = async () => {
                    await DeleteCollection(col);
                    res.redirect('/upload');
                    // console.log(img);
                }
                DelImgs()
            }
        })
    }
}
module.exports = new Upload;
