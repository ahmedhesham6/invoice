import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

// Register Better Auth HTTP routes
// Requests come from TanStack Start proxy (same server), so no CORS needed
authComponent.registerRoutes(http, createAuth);

export default http;
