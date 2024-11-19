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
const dataStreamsRoutes = require('./routes/dataStreams');
const batchRunReportsRoutes = require('./routes/batchRunReports');
const realtimeReportRoutes = require('./routes/realtimeReport');

// Use Routes
app.post('/token', oauthTokenRoutes);
app.use('/v1beta/accountSummaries', accountSummariesRoutes);
app.use('/analytics', analyticsProfilesRoutes);
app.use('/v1beta/properties/', batchRunReportsRoutes);
app.use('/v1beta/properties/', realtimeReportRoutes);
app.use('/v1beta/properties/:propertyId', dataStreamsRoutes);


// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
