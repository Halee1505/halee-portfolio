
// const uploadMulter = require('../models/imgfile.model');
const uploadRouter = require('./courses/upload.route');
function route(app){
    app.use('/',uploadRouter);

}

module.exports = route;