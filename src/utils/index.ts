import { isAddress } from 'ethers'
import express, { Request, Response } from 'express'

export const generateRandomString = (length: number): string => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const isValidContractAddress = (address: string): boolean => {
  if (!isValidAddress(address)) return false

  // more validation like nft contract list checking etc.

  return true
}

export const isValidAddress = (address: string): boolean => {
  return isAddress(address)
}

export const authMiddleware = (req: Request, res: Response, next: any) => {
  const apiKey = req.headers['x-api-key']
  if (apiKey === 'admin') {
    next()
  } else {
    res.status(401).send('Unauthorized')
  }
}
