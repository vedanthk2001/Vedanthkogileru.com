const fs = require('fs')
const path = require('path')

/** The voice panel's config comes from agent/, the single source of truth for
 *  the agent, not from an untracked .env file. `runtime` in agent.json picks the
 *  platform, and that platform's provider.json supplies the `client` values the
 *  browser needs. All of it is inlined into shipped JS, so only public-by-design
 *  values belong in `client`. A real environment variable of the same name
 *  still wins, for pointing a local build at another assistant. */
function voiceEnv() {
  const read = (...p) => JSON.parse(fs.readFileSync(path.join(__dirname, 'agent', ...p), 'utf8'))
  const { runtime } = read('agent.json')
  const env = { NEXT_PUBLIC_VOICE_RUNTIME: runtime, ...read('providers', runtime, 'provider.json').client }
  for (const k of Object.keys(env)) if (process.env[k]) env[k] = process.env[k]
  return env
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  env: voiceEnv(),
}

module.exports = nextConfig
