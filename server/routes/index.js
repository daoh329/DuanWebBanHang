// const cx = require('./controll_x');
const orderRouter = require("./order")
const Product = require('./Product.js')
const category = require('./category.js')
const color = require('./color.js')
const brand = require('./brand.js')
const List = require('./List.js')
const pay = require('./pay')
function route(app){
    // app.use('/x',cx);
    app.use('/order', orderRouter);
    app.use('/product', Product);
    app.use('/category', category);
    app.use('/color',color);
    app.use('/brand',brand);
    app.use('/pay', pay);
    app.use('/List', List)
}
module.exports = route;