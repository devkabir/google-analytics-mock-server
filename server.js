const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to handle raw body parsing for specific content types
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/batch', express.raw({ type: 'multipart/mixed', limit: '10mb' }));
app.use('/batch', express.raw({ type: 'application/http', limit: '10mb' }));

// Routes
const UserRoutes = require("./routes/user.js");
const AnalyticsRoutes = require("./routes/analytics.js");
const PropertyRoutes = require("./routes/property.js");
const BatchRoutes = require("./routes/batch.js");
app.get("/", (req, res) => res.status(200).json({ message: "Hello World!" }));
UserRoutes.handle(app);
AnalyticsRoutes.handle(app);
PropertyRoutes.handle(app);
BatchRoutes.handle(app);

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
