import { promises as fs } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data.json')

let map: Map<string, string> | null = null

async function load() {
  if (map) return map
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    map = new Map(Object.entries(JSON.parse(data)))
  } catch (e) {
    map = new Map()
  }
  return map
}

async function save() {
  if (!map) return
  const obj = Object.fromEntries(map)
  await fs.writeFile(DATA_FILE, JSON.stringify(obj, null, 2), 'utf-8')
}

export default {
  async get(code: string) {
    const m = await load()
    return m.get(code)
  },
  async set(code: string, url: string) {
    const m = await load()
    m.set(code, url)
    await save()
  },
  async has(code: string) {
    const m = await load()
    return m.has(code)
  }
} 