const StreamGenerator = require("../utils/dataStreamGenerator.js");
const AccountGenerator = require("../utils/accountGenerator.js");
const RealtimeReportGenerator = require("../utils/realtimeReportGenerator.js");
const BatchReportGenerator = require("../utils/batchReportGenerator.js");
exports.handle = function (app) {
  app.get("/v1beta/properties", (req, res) => {
    return res.status(200).json(AccountGenerator(req.query, "properties"));
  });
  app.get("/v1beta/properties/:propertyId/dataStreams", (req, res) => {
    const { propertyId } = req.params;
    const { pageSize = 50, pageToken = "0" } = req.query;
    return res
      .status(200)
      .json(StreamGenerator({ propertyId, pageSize, pageToken }));
  });
  app.post("/v1beta/properties/:propertyId", (req, res) => {
    const params = req.params.propertyId.split(":");
    if (params.length !== 2) {
      return res.status(400).json({ error: "Invalid report type" });
    }
    const propertyId = params[0];
    switch (params[1]) {
      case "runRealtimeReport":
        const {
          metricAggregations,
          metrics,
          dimensions,
          limit = 10,
        } = req.body;
        return res.status(200).json(
          RealtimeReportGenerator({
            propertyId,
            metricAggregations,
            metrics,
            dimensions,
            limit,
          })
        );
      case "batchRunReports":
        const { requests } = req.body;
        return res
          .status(200)
          .json(BatchReportGenerator({ propertyId, requests }));
      default:
        return res.status(200).json({ type: params[1] });
    }
  });
};
