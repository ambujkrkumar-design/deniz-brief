# The Deniz Brief — Project Context

## What This Is
A weekly AI intelligence briefing for Deniz, SVP of Client Transformation at Lyra Technology Group. Lyra is an MSP managing IT for mid-market companies.

Live URL: https://ambujkrkumar-design.github.io/deniz-brief/
Repo: https://github.com/ambujkrkumar-design/deniz-brief

## Tech Stack
- Hosting: GitHub Pages from /docs
- Automation: GitHub Actions every Monday 8 AM UTC
- Content: Claude API claude-sonnet-4-6
- Proxy: Cloudflare Worker
- Frontend: Vanilla HTML/CSS/JS single file
- Python: always use /opt/anaconda3/bin/python locally

## Cloudflare
- Worker URL: https://deniz-brief-worker.ambujdesign.workers.dev
- Account subdomain: ambujdesign.workers.dev
- To redeploy: cd worker && wrangler deploy
- To update secrets: wrangler secret put ANTHROPIC_API_KEY

## Key Files
- scripts/generate.py: calls Claude, writes briefing.json
- docs/index.html: entire UI
- docs/briefing.json: weekly content
- worker/index.js: /chat and /meeting-prep endpoints

## Critical Technical Notes
- JSON stripping: Claude wraps responses in backtick blocks, generate.py strips them
- Workflow permissions: contents write required in generate.yml AND repo settings
- GitHub Actions commits briefing.json back to repo after generation
- Two API keys were accidentally exposed in chat during Phase 1, both rotated

## Credentials
- ANTHROPIC_API_KEY in GitHub Secrets: used by GitHub Actions
- ANTHROPIC_API_KEY in Cloudflare Secrets: used by Worker

## Deniz Feedback
WHAT SHE LIKED


WHAT SHE WANTS ADDED


WHAT SHE WANTS CHANGED


QUESTIONS SHE ASKED MOST


## Backlog
- Email digest every Monday
- Archive past weekly briefings
- Source links on each topic
- Streaming chat responses
- PWA for iPhone home screen
- Log prompts to Cloudflare KV

## Phases
Phase 1: GitHub repo and Pages
Phase 2: generate.py and GitHub Actions
Phase 3: index.html UI
Phase 4: Cloudflare Worker
Phase 5: Polish and send