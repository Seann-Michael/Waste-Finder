import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleLocationsSearch,
  handleLocationById,
  handleAllLocations,
} from "./routes/locations";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Locations API routes
  app.get("/api/locations/all", handleAllLocations);
  app.get("/api/locations", handleLocationsSearch);
  app.get("/api/locations/:id", handleLocationById);

  return app;
}
