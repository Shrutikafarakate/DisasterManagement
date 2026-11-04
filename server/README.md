# Server setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`.
3. In MongoDB Atlas, create a database user and allow your current IP address
   under **Network Access**.
4. Open your cluster's **Connect → Drivers** instructions and copy its connection
   string into `MONGO_URI` in `.env`. Replace the username, password, and cluster
   host placeholders. Keep `disaster_response_platform` as the database name.
   URL-encode special characters in the database password.
5. Set `JWT_SECRET` to a long, random value, then start the server with
   `npm run dev`.

Keep `.env` private; it is excluded from Git. Never commit your Atlas connection
string, email-provider API key, or other credentials.

OTP delivery uses Brevo's HTTPS API. Configure `BREVO_API_KEY` and set
`EMAIL_FROM` to a sender address verified in Brevo.

## Render deployment

The repository includes a Render Blueprint in `render.yaml`. Create a new
Blueprint from the GitHub repository and provide `MONGO_URI` and `CLIENT_URL`
when prompted. Use the `disaster_app` Atlas user with access limited to the
`disaster_response_platform` database, and set a new random `JWT_SECRET`.
Configure the exact deployed frontend origin in `CLIENT_URL`. Free Render web
services block outbound SMTP on ports 25, 465, and 587, so OTP email uses the
Brevo HTTPS API instead. Create a Brevo API key, verify the sender address in
Brevo, and add the key as `BREVO_API_KEY` in Render. Keep `EMAIL_FROM` set to
that verified sender. Do not configure SMTP credentials for this deployment.
The `/health` endpoint is used for service health checks.

Render's free service does not provide a fixed outbound IP. Atlas Network Access
must allow the service's connections; allowing `0.0.0.0/0` carries additional
exposure risk, so use a least-privilege database user and prefer a fixed egress
IP with a restricted Atlas allowlist for production.
