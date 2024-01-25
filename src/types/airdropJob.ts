export interface AirdropJob {
  redeemCode: string
  nftContractAddress: string
  redeemedWalletAddress: string | null
  quantity: number
}
