const { query } = require("../../util/callbackToPromise");

class promotional {
    async add(req, res) {
        const data = req.body
        const { name, percent_discount } = data;
        const values = [name,percent_discount];
        const is_promotional = 'INSERT INTO promotional (name, percent_discount) VALUES (?,?)';
        const handleError = (e, res, message) => {
            console.log(e);
            return res.status(500).json(message);
          };
        try {
            await query(is_promotional, values);
            res.status(200).send("success");
        } catch (error) {
            handleError(error, res, { status: "failed" });
        }
    }
    async get(req, res) {
        const sl_promotional = 'SELECT * FROM promotional';
        const handleError = (e, res, message) => {
            console.log(e);
            return res.status(500).json(message);
          };
        try {
            const result = await query(sl_promotional, values);
            res.status(200).send(result);
        } catch (error) {
            handleError(error, res, { status: "failed" });
        }
    }
    async update(req, res) {
        const id = req.params
        const data = req.body
        const values = {
            name: data.name,
            percent_discount: data.percent_discount.toFixed(2)
        }
        const Up_promotional = 'UPDATE promotional SET name = ?, percent_discount = ? WHERE id = ?';
        const handleError = (e, res, message) => {
            console.log(e);
            return res.status(500).json(message);
          };
        try {
            await query(Up_promotional, [values,id]);
            res.status(200).send("success");
        } catch (error) {
            handleError(error, res, { status: "failed" });
        }
    }
    delete(req, res) {
        const id = req.params
        const dl_promotional = 'DELETE FROM promotional WHERE id = ?';
        const handleError = (e, res, message) => {
            console.log(e);
            return res.status(500).json(message);
          };
        try {
            query(dl_promotional, id);
            res.status(200).send("success");
        } catch (error) {
            handleError(error, res, { status: "failed" });
        }
    }
}
module.exports = new promotional();