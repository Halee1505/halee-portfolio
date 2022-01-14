const Img = require('../models/img.model')

class ShowImg{
    index(req,res,next){
        Img.find({},function(err,key){
            var img = []
            key = key.map(i=>i.toObject())
            key.forEach(function(i,index){
                let k = {
                    gallery:i.gallery,
                    path:i.path,
                    key: (req.query.owned_gallery==i.gallery?1:0)
                }
                img.push(k)
            })
            if(!err) res.render('show',{img});
            else{
                res.json("error")
            }
        })
    }
    loadImg(req,res,next){
        Img.find({},function(err,key){
            key = key.map(i=>i.toObject())
            if(!err) res.send(key);
            else{
                res.json("error")
            }
        })
    }

}
module.exports = new ShowImg;