import { httpRouter } from 'convex/server';

import { authComponent, createAuth } from './auth';

const http = httpRouter();

// Register Better Auth HTTP routes with CORS for cross-domain auth
authComponent.registerRoutes(http, createAuth, { cors: true });

export default http;
