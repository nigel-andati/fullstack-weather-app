/**
 * Tries to install Docker using the platform package manager when available.
 * Docker itself is not an npm package — this script only orchestrates OS installers.
 */
import { spawnSync } from 'node:child_process'
import process from 'node:process'
import open from 'open'

const DOCS = 'https://docs.docker.com/get-docker/'

function tryWinget() {
  console.log('\n→ Attempting Docker Desktop via winget (Windows). Admin rights may be required.\n')
  const r = spawnSync(
    'winget',
    [
      'install',
      '-e',
      '--id',
      'Docker.DockerDesktop',
      '--accept-package-agreements',
      '--accept-source-agreements',
    ],
    { stdio: 'inherit', shell: true }
  )
  return r.status === 0
}

function tryBrew() {
  console.log('\n→ Attempting Docker Desktop via Homebrew (macOS).\n')
  const r = spawnSync('brew', ['install', '--cask', 'docker'], { stdio: 'inherit' })
  return r.status === 0
}

async function main() {
  const platform = process.platform
  console.log('Weather app: Docker helper (Docker is not an npm dependency — this runs your OS installer or opens docs).\n')

  if (platform === 'linux') {
    console.log('Linux: install Docker Engine or Docker Desktop for your distro, then run: docker --version')
    console.log(`Guide: ${DOCS}\n`)
    await open(DOCS)
    return
  }

  const ok = platform === 'win32' ? tryWinget() : platform === 'darwin' ? tryBrew() : false

  if (ok) {
    console.log('\nInstaller reported success. Start Docker Desktop, wait until it is “running”, then: npm run db:up\n')
    return
  }

  console.log('\nAutomatic install did not finish (cancelled, needs admin, winget/brew missing, or Docker already present).')
  console.log(`Opening install guide: ${DOCS}\n`)
  await open(DOCS)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
