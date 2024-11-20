const ProfileGenerator = require("../utils/profileGenerator.js");
exports.handle = function (app) {
    app.get(
        "/analytics/v3/management/accounts/:accountId/webproperties/:webPropertyId/profiles",
        (req, res) => {
            const { accountId, webPropertyId } = req.params;
            // Dynamic parameters
            const itemsPerPage = parseInt(req.query.itemsPerPage || "25", 10);
            const startIndex = parseInt(req.query.startIndex || "1", 10);
            return res.status(200).json(ProfileGenerator({
                accountId,
                webPropertyId,
                itemsPerPage,
                startIndex,
            }));

        });
}
