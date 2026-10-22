import { copyFileSync, cpSync, existsSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const sourceRoot = resolve(scriptDirectory, '..')
const repositoryRoot = resolve(sourceRoot, '..')
const distribution = join(sourceRoot, 'dist')
const sourceEntry = join(distribution, 'index.html')
const targetEntry = join(repositoryRoot, 'motion-web.html')
const legacyEntry = join(repositoryRoot, 'motion-web-legacy.html')

if (!existsSync(sourceEntry)) {
  throw new Error('Build ausente. Execute primeiro: pnpm build')
}

// Keep the version from the target branch available for comparison and recovery.
if (!existsSync(legacyEntry) && existsSync(targetEntry)) {
  copyFileSync(targetEntry, legacyEntry)
}

// Copy each build item into the repository root, merging assets/ rather than
// deleting the hardware models already tracked there.
for (const name of readdirSync(distribution)) {
  cpSync(join(distribution, name), join(repositoryRoot, name), {
    recursive: true,
    force: true,
  })
}
copyFileSync(sourceEntry, targetEntry)

console.log('Prévia React instalada na raiz: index.html e motion-web.html')
console.log('A versão anterior permanece em motion-web-legacy.html')
