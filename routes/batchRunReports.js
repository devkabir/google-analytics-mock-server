const express = require('express');
const router = express.Router({ mergeParams: true });
const countries = [
    { name: "United States", id: "US" },
    { name: "Canada", id: "CA" },
    { name: "United Kingdom", id: "UK" },
    { name: "Australia", id: "AU" },
    { name: "Germany", id: "DE" }
];
const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
// Define Channel Groupings and Their Corresponding Mediums and Sources
const channelGroupingMap = {
    "Direct": { sessionMedium: "none", sessionSource: "direct" },
    "Organic Search": { sessionMedium: "organic", sessionSource: "google" },
    "Paid Search": { sessionMedium: "cpc", sessionSource: "google" },
    "Email": { sessionMedium: "email", sessionSource: "newsletter" },
    "Affiliates": { sessionMedium: "referral", sessionSource: "facebook" },
    "Referral": { sessionMedium: "referral", sessionSource: "facebook" },
    "Paid Social": { sessionMedium: "cpc", sessionSource: "facebook" },
    "Organic Social": { sessionMedium: "Social", sessionSource: "twitter" },
    "Display": { sessionMedium: "Social", sessionSource: "linkedin" }
};
const channelGroupings = Object.keys(channelGroupingMap);
const hostnames = ['www.example.com', 'blog.example.com', 'shop.example.com'];
const pageTitles = ['Home', 'About Us', 'Contact', 'Products', 'Blog'];
const pagePaths = ['/', '/about', '/contact', '/products', '/blog'];
const generateDimensions = (dimensions, dateRange) => {
    const { startDate, endDate } = dateRange;
    const dateArray = [];
    const dateHourArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        // Format date as YYYYMMDD
        const formattedDate = `${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}`;
        dateArray.push(formattedDate);
        // Format date as YYYYMMDDHH
        const formattedDateHour = `${formattedDate}${String(currentDate.getHours()).padStart(2, '0')}`;
        dateHourArray.push(formattedDateHour);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const randomDateString = dateArray[Math.floor(Math.random() * dateArray.length)];
    const countryIndex = Math.floor(Math.random() * countries.length);

    // Select a random channel grouping
    const randomChannelGrouping = channelGroupings[Math.floor(Math.random() * channelGroupings.length)];
    const { sessionMedium, sessionSource } = channelGroupingMap[randomChannelGrouping];

    return dimensions.map((dimension) => {
        switch (dimension.name) {
            case 'dateHour':
                return { value: dateHourArray[Math.floor(Math.random() * dateHourArray.length)] };
            case 'sessionMedium':
                return { value: sessionMedium };
            case 'sessionSource':
                return { value: sessionSource };
            case 'sourceMedium':
                return { value: sessionSource };
            case 'country':
                return { value: countries[countryIndex].name }; // Random country
            case 'countryId':
                return { value: countries[countryIndex].id }; // Corresponding country ID
            case 'date':
                return { value: randomDateString }; // Random date from range
            case 'city':
                return { value: cities[Math.floor(Math.random() * cities.length)] }; // Random city
            case 'browser':
                return { value: browsers[Math.floor(Math.random() * browsers.length)] }; // Random browser
            case 'sessionDefaultChannelGrouping':
                return { value: randomChannelGrouping };
            case 'hostname':
                return { value: hostnames[Math.floor(Math.random() * hostnames.length)] }; // Random hostname
            case 'pageTitle':
                return { value: pageTitles[Math.floor(Math.random() * pageTitles.length)] }; // Random page title
            case 'pagePath':
                return { value: pagePaths[Math.floor(Math.random() * pagePaths.length)] }; // Random page path
            default:
                return { value: `Sample-${dimension.name}` }; // Placeholder for unknown dimensions
        }
    });
};


const generateMetrics = (metrics) =>
    metrics.map((metric) => {
        switch (metric.name) {
            case 'newUsers':
                return { value: Math.floor(Math.random() * 1000) }; // Random number of new users
            case 'totalUsers':
                return { value: Math.floor(Math.random() * 1000) }; // Random number of total users
            case 'sessions':
                return { value: Math.floor(Math.random() * 1000) }; // Random number of sessions
            case 'screenPageViews':
                return { value: Math.floor(Math.random() * 1000) }; // Random number of screen page views
            case 'screenPageViewsPerSession':
                return { value: Math.floor(Math.random() * 10) }; // Random number of screen page views per session
            case 'averageSessionDuration':
                return { value: Math.floor(Math.random() * 1000) }; // Random average session duration
            case 'bounceRate':
                return { value: Math.floor(Math.random() * 100) }; // Random bounce rate
            default:
                return { value: `Sample-${metric.name}` }; // Placeholder for unknown metrics
        }
    });

const generateMockData = (dateRanges, metrics, dimensions) => {
    const allData = []; // Accumulate data across all date ranges

    dateRanges.forEach(({ startDate, endDate }) => {
        const currentDate = new Date(startDate);
        const rangeData = []; // Data for this specific date range

        while (currentDate <= new Date(endDate)) {
            // Generate rows based on dimensions and metrics
            const row = {
                dimensionValues: generateDimensions(dimensions, { startDate, endDate }),
                metricValues: generateMetrics(metrics)
            };

            rangeData.push(row); // Add the row to the current range
            currentDate.setDate(currentDate.getDate() + 1); // Move to the next date
        }

        allData.push(...rangeData); // Add the current range's data to the overall data
    });

    return allData; // Return accumulated data across all date ranges
};


const generateMetricHeader = (metrics) => {
    const metricHeader = {
        metricHeaderEntries: metrics.map((metric) => ({
            name: metric.name,
            type: "FLOAT" // Assuming all metrics are of type FLOAT; adjust if needed
        }))
    };

    return metricHeader;
};
const generateResponse = (req, res) => {
    const { propertyId } = req.params;
    const { requests } = req.body;

    // Validate input
    if (!requests || !Array.isArray(requests)) {
        return res.status(400).json({ error: 'Invalid request payload' });
    }
    // Generate reports dynamically
    const reports = requests.map((request) => {
        const { dateRanges, dimensions, keepEmptyRows, metrics, orderBys, property } = request;
        const rows = generateMockData(dateRanges, metrics, dimensions);
        return {
            dimensionHeaders: dimensions
                ? dimensions.map((dimension) => ({ name: dimension.name }))
                : [],
            metricHeaders: metrics.map((metric) => ({
                name: metric.name,
                type: 'INTEGER',
            })),
            rows,
            rowCount: rows.length,
            metadata: {},
            propertyQuota: {},
            kind: 'analyticsData#runReport',
        };
    });

    // Respond with dynamically generated reports
    res.status(200).json({
        reports,
        kind: 'analyticsData#batchRunReports',
    });
};


// POST /v1beta/properties/:propertyId:batchRunReports
router.post(/\/(\d+):batchRunReports$/, generateResponse);

module.exports = router;
