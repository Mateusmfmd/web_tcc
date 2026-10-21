import { cp, copyFile, mkdir, readdir, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const buildRoot = resolve(sourceRoot, 'dist')
const siteRoot = resolve(sourceRoot, '../motion-redesign')
const entries = await readdir(buildRoot, { withFileTypes: true })

await rm(siteRoot, { recursive: true, force: true })
await mkdir(siteRoot, { recursive: true })

for (const entry of entries) {
  const source = resolve(buildRoot, entry.name)
  if (entry.name === 'index.html') {
    await copyFile(source, resolve(siteRoot, 'motion-web.html'))
  } else if (entry.isDirectory()) {
    await cp(source, resolve(siteRoot, entry.name), { recursive: true })
  } else {
    await copyFile(source, resolve(siteRoot, entry.name))
  }
}

console.log(`Página estática atualizada em ${siteRoot}`)
