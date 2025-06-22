import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data.json')

// Load mappings from file
async function loadUrlMap() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    return new Map(Object.entries(JSON.parse(data)))
  } catch (e) {
    return new Map()
  }
}

// Save mappings to file
async function saveUrlMap(map: Map<string, string>) {
  const obj = Object.fromEntries(map)
  await fs.writeFile(DATA_FILE, JSON.stringify(obj, null, 2), 'utf-8')
}

const app = new Hono()

// In-memory storage for shortlinks
const urlMap = new Map<string, string>()

// Helper to generate a random 6-character code
function generateCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// POST /shorten - create a shortlink
app.post('/shorten', async (c) => {
  const body = await c.req.json<{ url?: string }>()
  const url = body.url
  if (!url || typeof url !== 'string') {
    return c.json({ error: 'Invalid URL' }, 400)
  }
  // Generate unique code
  let code
  do {
    code = generateCode()
  } while (urlMap.has(code))
  urlMap.set(code, url)
  const shortUrl = `${c.req.url.split('/').slice(0, 3).join('/')}/${code}`
  return c.json({ short: shortUrl })
})

// GET /:code - redirect to original URL
app.get('/:code', (c) => {
  const code = c.req.param('code')
  const url = urlMap.get(code)
  if (!url) {
    return c.text('Shortlink not found', 404)
  }
  return c.redirect(url)
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
