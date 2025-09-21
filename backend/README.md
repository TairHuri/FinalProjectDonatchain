# DonatChain - Backend

Stack: Node.js + TypeScript + Express + MongoDB + ethers.js

How to run (local):
1. Copy .env.example to .env and fill values.
2. Run `docker-compose up` or run `npm install` then `npm run dev`.
3. API available at http://localhost:4000/api

Main endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/campaigns
- POST /api/campaigns/:id/donate
- GET /api/recommendations

Architecture:
- Mongoose models: User, Ngo, Campaign, Donation, Recommendation, AuditLog.
- Recommender: adapter pattern (mock/external) enables switching to any AI provider.
- Blockchain integration using ethers.js for tx verification and optional writes.

Security:
- Password hashing (bcrypt), JWT auth, Helmet, Rate Limit, CORS.
