import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer as createHttpServer } from 'node:http'
import { fileURLToPath } from 'node:url'
import { createServer, loadConfigFromFile } from 'vite'

test('local API proxy preserves upstream paths and scopes login cookies to /api', async () => {
  const requests = []
  const upstream = createHttpServer((req, res) => {
    requests.push({ method: req.method, url: req.url })
    res.setHeader('Set-Cookie', [
      'AccessToken=test-access; Domain=dev.pluxity.com; Path=/aiot/api; HttpOnly; Secure; SameSite=Lax',
      'RefreshToken=test-refresh; Domain=dev.pluxity.com; Path=/aiot/api; HttpOnly; Secure; SameSite=Lax',
    ])
    res.writeHead(204).end()
  })
  let vite
  try {
    await new Promise(resolve => upstream.listen(0, '127.0.0.1', resolve))
    const root = fileURLToPath(new URL('../', import.meta.url))
    const loaded = await loadConfigFromFile({ command: 'serve', mode: 'development' }, `${root}vite.config.ts`)
    const apiProxy = loaded.config.server.proxy['/api']
    vite = await createServer({
      configFile: false,
      root,
      logLevel: 'silent',
      server: {
        host: '127.0.0.1', port: 0,
        proxy: { '/api': { ...apiProxy, target: `http://127.0.0.1:${upstream.address().port}/aiot/api` } },
      },
      optimizeDeps: { noDiscovery: true, include: [] },
    })
    await vite.listen()
    const origin = `http://127.0.0.1:${vite.httpServer.address().port}`
    const response = await fetch(`${origin}/api/auth/sign-in`, { method: 'POST' })
    assert.equal(response.status, 204)
    const cookies = response.headers.getSetCookie()
    assert.equal(cookies.length, 2)
    for (const cookie of cookies) {
      assert.match(cookie, /; Path=\/api(?:;|$)/)
      assert.doesNotMatch(cookie, /Domain=/i)
      assert.match(cookie, /HttpOnly/)
      assert.match(cookie, /Secure/)
    }
    await fetch(`${origin}/api/events?sourceType=SENSOR&siteId=1`)
    assert.deepEqual(requests, [
      { method: 'POST', url: '/aiot/api/auth/sign-in' },
      { method: 'GET', url: '/aiot/api/events?sourceType=SENSOR&siteId=1' },
    ])
  } finally {
    await vite?.close()
    upstream.closeAllConnections()
    await new Promise(resolve => upstream.close(resolve))
  }
})
