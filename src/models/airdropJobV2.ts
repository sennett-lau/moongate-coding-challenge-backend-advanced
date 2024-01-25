import { Collection, ReturnDocument } from 'mongodb'
import { defaultDB } from '../database/mongodb'
import { AirdropJob } from '../types/airdropJob'

export const createAirdrop = async (
  redeemCode: string,
  nftContractAddress: string,
  quantity: number,
): Promise<AirdropJob> => {
  const collection: Collection<AirdropJob> = defaultDB.collection('AirdropJob')

  const data = await collection.insertOne({
    redeemCode,
    nftContractAddress,
    quantity,
    redeemedWalletAddress: '',
  })

  if (!data.insertedId) {
    throw new Error('Failed to create airdrop job')
  }

  return {
    redeemCode,
    nftContractAddress,
    quantity,
    redeemedWalletAddress: null,
  }
}

export const getAirdropJobByRedeemCode = async (
  redeemCode: string,
): Promise<AirdropJob | null> => {
  const collection: Collection<AirdropJob> = defaultDB.collection('AirdropJob')
  const data = await collection.findOne({ redeemCode })

  if (!data) {
    return null
  }

  return {
    redeemCode: data.redeemCode,
    nftContractAddress: data.nftContractAddress,
    redeemedWalletAddress: data.redeemedWalletAddress,
    quantity: data.quantity,
  }
}

export const listAirdropJobs = async (): Promise<AirdropJob[]> => {
  const collection: Collection<AirdropJob> = defaultDB.collection('AirdropJob')
  const data = await collection.find({}).toArray()

  if (!data) {
    return []
  }

  return data.map((item) => ({
    redeemCode: item.redeemCode,
    nftContractAddress: item.nftContractAddress,
    redeemedWalletAddress: item.redeemedWalletAddress,
    quantity: item.quantity,
  }))
}

export const updateAirdropJob = async (
  redeemCode: string,
  nftContractAddress: string,
  quantity: number,
  redeemedWalletAddress: string | null,
): Promise<AirdropJob> => {
  const collection: Collection<AirdropJob> = defaultDB.collection('AirdropJob')
  const data = await collection.findOneAndUpdate(
    {
      redeemCode,
    },
    {
      $set: {
        nftContractAddress: nftContractAddress,
        redeemedWalletAddress: redeemedWalletAddress,
        quantity: quantity,
      },
    },
    {
      returnDocument: ReturnDocument.AFTER,
    },
  )

  if (!data) {
    throw new Error('Airdrop job not found')
  }

  return {
    redeemCode: data.redeemCode,
    nftContractAddress: data.nftContractAddress,
    redeemedWalletAddress: data.redeemedWalletAddress,
    quantity: data.quantity,
  }
}

export const deleteAirdropJob = async (redeemCode: string): Promise<void> => {
  const collection: Collection<AirdropJob> = defaultDB.collection('AirdropJob')
  const data = await collection.findOneAndDelete({ redeemCode })

  if (!data?._id) {
    throw new Error('Airdrop job not found')
  }
}

export const redeemAirdropJob = async (
  redeemCode: string,
  walletAddress: string,
): Promise<AirdropJob> => {
  const collection: Collection<AirdropJob> = defaultDB.collection('AirdropJob')
  const data = await collection.findOneAndUpdate(
    {
      redeemCode,
      redeemedWalletAddress: '',
    },
    {
      $set: {
        redeemedWalletAddress: walletAddress,
      },
    },
    {
      returnDocument: ReturnDocument.AFTER,
    },
  )

  if (!data) {
    throw new Error('Airdrop job not found or has been redeemed')
  }

  return {
    redeemCode: data.redeemCode,
    nftContractAddress: data.nftContractAddress,
    redeemedWalletAddress: data.redeemedWalletAddress,
    quantity: data.quantity,
  }
}
