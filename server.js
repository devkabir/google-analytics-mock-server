const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this middleware

// Import Routes
const oauthTokenRoutes = require('./routes/oauthToken');
const accountSummariesRoutes = require('./routes/accountSummaries');
const analyticsProfilesRoutes = require('./routes/analyticsProfiles');
const realtimeReportRoutes = require('./routes/realtimeReport');
const dataStreamsRoutes = require('./routes/dataStreams');

// Use Routes
app.post('/token', oauthTokenRoutes);
app.use('/v1beta/accountSummaries', accountSummariesRoutes);
app.use('/analytics', analyticsProfilesRoutes);
app.use('/v1beta/properties', realtimeReportRoutes);
app.use('/', dataStreamsRoutes);

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
