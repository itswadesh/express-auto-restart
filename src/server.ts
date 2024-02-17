// File: server.ts
import express, { Request, Response } from 'express'
import chokidar from 'chokidar'
import { disconnectDatabase, getCollection } from './db'
import { FetchPrice, x } from './app'

// Initialize Express app
const app = express()
app.use(
  express.json({
    limit: '1mb',
    verify: (req, res, buf) => {
      // @ts-ignore
      req.rawBody = buf.toString() // rawBody required only for cashfree webhook
    },
  })
)
// Express routes
app.get('/:id', async (req: Request, res: Response) => {
  console.log(x, req.params.id)
  try {
    const ordersCollection = await getCollection(req.params.id || 'orders')
    const orders = await ordersCollection
      .find()
      .project({ orderNo: 1, sku: 1 })
      .limit(10)
      .toArray()
    return res.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return res.status(500).send('Error fetching orders')
  }
  // return res.json(x)
})

app.post('/fetch-price', async (req: Request, res: Response) => {
  console.log(x, req.params.id)
  try {
    const data = await FetchPrice( {args: req.body} )
    return res.json(data)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return res.status(500).send('Error fetching orders')
  }
  // return res.json(x)
})

// Start Express server
const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

// Watch for file changes without restarting the server
const watcher = chokidar.watch('./src', {
  ignored: /^(?!.*\.ts$)(?!.*\/db\.ts$)[^\n]*$/,
  persistent: true
})

watcher.on('ready', () => {
  console.log('Initial scan complete. Ready for changes.')
})

watcher.on('add', (path) => {
  console.log(`File ${path} has been added`)
})

watcher.on('change', (path) => {
  console.log(`File ${path} has been changed`)
  // disconnectDatabase()
})

watcher.on('unlink', (path) => {
  console.log(`File ${path} has been removed`)
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Server shutting down gracefully')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})
