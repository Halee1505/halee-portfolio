const Img = require('../models/img.model')
const sharp = require("sharp");
const fs = require("fs")

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

    async upload(req, res, next) {
        if (req.body.owned_gallery == 0) {
            Img.find({ gallery: req.body.gallery }, async function (err, val) {
                if (val.length == 0) {
                    let img = new Img();
                    img.gallery = req.body.gallery;
                    for (let i = 0; i < req.files.length; i++) {
                        sharp(req.files[i].path).resize(800).toFile('./uploads/' + req.files[i].filename)
                        img.path.push("uploads\\" + req.files[i].filename);

                    }
                    img.save()
                }
                else{
                    for (let i = 0; i < req.files.length; i++) {
                        sharp(req.files[i].path).resize(800).toFile('./uploads/' + req.files[i].filename)
                        val[0].path.push("uploads\\" + req.files[i].filename);
                    }
                    val[0].save()
                }
                await res.redirect('/upload');
            })

        }
        else {
            Img.find({ gallery: req.body.owned_gallery }, function (err, img) {
                if (err) {
                    console.log(err);
                }
                else {
                    for (let i = 0; i < req.files.length; i++) {
                        sharp(req.files[i].path).resize(800).toFile('./uploads/' + req.files[i].filename)
                        img[0].path.push("uploads\\" + req.files[i].filename);
                    }
                    img[0].save()
                }
            })
            await res.redirect('/upload');
        }

    }

    delImg(req, res, next) {
        Img.find({ gallery: req.body.img.split("\\")[1].split("ImgName")[0] }, async function (err, img) {
            if (err) {
                console.log(err);
            }
            else {
                img[0].path = img[0].path.filter(item => item != req.body.img)
                fs.unlink(req.body.img, function(err) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log("Xoa File thanh cong!");
                 });
                if (img[0].path.length == 0) {
                    Img.findOneAndRemove({ gallery: req.body.img.split("\\")[1].split("ImgName")[0] }, async function (err, docs) {
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
                    await res.redirect('/show?owned_gallery=' + req.body.img.split("\\")[1].split("ImgName")[0].replace(/ /g, '+'));
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
                for(let i=0;i<col.path.length;i++){
                    fs.unlink(col.path[i], function(err) {
                        if (err) {
                            return console.error(err);
                        }
                        console.log("Xoa File thanh cong!");
                     });
                }
                await res.redirect('/upload')
            }
        })
    }
}
module.exports = new Upload;
