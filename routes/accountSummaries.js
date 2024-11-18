const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

    const { pageSize = 50, pageToken = '0' } = req.query;

    const pageSizeInt = parseInt(pageSize, 10);
    if (isNaN(pageSizeInt) || pageSizeInt < 1 || pageSizeInt > 200) {
        return res.status(400).json({
            error: 'Invalid pageSize. It must be a number between 1 and 200.',
        });
    }

    const pageTokenInt = parseInt(pageToken, 10);
    if (isNaN(pageTokenInt) || pageTokenInt < 0) {
        return res.status(400).json({
            error: 'Invalid pageToken. It must be a non-negative number.',
        });
    }

    const totalAccounts = 100;
    const startIndex = pageTokenInt * pageSizeInt;
    const endIndex = Math.min(startIndex + pageSizeInt, totalAccounts);

    if (startIndex >= totalAccounts) {
        return res.status(200).json({
            accountSummaries: [],
            nextPageToken: null,
        });
    }

    const accountSummaries = Array.from({ length: endIndex - startIndex }, (_, i) => {
        const accountId = startIndex + i + 1;
        return {
            name: `accountSummaries/${accountId}`,
            account: `accounts/${accountId}`,
            displayName: `Account ${accountId}`,
            propertySummaries: [
                {
                    property: `properties/${accountId * 10 + 1}`,
                    displayName: `Property ${accountId * 10 + 1}`,
                    propertyType: 'PROPERTY_TYPE_UNSPECIFIED',
                    parent: `accounts/${accountId}`,
                },
                {
                    property: `properties/${accountId * 10 + 2}`,
                    displayName: `Property ${accountId * 10 + 2}`,
                    propertyType: 'PROPERTY_TYPE_UNSPECIFIED',
                    parent: `accounts/${accountId}`,
                },
            ],
        };
    });

    const nextPageToken = endIndex < totalAccounts ? pageTokenInt + 1 : null;

    res.status(200).json({
        accountSummaries,
        nextPageToken: nextPageToken !== null ? nextPageToken.toString() : null,
    });
});

module.exports = router;
