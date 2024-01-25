import express from 'express'
import request from 'supertest'
import bodyParser from 'body-parser'
import { airdropRouterV2 } from '../airdropV2'
import { connectMongoDB, disconnectMongoDB } from '../../database/mongodb'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api/v2/airdrop', airdropRouterV2)

describe('airdropRouter', () => {
  const sampleContractAddress = '0xed5af388653567af2f388e6224dc7c4b3241c544'
  const sampleWalletAddress = '0x54BE3a794282C030b15E43aE2bB182E14c409C5e'

  beforeAll(async () => {
    await connectMongoDB()
  })

  afterAll(async () => {
    await disconnectMongoDB()
  })

  describe('POST /generate', () => {
    it('should create and return a new airdrop job', async () => {
      const response = await request(app)
        .post('/api/v2/airdrop/generate')
        .send({
          quantity: 10,
          nftContractAddress: sampleContractAddress,
        })

      expect(response.status).toBe(200)
      expect(response.body.redeemCode).not.toBeNull()
      expect(response.body.quantity).toBe(10)
      expect(response.body.nftContractAddress).toBe(sampleContractAddress)
    })

    it('Error: Invalid NFT contract', async () => {
      const response = await request(app)
        .post('/api/v2/airdrop/generate')
        .send({ quantity: 10, nftContractAddress: '0xContractAddress' })

      expect(response.status).toBe(400)
      expect(response.text).toContain('Invalid NFT contract')
    })

    // More tests for /api/airdrop/generate can be added here
    
  })

  // More tests for other routes can be added here
})
