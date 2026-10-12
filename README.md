# College Event & Club Management System
**Student:** Akanksha Jha | **Roll Number:** 01119202024

A BCA summer-training project prototype built with React, Node.js, Express and MongoDB.

## Run locally
1. Install Node.js 18+ and start MongoDB.
2. In `server`, run `npm install`, copy `.env.example` to `.env`, then run `npm run dev`.
3. In another terminal, in `client`, run `npm install` and `npm run dev`.
4. Open the URL shown by Vite (normally http://localhost:5173).

Register a student account to explore and register for events. To enable event creation for a demo, update that user's `role` to `coordinator` or `admin` in MongoDB. Do not expose this shortcut in a production system.

This is project source code, not a hosted/live website. Configure a private JWT secret before use. Optional future features include QR attendance, certificates and notifications.

## Deploy online with Render and MongoDB Atlas
The root `render.yaml` configures one Render web service to build and serve both the React site and the Express API.

1. Push this project to a GitHub repository. Keep `.env` files out of the repository; they contain local settings and secrets.
2. Create a MongoDB Atlas cluster and a database user. Add the Render service's outbound IP addresses to the Atlas IP access list, then copy the cluster connection string and use `campusconnect` as the database name.
3. In Render, create a Blueprint from the GitHub repository and deploy the `campusconnect` service described by `render.yaml`.
4. When prompted, provide the Atlas connection string as `MONGO_URI`. Render generates `JWT_SECRET` for the service.
5. Once the Render deployment is live, share its `onrender.com` URL with your teacher.

Render's free web services can spin down after inactivity, so the first page load after a quiet period may take longer. This deployment is suitable for a classroom demo, not production use.
