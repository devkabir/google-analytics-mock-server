exports.handle = function (app) {
    app.post('/batch', (req, res) => {
        return res.status(200).json({ body: req.body })
    })
}
