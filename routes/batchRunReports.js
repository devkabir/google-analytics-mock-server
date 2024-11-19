const express = require('express');
const router = express.Router({ mergeParams: true });

// Helper function to generate mock metric values
const generateMockMetricValue = (metricName) => {
    switch (metricName) {
        case 'sessions':
            return Math.floor(Math.random() * 1000);
        case 'screenPageViews':
            return Math.floor(Math.random() * 2000);
        case 'totalUsers':
            return Math.floor(Math.random() * 500);
        case 'screenPageViewsPerSession':
            return (Math.random() * 5).toFixed(2);
        case 'averageSessionDuration':
            return (Math.random() * 300).toFixed(2);
        case 'bounceRate':
            return (Math.random() * 100).toFixed(2);
        case 'newUsers':
            return Math.floor(Math.random() * 300);
        default:
            return 0;
    }
};

// POST /v1beta/properties/:propertyId:batchRunReports
router.post(/\/(\d+):batchRunReports$/, (req, res) => {
    const { propertyId } = req.params;
    const { requests } = req.body;

    if (!requests || !Array.isArray(requests)) {
        return res.status(400).json({ error: 'Invalid request payload' });
    }

    const reports = requests.map((request, index) => {
        const { metrics, dimensions, dateRanges } = request;

        // Generate mock rows
        const rows = dateRanges.map((dateRange, dateRangeIndex) => {
            const metricValues = metrics.map((metric) => ({
                value: generateMockMetricValue(metric.name).toString(),
            }));

            const dimensionValues = dimensions
                ? dimensions.map((dimension) => ({
                    value: `Mock ${dimension.name} Value`,
                }))
                : [];

            return {
                dimensionValues,
                metricValues,
                dateRangeIndex,
            };
        });

        return {
            dimensionHeaders: dimensions
                ? dimensions.map((dimension) => ({ name: dimension.name }))
                : [],
            metricHeaders: metrics.map((metric) => ({
                name: metric.name,
                type: 'TYPE_INTEGER',
            })),
            rows,
            rowCount: rows.length,
            metadata: {},
            propertyQuota: {},
            kind: 'analyticsData#runReport',
        };
    });

    res.status(200).json({
        reports,
        kind: 'analyticsData#batchRunReports',
    });
});

module.exports = router;
