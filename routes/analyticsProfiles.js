const express = require('express');
const router = express.Router();

router.get('/v3/management/accounts/~all/webproperties/~all/profiles', (req, res) => {
    console.log('Headers:', req.headers);

    const mockProfilesResponse = {
        kind: 'analytics#profiles',
        items: [
            {
                id: '12345',
                name: 'Profile 1',
                type: 'WEB',
            },
            {
                id: '67890',
                name: 'Profile 2',
                type: 'APP',
            },
        ],
    };

    res.status(200).json(mockProfilesResponse);
});

module.exports = router;
