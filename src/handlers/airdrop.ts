import { Router, Request, Response } from 'express'
import {
  authMiddleware,
  generateRandomString,
  isValidAddress,
  isValidContractAddress,
} from '../utils'
import { AirdropJob } from '../types/airdropJob'
import { airdropJobStore } from '../models/airdropJob'
import { airdropNFT } from '../controllers/airdrop'

export const airdropRouter = Router()

// @route  POST /api/airdrop/generate
// @access Public
// @desc   generate an airdrop job with redeem code based on the quantity and nft contract address
// @param  quantity: number
// @param  nftContractAddress: string
airdropRouter.post('/generate', (req: Request, res: Response) => {
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

  const airdropJob: AirdropJob = {
    redeemCode: code,
    quantity: quantity,
    nftContractAddress: nftContractAddress,
    redeemedWalletAddress: null,
  }

  airdropJobStore.addAirdropJob(airdropJob)

  res.status(200).send({
    redeemCode: code,
    quantity: quantity,
    nftContractAddress: nftContractAddress,
  })
})

// @route  POST /api/airdrop/redeem
// @access Public
// @desc   redeem an airdrop job based on the redeem code and wallet address
// @param  redeemCode: string
// @param  walletAddress: string
airdropRouter.post('/redeem', async (req: Request, res: Response) => {
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
    const job = airdropJobStore.getAirdropJob(redeemCode)

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

    airdropJobStore.updateAirdropJob(job)

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

// // @route  GET /api/airdrop
// // @access Private
// // @desc   list all the airdrop jobs
// airdropRouter.get('/', authMiddleware, (req: Request, res: Response) => {
//   const airdropJobs = airdropJobStore.listAirdropJobs()
//   res.status(200).send({
//     airdropJobs: airdropJobs,
//   })
// })

// @route  GET /api/airdrop/:redeemCode
// @access Private
// @desc   get an airdrop job based on the redeem code
airdropRouter.get(
  '/:redeemCode',
  authMiddleware,
  (req: Request, res: Response) => {
    const redeemCode = req.params.redeemCode

    const job = airdropJobStore.getAirdropJob(redeemCode)

    if (!job) {
      res.status(404).send('Airdrop job not found')
      return
    }

    res.status(200).send(job)
  },
)

// @route  PUT /api/airdrop/:redeemCode
// @access Private
// @desc   update an airdrop job based on the redeem code
// @param  quantity: number
// @param  nftContractAddress: string
// @param  redeemedWalletAddress: string
airdropRouter.put(
  '/:redeemCode',
  authMiddleware,
  (req: Request, res: Response) => {
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

    const job = airdropJobStore.getAirdropJob(redeemCode)

    if (!job) {
      res.status(404).send('Airdrop job not found')
      return
    }

    job.quantity = quantity
    job.nftContractAddress = nftContractAddress
    job.redeemedWalletAddress = redeemedWalletAddress

    airdropJobStore.updateAirdropJob(job)

    res.status(200).send(job)
  },
)

// @route  DELETE /api/airdrop/:redeemCode
// @access Private
// @desc   delete an airdrop job based on the redeem code
airdropRouter.delete(
  '/:redeemCode',
  authMiddleware,
  (req: Request, res: Response) => {
    const redeemCode = req.params.redeemCode

    const job = airdropJobStore.getAirdropJob(redeemCode)

    if (!job) {
      res.status(404).send('Airdrop job not found')
      return
    }

    airdropJobStore.deleteAirdropJob(redeemCode)

    res.status(200).send({
      message: 'Airdrop job deleted',
    })
  },
)
