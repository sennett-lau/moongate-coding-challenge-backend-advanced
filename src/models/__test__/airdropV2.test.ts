import {
  connectMongoDB,
  defaultDB,
  disconnectMongoDB,
} from '../../database/mongodb'
import * as airdropService from '../airdropJobV2'

describe('AirdropJobStore', () => {
  beforeAll(async () => {
    await connectMongoDB()
  })

  beforeEach(async () => {
    await defaultDB.collection('AirdropJob').insertOne({
      redeemCode: 'beforeEach',
      nftContractAddress: '0x0000000000000000000000000',
      quantity: 1,
      redeemedWalletAddress: '',
    })
  })

  afterEach(async () => {
    await defaultDB.collection('AirdropJob').deleteMany({})
  })

  afterAll(async () => {
    await defaultDB.collection('AirdropJob').drop()
    await disconnectMongoDB()
  })

  test('listAirdropJobs', async () => {
    const jobs = await airdropService.listAirdropJobs()

    expect(jobs.length).toEqual(1)
  })

  test('createAirdrop', async () => {
    let jobs = await airdropService.listAirdropJobs()

    expect(jobs.length).toEqual(1)

    const job = await airdropService.createAirdrop(
      'code001',
      '0x0000000000000000000000000',
      1,
    )

    expect(job.redeemCode).toEqual('code001')
    expect(job.nftContractAddress).toEqual('0x0000000000000000000000000')
    expect(job.quantity).toEqual(1)

    jobs = await airdropService.listAirdropJobs()

    expect(jobs.length).toEqual(2)
  })

  test('getAirdropJobByRedeemCode', async () => {
    const job = await airdropService.getAirdropJobByRedeemCode('beforeEach')

    expect(job).not.toBeNull()
    expect(job!.redeemCode).toEqual('beforeEach')
    expect(job!.nftContractAddress).toEqual('0x0000000000000000000000000')
    expect(job!.quantity).toEqual(1)
  })

  test('updateAirdropJob', async () => {
    const job = await airdropService.getAirdropJobByRedeemCode('beforeEach')

    await airdropService.updateAirdropJob(
      job?.redeemCode!,
      job?.nftContractAddress!,
      2,
      job?.nftContractAddress!,
    )

    const updatedJob = await airdropService.getAirdropJobByRedeemCode(
      'beforeEach',
    )

    expect(updatedJob).not.toBeNull()
    expect(updatedJob!.redeemCode).toEqual('beforeEach')
    expect(updatedJob!.nftContractAddress).toEqual(
      '0x0000000000000000000000000',
    )
    expect(updatedJob!.quantity).toEqual(2)
  })

  test('updateAirdropJob - Error: Airdrop job not found', async () => {
    await expect(
      airdropService.updateAirdropJob(
        'notFound',
        '0x0000000000000000000000000',
        2,
        '0x0000000000000000000000000',
      ),
    ).rejects.toThrow('Airdrop job not found')
  })

  test('deleteAirdropJob', async () => {
    const job = await airdropService.getAirdropJobByRedeemCode('beforeEach')

    await airdropService.deleteAirdropJob(job?.redeemCode!)

    await airdropService.getAirdropJobByRedeemCode('beforeEach')

    const jobs = await airdropService.listAirdropJobs()

    expect(jobs.length).toEqual(0)
  })

  test('deleteAirdropJob - Error: Airdrop job not found', async () => {
    await expect(airdropService.deleteAirdropJob('notFound')).rejects.toThrow(
      'Airdrop job not found',
    )
  })

  test('redeemAirdropJob', async () => {
    const job = await airdropService.getAirdropJobByRedeemCode('beforeEach')

    await airdropService.redeemAirdropJob(job?.redeemCode!, '0xWallet')

    const updatedJob = await airdropService.getAirdropJobByRedeemCode(
      'beforeEach',
    )

    expect(updatedJob).not.toBeNull()
    expect(updatedJob!.redeemCode).toEqual('beforeEach')
    expect(updatedJob!.nftContractAddress).toEqual(
      '0x0000000000000000000000000',
    )
    expect(updatedJob!.quantity).toEqual(1)
    expect(updatedJob!.redeemedWalletAddress).toEqual('0xWallet')
  })

  test('redeemAirdropJob - Error: Airdrop job not found or has been redeemed', async () => {
    // no such job
    await expect(
      airdropService.redeemAirdropJob('notFound', '0xWallet'),
    ).rejects.toThrow('Airdrop job not found or has been redeemed')

    await airdropService.redeemAirdropJob('beforeEach', '0xWallet')

    // already redeemed
    await expect(
      airdropService.redeemAirdropJob('beforeEach', '0xWallet2'),
    ).rejects.toThrow('Airdrop job not found or has been redeemed')
  })
})
