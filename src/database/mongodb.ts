import { MongoClient, Db } from 'mongodb'
import dotenv from 'dotenv'
import { MongoMemoryServer } from 'mongodb-memory-server'

dotenv.config()

export let mongoDb: MongoMemoryServer

export let client: MongoClient

export let defaultDB: Db
export let testDB: Db

export const connectMongoDB = async () => {
  mongoDb = await MongoMemoryServer.create()

  const uri = mongoDb.getUri()

  client = new MongoClient(uri)

  await client.connect()

  defaultDB = client.db('DEFAULT')
}

export const disconnectMongoDB = async () => {
  await client.close()
  await mongoDb.stop()
}