const express = require('express');
const router = express.Router();

const generateResponse = (req, res) => {
    const { propertyId } = req.params;
    const { metricAggregations, metrics, dimensions, limit = 10 } = req.body;

    // Validate request body
    if (!metrics || !dimensions) {
        return res.status(400).json({
            error: 'Metrics and dimensions are required in the request body.',
        });
    }

    // Predefined realistic values for specific dimensions
    const predefinedValues = {
        deviceCategory: ['desktop', 'mobile', 'tablet'],
        city: ['New York', 'London', 'Tokyo', 'Sydney'],
        country: ['United States', 'United Kingdom', 'Japan', 'Australia'],
        pageTitle: ['Home', 'About Us', 'Contact Us', 'Products'],
        pagePath: ['/home', '/about-us', '/contact', '/products'],
        eventName: ['purchase', 'add_to_cart', 'sign_up', 'page_view'],
        appVersion: ['1.0.0', '2.3.1', '3.4.5', '4.2.0'],
        audienceName: ['Returning Users', 'New Users', 'Subscribed Users', 'Guest Users'],
    };

    // Generate rows with all predefined dimension values in each row
    const rows = [];
    const dimensionCombinations = [];

    // Generate all combinations of dimension values
    const generateCombinations = (dims, prefix = []) => {
        if (dims.length === 0) {
            dimensionCombinations.push(prefix);
            return;
        }
        const [first, ...rest] = dims;
        const values = predefinedValues[first.name] || [`mock_${first.name}_value`];
        values.forEach((value) => {
            generateCombinations(rest, [...prefix, { name: first.name, value }]);
        });
    };

    generateCombinations(dimensions);

    // Limit the number of rows to the specified limit
    const limitedCombinations = dimensionCombinations.slice(0, limit);

    limitedCombinations.forEach((combination) => {
        const dimensionValues = combination.map((dim) => ({
            value: dim.value,
        }));

        const metricValues = metrics.map(() => ({
            value: `${Math.floor(Math.random() * 1000)}`, // Random metric value
        }));

        rows.push({ dimensionValues, metricValues });
    });

    // Generate totals, maximums, and minimums if requested
    const totals = metricAggregations?.includes('TOTAL')
        ? metrics.map(() => ({
            metricValues: [{ value: `${Math.floor(Math.random() * 1000)}` }]
        }))
        : undefined;

    const maximums = metricAggregations?.includes('MAXIMUM')
        ? metrics.map(() => ({
            value: `${Math.floor(Math.random() * 1000)}`, // Mock max value
        }))
        : undefined;

    const minimums = metricAggregations?.includes('MINIMUM')
        ? metrics.map(() => ({
            value: `${Math.floor(Math.random() * 100)}`, // Mock min value
        }))
        : undefined;

    // Mock property quota (optional)
    const propertyQuota = metricAggregations?.includes('PROPERTY_QUOTA')
        ? {
            tokensPerDay: { consumed: 100, remaining: 900 },
            tokensPerHour: { consumed: 10, remaining: 90 },
        }
        : undefined;

    // Build the response object
    const mockRealtimeReportResponse = {
        dimensionHeaders: dimensions.map((dimension) => ({
            name: dimension.name,
        })),
        metricHeaders: metrics.map((metric) => ({
            name: metric.name,
            type: 'TYPE_INTEGER',
        })),
        rows,
        totals,
        maximums,
        minimums,
        rowCount: rows.length,
        propertyQuota,
    };

    // Send response
    res.status(200).json(mockRealtimeReportResponse);
};





router.post(/\/(\d+):runRealtimeReport$/, generateResponse);

module.exports = router;
