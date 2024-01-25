import { AirdropJob } from '../types/airdropJob'

export class AirdropJobStore {
  private airdropJobs: Map<string, AirdropJob>

  constructor() {
    this.airdropJobs = new Map<string, AirdropJob>()
  }

  addAirdropJob(airdropJob: AirdropJob): void {
    this.airdropJobs.set(airdropJob.redeemCode, airdropJob)
  }

  getAirdropJob(redeemCode: string): AirdropJob | undefined {
    return this.airdropJobs.get(redeemCode)
  }

  listAirdropJobs(): AirdropJob[] {
    return Array.from(this.airdropJobs.values())
  }

  updateAirdropJob(airdropJob: AirdropJob): void {
    this.airdropJobs.set(airdropJob.redeemCode, airdropJob)
  }

  deleteAirdropJob(redeemCode: string): void {
    this.airdropJobs.delete(redeemCode)
  }
}

export const airdropJobStore = new AirdropJobStore()
