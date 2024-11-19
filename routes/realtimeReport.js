const express = require('express');
const router = express.Router();

router.post(/\/(\d+):runRealtimeReport$/, (req, res) => {
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    const { propertyId } = req.params;
    const { metricAggregations, metrics, dimensions } = req.body;

    if (!metrics || !dimensions) {
        return res.status(400).json({
            error: 'Metrics and dimensions are required in the request body.',
        });
    }

    const mockRealtimeReportResponse = {
        propertyId,
        metricAggregations,
        metrics: metrics.map((metric) => ({
            name: metric.name,
            value: Math.floor(Math.random() * 1000),
        })),
        dimensions: dimensions.map((dimension) => ({
            name: dimension.name,
            value: 'mockValue',
        })),
    };

    res.status(200).json(mockRealtimeReportResponse);
});

module.exports = router;
