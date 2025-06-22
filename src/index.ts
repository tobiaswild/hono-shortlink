import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import urlStore from './urlStore.js'
import generateCode from './shortlink.js'

const app = new Hono()

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
  } while (urlStore.has(code))
  await urlStore.set(code, url)
  const shortUrl = `${c.req.url.split('/').slice(0, 3).join('/')}/${code}`
  return c.json({ short: shortUrl })
})

// GET /:code - redirect to original URL
app.get('/:code', async (c) => {
  const code = c.req.param('code')
  const url = await urlStore.get(code)
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
