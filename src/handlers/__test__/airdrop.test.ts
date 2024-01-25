import express from 'express'
import request from 'supertest'
import { airdropRouter } from '../airdrop'
import bodyParser from 'body-parser'
import { AirdropJobStore, airdropJobStore } from '../../models/airdropJob'
import { AirdropJob } from '../../types/airdropJob'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api/airdrop', airdropRouter)

describe('airdropRouter', () => {
  const sampleContractAddress = '0xed5af388653567af2f388e6224dc7c4b3241c544'
  const sampleWalletAddress = '0x54BE3a794282C030b15E43aE2bB182E14c409C5e'

  describe('POST /generate', () => {
    it('should create and return a new airdrop job', async () => {
      const response = await request(app).post('/api/airdrop/generate').send({
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
        .post('/api/airdrop/generate')
        .send({ quantity: 10, nftContractAddress: '0xContractAddress' })

      expect(response.status).toBe(400)
      expect(response.text).toContain('Invalid NFT contract')
    })

    // More tests for /api/airdrop/generate can be added here
  })

  describe('POST /redeem', () => {
    beforeEach(() => {
      const airdropJob: AirdropJob = {
        redeemCode: 'code123',
        quantity: 1,
        nftContractAddress: sampleContractAddress,
        redeemedWalletAddress: null,
      }

      airdropJobStore.addAirdropJob(airdropJob)
    })

    it('should redeem an airdrop job', async () => {
      const response = await request(app).post('/api/airdrop/redeem').send({
        redeemCode: 'code123',
        walletAddress: sampleWalletAddress,
      })

      expect(response.status).toBe(200)
      expect(response.body.redeemCode).toBe('code123')
      expect(response.body.quantity).toBe(1)
      expect(response.body.nftContractAddress).toBe(sampleContractAddress)
      expect(response.body.redeemedWalletAddress).toBe(sampleWalletAddress)
    })

    // More tests for /api/airdrop/redeem can be added here
    
  })

  // More tests for other routes can be added here
})
