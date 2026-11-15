import 'server-only'
import type { SiteContent } from '@/lib/site-content'

export type PendingUpload = { url: string; sha: string }
type GithubConfig = { owner: string; repo: string; branch: string; token: string }

export function githubContentConfigured() {
  return Boolean(process.env.GITHUB_CONTENT_OWNER || process.env.GITHUB_CONTENT_REPO || process.env.GITHUB_CONTENT_TOKEN)
}

function config(): GithubConfig {
  const owner = process.env.GITHUB_CONTENT_OWNER?.trim() ?? ''
  const repo = process.env.GITHUB_CONTENT_REPO?.trim() ?? ''
  const branch = process.env.GITHUB_CONTENT_BRANCH?.trim() || 'main'
  const token = process.env.GITHUB_CONTENT_TOKEN?.trim() ?? ''
  if (!/^[\w.-]{1,100}$/.test(owner) || !/^[\w.-]{1,100}$/.test(repo) || !/^[\w./-]{1,150}$/.test(branch) || branch.includes('..') || !token) {
    throw new Error('Configure GITHUB_CONTENT_OWNER, GITHUB_CONTENT_REPO, GITHUB_CONTENT_BRANCH and GITHUB_CONTENT_TOKEN on the server.')
  }
  return { owner, repo, branch, token }
}

async function github<T>(settings: GithubConfig, endpoint: string, method = 'GET', body?: unknown): Promise<T> {
  const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(settings.owner)}/${encodeURIComponent(settings.repo)}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${settings.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  })
  if (!response.ok) {
    throw new Error(`GitHub ${method} ${endpoint} failed (${response.status}). Check repository access and retry.`)
  }
  return response.json() as Promise<T>
}

export async function stageGithubImage(filename: string, content: Buffer): Promise<PendingUpload> {
  if (!/^[a-f0-9-]{36}\.webp$/.test(filename)) throw new Error('Invalid image filename.')
  const settings = config()
  const blob = await github<{ sha: string }>(settings, '/git/blobs', 'POST', { content: content.toString('base64'), encoding: 'base64' })
  if (!/^[a-f0-9]{40}$/.test(blob.sha)) throw new Error('GitHub returned an invalid image reference.')
  return { url: `/images/uploads/${filename}`, sha: blob.sha }
}

export function validatePendingUploads(input: unknown, content: SiteContent): PendingUpload[] {
  if (input === undefined) return []
  if (!Array.isArray(input) || input.length > 30) throw new Error('Invalid pending photo list.')
  const referenced = new Set([content.heroPhoto, content.showroomPhoto, ...content.projects.map(x => x.image), ...content.products.map(x => x.image), ...content.solutions.map(x => x.image)])
  const seen = new Set<string>()
  return input.map(row => {
    if (!row || typeof row !== 'object') throw new Error('Invalid pending photo.')
    const { url, sha } = row as Record<string, unknown>
    if (typeof url !== 'string' || !/^\/images\/uploads\/[a-f0-9-]{36}\.webp$/.test(url) || typeof sha !== 'string' || !/^[a-f0-9]{40}$/.test(sha) || !referenced.has(url) || seen.has(url)) {
      throw new Error('A pending photo is invalid or is no longer used. Please upload it again.')
    }
    seen.add(url)
    return { url, sha }
  })
}

export async function commitGithubContent(content: SiteContent, uploads: PendingUpload[]) {
  const settings = config()
  const refPath = `/git/ref/heads/${settings.branch.split('/').map(encodeURIComponent).join('/')}`
  const ref = await github<{ object: { sha: string } }>(settings, refPath)
  const head = await github<{ tree: { sha: string } }>(settings, `/git/commits/${ref.object.sha}`)
  const tree = await github<{ sha: string }>(settings, '/git/trees', 'POST', {
    base_tree: head.tree.sha,
    tree: [
      { path: 'src/content/site-content.json', mode: '100644', type: 'blob', content: `${JSON.stringify(content, null, 2)}\n` },
      ...uploads.map(upload => ({ path: `public${upload.url}`, mode: '100644', type: 'blob', sha: upload.sha })),
    ],
  })
  const commit = await github<{ sha: string; html_url: string }>(settings, '/git/commits', 'POST', {
    message: `Update Tejas website content${uploads.length ? ` and ${uploads.length} photo${uploads.length === 1 ? '' : 's'}` : ''}`,
    tree: tree.sha,
    parents: [ref.object.sha],
  })
  await github(settings, `/git/refs/heads/${settings.branch.split('/').map(encodeURIComponent).join('/')}`, 'PATCH', { sha: commit.sha, force: false })
  return { mode: 'github' as const, commitUrl: commit.html_url }
}
