// const cx = require('./controll_x');
const orderRouter = require("./order")
const Product = require('./Product.js')
const category = require('./category.js')
const color = require('./color.js')
const brand = require('./brand.js')
function route(app){
    // app.use('/x',cx);
    app.use('/order', orderRouter);
    app.use('/product', Product);
    app.use('/category', category);
    app.use('/color',color);
    app.use('/brand',brand);
}
module.exports= route;