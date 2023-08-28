// const cx = require('./controll_x');
const orderRouter = require("./order");

function route(app){
    // app.use('/x',cx);
    app.use('/order', orderRouter);
}
module.exports= route;