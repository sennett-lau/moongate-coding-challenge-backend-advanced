import {
  generateRandomString,
  isValidContractAddress,
  isValidAddress,
} from '..'

describe('Utility Functions', () => {
  describe('generateRandomString', () => {
    it('should generate a string of the specified length', () => {
      const length = 10
      const randomString = generateRandomString(length)
      expect(randomString).toHaveLength(length)
    })

    it('should generate a string with alphanumeric characters', () => {
      const randomString = generateRandomString(10)
      expect(randomString).toMatch(/^[A-Za-z0-9]+$/)
    })
  })

  describe('isValidContractAddress', () => {
    it('should return false for an invalid address', () => {
      expect(isValidContractAddress('0xInvalid')).toBe(false)
    })

    it('should return true for a valid address', () => {
      expect(isValidContractAddress('0xed5af388653567af2f388e6224dc7c4b3241c544')).toBe(true)
    })

    // Add more tests based on additional validation logic if applicable
  })

  describe('isValidAddress', () => {
    it('should return false for an invalid address', () => {
      expect(isValidAddress('0xInvalid')).toBe(false)
    })

    it('should return true for a valid address', () => {
      expect(isValidAddress('0x54BE3a794282C030b15E43aE2bB182E14c409C5e')).toBe(true)
    })
  })
})
