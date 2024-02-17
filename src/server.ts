// File: server.ts
import express, { Request, Response } from 'express'
import chokidar from 'chokidar'
import { getCollection } from './db'
import { x } from './app'

// Initialize Express app
const app = express()

// Express routes
app.get('/', async (req: Request, res: Response) => {
  console.log(x)
  try {
    const usersCollection = await getCollection('users')
    const users = await usersCollection.find().toArray()
    return res.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return res.status(500).send('Error fetching users')
  }
  return res.json(x)
})

// Start Express server
const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

// Watch for file changes without restarting the server
const watcher = chokidar.watch('./', {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
})

watcher.on('change', (path) => {
  console.log(`File ${path} has been changed`)
  // You can handle specific file changes here and execute necessary actions
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Server shutting down gracefully')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})
