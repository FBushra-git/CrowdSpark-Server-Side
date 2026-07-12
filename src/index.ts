import dotenv from "dotenv";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { seedDemoData } from "./seed/demo-data.js";

dotenv.config();

const port = process.env.PORT || 5000;

connectDatabase()
  .then(async () => {
    if (process.env.SEED_DEMO_DATA === "true") await seedDemoData();
    app.listen(port, () => console.log(`CrowdSpark API running on http://localhost:${port}`));
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
