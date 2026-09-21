import type { Plugin } from 'vite'

// Local review fixture. Only module-list requests from explicit demo URLs are mocked.
export const guardDemoServer = (): Plugin => ({
  name: 'guard-demo-server',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url?.split('?')[0] !== '/api/config/module/get_modules_info') {
        return next()
      }
      let page: URL
      try {
        page = new URL(req.headers.referer || '')
      } catch {
        return next()
      }
      if (!page.pathname.startsWith('/guard-demo/')) return next()
      const mode = page.searchParams.get('guardMock')
      if (!['empty', 'child', 'error', 'slow'].includes(mode || '')) return next()
      const reply = () => {
        if (res.destroyed) return
        res.statusCode = mode === 'error' ? 503 : 200
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'no-store')
        res.setHeader('X-Guard-Demo', mode || '')
        res.end(JSON.stringify(mode === 'error'
          ? { message: 'Тестовая ошибка загрузки модулей' }
          : mode === 'child'
            ? [{ id: 999999, name: '__guard_demo_child__', active: true, status: [] }]
            : []))
      }
      if (mode === 'slow') setTimeout(reply, 8000)
      else reply()
    })
  }
})
