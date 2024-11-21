const express = require("express");
const app = express();
const PORT = 3000;

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
