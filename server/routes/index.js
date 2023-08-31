// const cx = require('./controll_x');
const orderRouter = require("./order");
const Product = require('./Product.js')

function route(app){
    // app.use('/x',cx);
    app.use('/order', orderRouter);
    app.use('/product', Product);
}
module.exports= route;