// const cx = require('./controll_x');
const orderRouter = require("./order")
const Product = require('./Product.js')
const List = require('./List.js')
const pay = require('./pay')
const promotional = require('./promotional')
function route(app){
    // app.use('/x',cx);
    app.use('/order', orderRouter);
    app.use('/product', Product);
    app.use('/pay', pay);
    app.use('/List', List);
    app.use('/promo',promotional);
}
module.exports = route;