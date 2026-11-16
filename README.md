# Solar for GitHub ☀️

A small, cloud-deployable Thai/English AI workbench for coding and SaaS planning. It provides ten specialist agent personas and a team mode. The personas use **one configured OpenAI-compatible model**, not ten separate proprietary models; team mode makes ten model requests and can consume quota quickly.

## Important limits

- There is no guarantee of being “100% secure” or the smartest model for free. Free model access, model names, quotas, and availability change. A free cloud host may sleep, queue requests, or throttle traffic.
- The app does not include or pay for an AI model. Configure an OpenAI-compatible provider and select a model that the provider currently offers on its free tier. Provider accounts and API keys may be required; check their current terms and limits.
- The demo uses one shared login from environment variables, not individual accounts. Do not expose it publicly as a production service. Chats are kept in browser memory only and are not stored by this app, but the AI provider receives prompts. Never submit secrets or sensitive code.
- In-memory rate limiting is a basic abuse safeguard, not distributed protection. For production, use individual identity, a persistent rate limiter, provider-side quotas, monitoring, and a security review.

## Run locally

Requires Python 3.12+ and an API key from an OpenAI-compatible provider.

```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
source .venv/bin/activate
pip install -r requirements.txt
```

Set these environment variables (use your provider's current endpoint and model):

```text
SECRET_KEY=<random string at least 32 characters>
APP_USERNAME=<your login name>
APP_PASSWORD=<long unique password, at least 16 characters>
OPENAI_API_KEY=<provider key>
OPENAI_BASE_URL=https://<provider-openai-compatible-endpoint>/v1
OPENAI_MODEL=<provider model ID>
COOKIE_SECURE=false
```

Generate a secret with `python -c "import secrets; print(secrets.token_urlsafe(48))"`, then start with `python app.py`. Do not commit these values or put them in frontend code.

## Deploy to a cloud host

This repository includes a Dockerfile suitable for a Hugging Face Docker Space or another Docker host:

1. Create a Space using the Docker SDK (or deploy the repo to a Docker-compatible host). A free CPU tier is suitable for the app, **not** for running a large model locally.
2. In the host's **Secrets** settings, add `SECRET_KEY`, `APP_USERNAME`, `APP_PASSWORD`, and `OPENAI_API_KEY`. Add `OPENAI_BASE_URL` and `OPENAI_MODEL` as variables; use the exact endpoint and model currently supported by your provider.
3. Keep `COOKIE_SECURE=true` in cloud. Never add keys to Git, Docker build arguments, frontend files, or logs.
4. Check the provider's free model catalog and quotas before choosing a model. Prefer a strong code/reasoning model available to your account; a council request invokes the model ten times.
5. Test login, chat, rate limits, and logout. Restrict access at the cloud host too if it supports access control. A public repo means this source code is visible to everyone; secrets should only live in host secret storage.

### Security included

- Login required, secure/HTTP-only/SameSite cookies, CSRF token validation, and logout.
- Basic per-process request throttling, input size and conversation limits, bounded model output, and a provider timeout.
- API key only on the server; model errors do not return provider details.
- Security headers, restrictive Content Security Policy, non-root Docker user, and no chat persistence.

This is a starter MVP, not a penetration-tested production product. Keep dependencies updated and arrange a professional security review before storing customer data or opening it to the public.
