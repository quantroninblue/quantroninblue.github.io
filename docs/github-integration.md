# Live public GitHub integration

The `#github` hash route is a lazy-loaded dashboard. Home loads no GitHub
code or API requests. Hash links work on GitHub Pages without redirects or
a backend. The GitHub link in the primary navigation opens the dashboard;
the footer and dashboard profile links still open the actual GitHub profile.

## Data flow and boundaries

```text
GitHub public REST API
  → client.ts (anonymous requests, timeout, rate-limit cooldowns)
  → normalize.ts (allowlisted fields, public-only filtering, safe URLs)
  → service.ts (pagination, aggregate snapshots, metadata resources)
  → resource.ts (memory/localStorage cache, shared requests, subscriptions)
  → useGitHub.ts (visible-page refresh, reconnection, lifecycle)
  → dashboard components
```

`profile.githubUsername` remains the sole account configuration. Components
never call `fetch` or interpret raw API payloads. `createGitHubService` accepts
an injected fetch function, clock, and optional storage for deterministic tests.
No new runtime dependency is required.

## Sources and refresh policy

| Resource | Public API | Cache lifetime |
| --- | --- | --- |
| Profile | `/users/{username}` | 60 minutes |
| Repositories | `/users/{username}/repos?type=owner&per_page=100` | 15 minutes |
| Language distribution | `/repos/{owner}/{repo}/languages` | 60 minutes; on demand |
| Year of indexed commits | `/search/commits?q=author:{username} is:public author-date:{from}..{to}` | 30 minutes |

The visible dashboard checks cache expiry once a minute and on visibility or
connectivity changes. “Check for updates” respects TTL and cooldowns; it is
not an unlimited cache bypass. Requests stop being scheduled when the page
unmounts or is hidden. Shared in-flight requests finish into the cache, bounded
by a 20-second timeout, so StrictMode/remounts do not duplicate API calls.
GitHub's own search indexing can add delay; this is live polling, not an
instant event stream. No website rebuild or redeployment is needed when data
changes.

Repositories are fetched through every page and normalized by stable ID.
The whole snapshot is replaced only after pagination succeeds. New repos
appear automatically; renamed, archived, removed, and newly private repos are
reconciled on the next successful refresh. A failed later page cannot replace
an earlier complete snapshot with an incomplete list. Language resources are
keyed by repository ID and current full name, avoiding renamed endpoints.

Profile, repositories, commits, and language details fail independently.
Loading, empty, unavailable metadata, offline, API failure, and rate-limit
states have explicit UI. Errors may retain a saved snapshot for up to 24
hours, clearly labeled with its original timestamp. A 404 clears the affected
snapshot. Storage failure falls back to memory; malformed caches are ignored.
Only normalized public fields are cached, not raw API payloads or author emails.

The public API has a [60-request/hour core limit](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
per IP and [10 search requests/minute](https://docs.github.com/en/rest/search/search#rate-limit).
The service respects `Retry-After`, `X-RateLimit-Reset`, and exhausted budget
headers; search and core cooldowns are separate. Repeated errors are backed
off for at least a minute. Language details do not consume a request until
opened. No unbounded automatic retry loop is used.

## What the calendar actually counts

The default visualization is **public commit activity**, not a replica of
GitHub's contribution count. It covers a rolling 365 UTC dates, including
today, with a 30-day view derived from the same data. Author timestamps are
normalized to UTC. Commits with a shared SHA (for example in forks) count once.

The heatmap shows unique public commits attributed to the username and
returned by GitHub's commit-search index. It includes public work outside
the account's owned repositories if search returns it. It excludes private
work and does not count issue creation, pull-request reviews, or other types
of profile contributions. It is subject to GitHub's indexing and attribution
rules; author dates can differ from push dates. New branch commits may not
appear in the index immediately. See [searching commits](https://docs.github.com/en/search-github/searching-on-github/searching-commits).

Search returns at most 1,000 matches. The service fetches at most ten pages;
`incomplete_results`, a changing result total, or exceeding that cap marks
the entire calendar partial. Totals are then lower bounds, the week-to-week
trend is withheld, and empty squares are shown as unavailable rather than
invented zero-activity days. Recent commits use the same normalized snapshot.
The calendar provides a readable date/count output, native hover tooltips,
24px keyboard/touch targets, arrow-key navigation, and an intensity legend.

The repository API's `open_issues_count` includes pull requests, so the UI
labels it **issues + PRs**. It does not falsely report a separate issue count.
Language percentages reflect bytes from GitHub's languages endpoint, not
proficiency, time spent, or inferred technology claims. Missing descriptions,
languages, and homepage URLs remain missing. Unsafe homepage URLs are omitted.

## Full contribution-calendar extension

GitHub's [GraphQL `User.contributionsCollection.contributionCalendar`](https://docs.github.com/en/graphql/reference/users#contributionscollection)
is the appropriate API for GitHub-style year-long contribution totals.
[GraphQL calls require authentication](https://docs.github.com/en/graphql/guides/forming-calls-with-graphql).
It cannot be called safely with an embedded personal token from this public
static site. The REST events timeline is not an equivalent fallback: it is
limited to [300 events within 30 days](https://docs.github.com/en/rest/activity/events#about-github-events),
and pushes are not individual commit counts.

If exact profile contribution totals become necessary, add a separately
authorized trusted service with server-held credentials and a strictly public
response contract. Validate its public-only scope: do not publish private or
restricted contribution counts, repository identifiers, or commit metadata.
The existing resource/cache/UI boundary can consume that normalized data
without changing repository discovery. No proxy, third-party scraper,
scheduled export, credentials, or deployment workflow is introduced here.

## Security and verification

- Only `https://api.github.com` is a valid request origin; all calls omit
  cookies and the client accepts no authentication configuration.
- Explicit `is:public` search and public repository flags are required.
- Frontend links permit HTTP(S) only; GitHub links must target `github.com`.
- React escapes API-provided text. Raw HTML, emails, tokens, and private fields
  are never rendered or cached by the service.
- No CLI authentication or local credentials are read by the application.

Run `npm test`, `npm run check`, and `npm run build`. Unit tests cover
pagination, refresh reconciliation, cache expiry/deduplication, malformed
storage, partial results, UTC calendar dates, rate limits, anonymous requests,
privacy filtering, unsafe URLs, and error handling. Browser validation should
also cover live responses, mocked loading/error/empty/rate-limit states,
keyboard navigation, narrow screens, and returning to Home.
