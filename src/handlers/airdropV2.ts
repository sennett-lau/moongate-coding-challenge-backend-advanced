import { Router, Request, Response } from 'express'
import {
  authMiddleware,
  generateRandomString,
  isValidAddress,
  isValidContractAddress,
} from '../utils'
import { AirdropJob } from '../types/airdropJob'
import * as airdropService from '../models/airdropJobV2'
import { airdropNFT } from '../controllers/airdrop'

export const airdropRouterV2 = Router()

// @route  POST /api/v2/airdrop/generate
// @access Public
// @desc   generate an airdrop job with redeem code based on the quantity and nft contract address
// @param  quantity: number
// @param  nftContractAddress: string
airdropRouterV2.post('/generate', async (req: Request, res: Response) => {
  const body = req.body

  const { quantity, nftContractAddress } = body

  if (!quantity || !nftContractAddress) {
    res.status(400).send('Missing required fields')
    return
  }

  if (!isValidContractAddress(nftContractAddress)) {
    res.status(400).send('Invalid NFT contract')
    return
  }

  if (typeof quantity !== 'number' || quantity <= 0) {
    res.status(400).send('Invalid quantity')
    return
  }

  const code = generateRandomString(6)

  await airdropService.createAirdrop(code, nftContractAddress, quantity)

  res.status(200).send({
    redeemCode: code,
    quantity,
    nftContractAddress,
  })
})

// @route  POST /api/v2/airdrop/redeem
// @access Public
// @desc   redeem an airdrop job based on the redeem code and wallet address
// @param  redeemCode: string
// @param  walletAddress: string
airdropRouterV2.post('/redeem', async (req: Request, res: Response) => {
  const body = req.body

  const { redeemCode, walletAddress } = body

  if (!redeemCode || !walletAddress) {
    res.status(400).send('Missing required fields')
    return
  }

  if (!isValidAddress(walletAddress)) {
    res.status(400).send('Invalid wallet address')
    return
  }

  if (typeof redeemCode !== 'string') {
    res.status(400).send('Invalid redeem code')
    return
  }

  try {
    const job = await airdropService.getAirdropJobByRedeemCode(redeemCode)

    if (!job) {
      res.status(404).send('Airdrop job not found')
      return
    }

    if (job.redeemedWalletAddress) {
      res.status(400).send('Airdrop job already redeemed')
      return
    }

    await airdropNFT(job.nftContractAddress, walletAddress, job.quantity)

    job.redeemedWalletAddress = walletAddress

    await airdropService.redeemAirdropJob(job.redeemCode, walletAddress)

    res.status(200).send({
      redeemCode: redeemCode,
      quantity: job!.quantity,
      nftContractAddress: job!.nftContractAddress,
      redeemedWalletAddress: walletAddress,
    })
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})

// @route  GET /api/v2/airdrop
// @access Private
// @desc   list all the airdrop jobs
airdropRouterV2.get(
  '/',
  authMiddleware,
  async (req: Request, res: Response) => {
    const airdropJobs = await airdropService.listAirdropJobs()
    res.status(200).send({
      airdropJobs: airdropJobs,
    })
  },
)

// @route  GET /api/v2/airdrop/:redeemCode
// @access Private
// @desc   get an airdrop job based on the redeem code
airdropRouterV2.get(
  '/:redeemCode',
  authMiddleware,
  async (req: Request, res: Response) => {
    const redeemCode = req.params.redeemCode

    const job = await airdropService.getAirdropJobByRedeemCode(redeemCode)

    if (!job) {
      res.status(404).send('Airdrop job not found')
      return
    }

    res.status(200).send(job)
  },
)

// @route  PUT /api/v2/airdrop/:redeemCode
// @access Private
// @desc   update an airdrop job based on the redeem code
// @param  quantity: number
// @param  nftContractAddress: string
// @param  redeemedWalletAddress: string
airdropRouterV2.put(
  '/:redeemCode',
  authMiddleware,
  async (req: Request, res: Response) => {
    const redeemCode = req.params.redeemCode
    const body = req.body

    const { quantity, nftContractAddress, redeemedWalletAddress } = body

    if (!quantity || !nftContractAddress) {
      res.status(400).send('Missing required fields')
      return
    }

    if (!isValidContractAddress(nftContractAddress)) {
      res.status(400).send('Invalid NFT contract')
      return
    }

    if (redeemedWalletAddress && !isValidAddress(redeemedWalletAddress)) {
      res.status(400).send('Invalid wallet address')
      return
    }

    try {
      const job = await airdropService.updateAirdropJob(
        redeemCode,
        nftContractAddress,
        quantity,
        redeemedWalletAddress,
      )

      res.status(200).send(job)
    } catch (error: any) {
      res.status(400).send(error.message)
    }
  },
)

// @route  DELETE /api/v2/airdrop/:redeemCode
// @access Private
// @desc   delete an airdrop job based on the redeem code
airdropRouterV2.delete(
  '/:redeemCode',
  authMiddleware,
  async (req: Request, res: Response) => {
    const redeemCode = req.params.redeemCode

    try {
      await airdropService.deleteAirdropJob(redeemCode)

      res.status(200).send({
        message: 'Airdrop job deleted',
      })
    } catch (error: any) {
      res.status(400).send(error.message)
    }
  },
)
