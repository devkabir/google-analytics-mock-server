const express = require('express');
const router = express.Router();

// List of valid property types from the API
const propertyTypes = [
    'PROPERTY_TYPE_UNSPECIFIED',
    'PROPERTY_TYPE_ORDINARY',
    'PROPERTY_TYPE_SUBPROPERTY',
    'PROPERTY_TYPE_ROLLUP',
];

// Helper function to get a random property type
function getRandomPropertyType() {
    return propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
}

// Mock data for Google Analytics Account Summaries API
router.get('/', (req, res) => {
    const { pageSize = 50, pageToken = '0' } = req.query;

    const pageSizeInt = parseInt(pageSize, 10);
    const pageTokenInt = parseInt(pageToken, 10);

    // Validate pageSize
    if (isNaN(pageSizeInt) || pageSizeInt < 1 || pageSizeInt > 200) {
        return res.status(400).json({
            error: {
                code: 400,
                message: 'Invalid value for pageSize. Must be between 1 and 200.',
                status: 'INVALID_ARGUMENT',
            },
        });
    }

    // Validate pageToken
    if (isNaN(pageTokenInt) || pageTokenInt < 0) {
        return res.status(400).json({
            error: {
                code: 400,
                message: 'Invalid value for pageToken. Must be a non-negative integer.',
                status: 'INVALID_ARGUMENT',
            },
        });
    }

    // Mock 100 accounts
    const totalAccounts = process.env.TOTAL_ACCOUNTS;
    const startIndex = pageTokenInt * pageSizeInt;
    const endIndex = Math.min(startIndex + pageSizeInt, totalAccounts);

    if (startIndex >= totalAccounts) {
        return res.status(200).json({
            accountSummaries: [],
            nextPageToken: null,
        });
    }

    // Generate mock account summaries
    const accountSummaries = Array.from({ length: endIndex - startIndex }, (_, i) => {
        const accountId = startIndex + i + 1;
        return {
            name: `accountSummaries/${accountId}`,
            account: `accounts/${accountId}`,
            displayName: `Account ${accountId}`,
            propertySummaries: Array.from({ length: 2 }, (_, j) => {
                const propertyId = accountId * 10 + (j + 1);
                return {
                    property: `properties/${propertyId}`,
                    displayName: `Property ${propertyId}`,
                    propertyType: getRandomPropertyType(),
                    parent: `accounts/${accountId}`,
                };
            }),
        };
    });

    // Calculate nextPageToken
    const nextPageToken = endIndex < totalAccounts ? pageTokenInt + 1 : null;

    // Response
    res.status(200).json({
        accountSummaries,
        nextPageToken: nextPageToken !== null ? nextPageToken.toString() : null,
    });
});

module.exports = router;
