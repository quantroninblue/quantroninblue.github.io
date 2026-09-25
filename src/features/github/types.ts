export type PublicProfile = {
  login: string
  name: string | null
  url: string
  publicRepositories: number
  followers: number
}

export type Repository = {
  id: number
  name: string
  fullName: string
  description: string | null
  language: string | null
  stars: number
  forks: number
  // GitHub's repository endpoint includes pull requests in this count.
  openIssuesAndPullRequests: number
  updatedAt: string
  url: string
  homepage: string | null
  topics: string[]
  archived: boolean
  fork: boolean
}

export type Language = { name: string; bytes: number; percent: number }
export type PublicCommit = { sha: string; repository: string; message: string; date: string; url: string }
export type CommitActivity = {
  from: string
  to: string
  commits: PublicCommit[]
  complete: boolean
  reportedTotal: number
}

export type CalendarDay = { date: string; count: number; level: number }
export type ApiErrorKind = 'rate-limit' | 'network' | 'not-found' | 'invalid-data' | 'api'

export class GitHubError extends Error {
  readonly kind: ApiErrorKind
  readonly retryAt: number | null
  constructor(kind: ApiErrorKind, message: string, retryAt: number | null = null) {
    super(message)
    this.name = 'GitHubError'
    this.kind = kind
    this.retryAt = retryAt
  }
}
