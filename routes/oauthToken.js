const express = require('express');
const router = express.Router();

router.post('/token', (req, res) => {
    const { grant_type, client_id, client_secret, refresh_token } = req.body;

    if (!grant_type || !client_id || !client_secret) {
        return res.status(400).json({
            error: 'invalid_request',
            error_description: 'Missing required parameters: grant_type, client_id, or client_secret.',
        });
    }

    const mockTokenResponse = {
        access_token: 'ya29.a0AfH6SMA-FakeAccessToken123456789',
        expires_in: 3600,
        scope: 'https://www.googleapis.com/auth/analytics.readonly',
        token_type: 'Bearer',
        refresh_token: refresh_token ? '1//FakeRefreshToken123456789' : undefined,
    };

    res.status(200).json(mockTokenResponse);
});

module.exports = router;
