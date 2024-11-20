const countries = [
    { name: "United States", id: "US" },
    { name: "Canada", id: "CA" },
    { name: "United Kingdom", id: "UK" },
    { name: "Australia", id: "AU" },
    { name: "Germany", id: "DE" },
];
const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];
const browsers = ["Chrome", "Firefox", "Safari", "Edge", "Opera"];
// Define Channel Groupings and Their Corresponding Mediums and Sources
const channelGroupingMap = {
    Direct: { sessionMedium: "none", sessionSource: "direct" },
    "Paid Search": { sessionMedium: "cpc", sessionSource: "google" },
    Email: { sessionMedium: "email", sessionSource: "newsletter" },
    Referral: { sessionMedium: "referral", sessionSource: "external" },
    "Paid Social": { sessionMedium: "cpc", sessionSource: "facebook" },
};
const channelGroupings = Object.keys(channelGroupingMap);
const hostnames = [
    "www.example.com",
    "blog.example.com",
    "shop.example.com",
    "help.example.com",
    "support.example.com",
];
const pageTitles = ["Home", "About Us", "Contact", "Products", "Blog"];
const pagePaths = ["/", "/about", "/contact", "/products", "/blog"];
const pagePathPlusQueryStrings = [
    "/",
    "/about?param1=value1",
    "/contact?param2=value2",
    "/products?param3=value3",
    "/blog?param4=value4",
];
const generateDimensions = (dimensions, dateRange) => {
    const { startDate, endDate } = dateRange;
    const dateArray = [];
    const dateHourArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        // Format date as YYYYMMDD
        const formattedDate = `${currentDate.getFullYear()}${String(
            currentDate.getMonth() + 1
        ).padStart(2, "0")}${String(currentDate.getDate()).padStart(2, "0")}`;
        dateArray.push(formattedDate);
        // Format date as YYYYMMDDHH
        const formattedDateHour = `${formattedDate}${String(
            currentDate.getHours()
        ).padStart(2, "0")}`;
        dateHourArray.push(formattedDateHour);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const randomDateString =
        dateArray[Math.floor(Math.random() * dateArray.length)];
    const baseIndex = Math.floor(Math.random() * 5);

    // Select a random channel grouping
    const randomChannelGrouping =
        channelGroupings[Math.floor(Math.random() * channelGroupings.length)];
    const { sessionMedium, sessionSource } =
        channelGroupingMap[randomChannelGrouping];

    return dimensions.map((dimension) => {
        switch (dimension.name) {
            case "dateHour":
                return { value: dateHourArray[baseIndex] };
            case "sessionMedium":
                return { value: sessionMedium };
            case "sessionSource":
                return { value: sessionSource };
            case "sourceMedium":
                return { value: sessionSource };
            case "country":
                return { value: countries[baseIndex].name }; // Random country
            case "countryId":
                return { value: countries[baseIndex].id }; // Corresponding country ID
            case "date":
                return { value: randomDateString }; // Random date from range
            case "city":
                return { value: cities[baseIndex] }; // Random city
            case "browser":
                return { value: browsers[baseIndex] }; // Random browser
            case "sessionDefaultChannelGrouping":
                return { value: randomChannelGrouping };
            case "hostname":
                return { value: hostnames[baseIndex] }; // Random hostname
            case "pageTitle":
                return { value: pageTitles[baseIndex] }; // Random page title
            case "pagePath":
                return { value: pagePaths[baseIndex] }; // Random page path
            case "pagePathPlusQueryString":
                return { value: pagePathPlusQueryStrings[baseIndex] }; // Random page path with query string
            default:
                return { value: `dimensions-${dimension.name}` }; // Placeholder for unknown dimensions
        }
    });
};

const generateMetrics = (metrics) =>
    metrics.map((metric) => {
        switch (metric.name) {
            case "newUsers":
                return { value: Math.floor(Math.random() * 1000) }; // Random number of new users
            case "totalUsers":
                return { value: Math.floor(Math.random() * 1000) }; // Random number of total users
            case "sessions":
                return { value: Math.floor(Math.random() * 1000) }; // Random number of sessions
            case "screenPageViews":
                return { value: Math.floor(Math.random() * 1000) }; // Random number of screen page views
            case "screenPageViewsPerSession":
                return { value: Math.floor(Math.random() * 10) }; // Random number of screen page views per session
            case "averageSessionDuration":
                return { value: Math.floor(Math.random() * 1000) }; // Random average session duration
            case "bounceRate":
                return { value: Math.floor(Math.random() * 100) }; // Random bounce rate
            default:
                return { value: `metrics-${metric.name}` }; // Placeholder for unknown metrics
        }
    });
// Combine rows with the same dimension values
const combineRows = (rows) => {
    const combined = {};
    rows.forEach((row) => {
        const dimensionKey = row.dimensionValues.map((d) => d.value).join("|");
        if (!combined[dimensionKey]) {
            combined[dimensionKey] = {
                dimensionValues: row.dimensionValues,
                metricValues: row.metricValues.map((m) => ({ ...m })),
            };
        } else {
            row.metricValues.forEach((metric, index) => {
                combined[dimensionKey].metricValues[index].value =
                    parseFloat(combined[dimensionKey].metricValues[index].value) +
                    parseFloat(metric.value);
            });
        }
    });
    return Object.values(combined);
};
const generateMockData = (dateRanges, metrics, dimensions) => {
    const allData = []; // Accumulate data across all date ranges

    dateRanges.forEach(({ startDate, endDate }) => {
        const currentDate = new Date(startDate);
        const rangeData = []; // Data for this specific date range

        while (currentDate <= new Date(endDate)) {
            // Generate rows based on dimensions and metrics
            const row = {
                dimensionValues: generateDimensions(dimensions, { startDate, endDate }),
                metricValues: generateMetrics(metrics),
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
            type: "FLOAT", // Assuming all metrics are of type FLOAT; adjust if needed
        })),
    };

    return metricHeader;
};
const generateResponse = ({ propertyId, requests }) => {
    // Validate input
    if (!requests || !Array.isArray(requests)) {
        return { error: "Invalid request payload" };
    }
    // Generate reports dynamically
    const reports = requests.map((request) => {
        const {
            dateRanges,
            dimensions,
            keepEmptyRows,
            metrics,
            orderBys,
            property,
        } = request;
        const rows = generateMockData(dateRanges, metrics, dimensions);
        return {
            dimensionHeaders: dimensions
                ? dimensions.map((dimension) => ({ name: dimension.name }))
                : [],
            metricHeaders: metrics.map((metric) => ({
                name: metric.name,
                type: "INTEGER",
            })),
            rows: combineRows(rows),
            rowCount: rows.length,
            metadata: {},
            propertyQuota: {},
            kind: "analyticsData#runReport",
        };
    });

    // Respond with dynamically generated reports
    return {
        reports,
        kind: "analyticsData#batchRunReports",
    };
};

module.exports = generateResponse;
