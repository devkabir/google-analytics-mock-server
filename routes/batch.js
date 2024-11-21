const generateResponse = require('../utils/dataStreamGenerator');
exports.handle = function (app) {
    app.post('/batch', (req, res) => {
        const regex = /Content-ID: dataStream_properties\/\d+/gm;
        const matches = req.body.toString().match(regex);


        // Construct the multipart/mixed response
        const responseBoundary = 'batch_ghlLWu5uBL3rTJraQ79lEZEDzRSTw1MZ';
        let responseBody = '';

        matches.forEach(part => {
            contentId = part.replace('Content-ID: ', '');
            propertyId = contentId.split('/')[1];
            if (!propertyId) {
                return;
            }
            responseBody += `--${responseBoundary}\r\n`;
            responseBody += 'Content-Type: application/http\r\n';
            responseBody += `Content-ID: response-${contentId}\r\n\r\n`;
            responseBody += `HTTP/1.1 200 OK\r\n`;
            responseBody += 'Content-Type: application/json; charset=UTF-8\r\n';
            responseBody += 'Vary: Origin\r\n';
            responseBody += 'Vary: X-Origin\r\n';
            responseBody += 'Vary: Referer\r\n\r\n';
            responseBody += JSON.stringify(generateResponse({ propertyId }), null, 2);
            responseBody += '\r\n';
        });

        responseBody += `--${responseBoundary}--\r\n`;

        // Set headers for multipart response
        res.set({
            'Content-Type': `multipart/mixed; boundary=${responseBoundary}`,
            'Vary': 'X-Origin, Referer',
            'X-XSS-Protection': '0',
            'X-Frame-Options': 'SAMEORIGIN',
            'X-Content-Type-Options': 'nosniff',
        });

        res.send(responseBody);
    });
}
