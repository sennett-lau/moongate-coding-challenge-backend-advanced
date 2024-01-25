import { AirdropJobStore } from '../airdropJob'
import { AirdropJob } from '../../types/airdropJob'

describe('AirdropJobStore', () => {
  let store: AirdropJobStore
  const sampleJob: AirdropJob = {
    quantity: 1,
    redeemCode: 'code123',
    nftContractAddress: '0xContract',
    redeemedWalletAddress: null,
  }

  beforeEach(() => {
    store = new AirdropJobStore()
  })

  test('addAirdropJob adds a job to the store', () => {
    store.addAirdropJob(sampleJob)
    expect(store.getAirdropJob(sampleJob.redeemCode)).toEqual(sampleJob)
  })

  test('getAirdropJob retrieves a job by redeem code', () => {
    store.addAirdropJob(sampleJob)
    const job = store.getAirdropJob(sampleJob.redeemCode)
    expect(job).toEqual(sampleJob)
  })

  test('listAirdropJobs returns all airdrop jobs', () => {
    store.addAirdropJob(sampleJob)
    expect(store.listAirdropJobs()).toContainEqual(sampleJob)
  })

  test('updateAirdropJob updates a job in the store', () => {
    store.addAirdropJob(sampleJob)
    const updatedJob = { ...sampleJob, contractAddress: '0xNewContract' }
    store.updateAirdropJob(updatedJob)
    expect(store.getAirdropJob(sampleJob.redeemCode)).toEqual(updatedJob)
  })

  test('deleteAirdropJob removes a job from the store', () => {
    store.addAirdropJob(sampleJob)
    store.deleteAirdropJob(sampleJob.redeemCode)
    expect(store.getAirdropJob(sampleJob.redeemCode)).toBeUndefined()
  })
})
