import { MongoClient } from 'mongodb'
import 'dotenv/config'
let client: MongoClient | null = null
console.log('db.ts.................', client)
async function connectToDatabase() {
  if (!client) {
    try {
      console.log('MongoDB URI', process.env.MONGO_URI)
      client = await MongoClient.connect(process.env.MONGO_URI || '', {})
      console.log('Connected to MongoDB')
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
      client = null // Reset client on connection failure
      throw error // Rethrow to allow handling in server code
    }
  }
  return client.db()
}

export async function getCollection(collectionName: string) {
  const db = await connectToDatabase()
  return db.collection(collectionName)
}

// Graceful shutdown hook
process.on('SIGINT', async () => {
  disconnectDatabase()
  process.exit(0)
})

export async function disconnectDatabase() {
  if (client) {
    await client.close()
    console.log('MongoDB connection closed')
  }
}
