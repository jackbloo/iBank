import { Share } from 'react-native'
import { shareTransfer } from '../shareTransaction'
import { formatDate } from '../formatDate'
import { formatCurrency } from '../currencyConverter'

jest.mock('react-native', () => ({
  Share: {
    share: jest.fn(),
  },
}))

jest.mock('../formatDate')
jest.mock('../currencyConverter')

describe('shareTransfer', () => {
  const mockTransaction = {
    refId: 'TXN123456',
    transferDate: '2024-01-15',
    recipientName: 'John Doe',
    transferName: 'Coffee Shop',
    amount: 50.75,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(formatDate as jest.Mock).mockReturnValue('Jan, 15 2024')
    ;(formatCurrency as jest.Mock).mockReturnValue('50.75')
    ;(Share.share as jest.Mock).mockResolvedValue({ action: 'sharedAction' })
  })

  it('shares transaction with positive amount', async () => {
    await shareTransfer(mockTransaction)

    expect(Share.share).toHaveBeenCalledWith({
      message: expect.stringContaining('+RM50.75'),
    })
  })

  it('shares transaction with negative amount', async () => {
    const negativeTransaction = { ...mockTransaction, amount: -25.50 }
    ;(formatCurrency as jest.Mock).mockReturnValue('25.50')

    await shareTransfer(negativeTransaction)

    expect(Share.share).toHaveBeenCalledWith({
      message: expect.stringContaining('-RM25.50'),
    })
  })

  it('includes all transaction details in share message', async () => {
    await shareTransfer(mockTransaction)

    expect(Share.share).toHaveBeenCalledWith({
      message: expect.stringContaining('Coffee Shop'),
    })
    expect(Share.share).toHaveBeenCalledWith({
      message: expect.stringContaining('John Doe'),
    })
    expect(Share.share).toHaveBeenCalledWith({
      message: expect.stringContaining('TXN123456'),
    })
    expect(Share.share).toHaveBeenCalledWith({
      message: expect.stringContaining('Jan, 15 2024'),
    })
  })

  it('calls formatDate with transaction date', async () => {
    await shareTransfer(mockTransaction)

    expect(formatDate).toHaveBeenCalledWith('2024-01-15')
  })

  it('calls formatCurrency with absolute amount value', async () => {
    await shareTransfer(mockTransaction)

    expect(formatCurrency).toHaveBeenCalledWith(50.75)
  })

  it('calls formatCurrency with absolute value for negative amounts', async () => {
    const negativeTransaction = { ...mockTransaction, amount: -100.25 }

    await shareTransfer(negativeTransaction)

    expect(formatCurrency).toHaveBeenCalledWith(100.25)
  })

  it('includes status as Completed in message', async () => {
    await shareTransfer(mockTransaction)

    expect(Share.share).toHaveBeenCalledWith({
      message: expect.stringContaining('Status: Completed'),
    })
  })

  it('handles share error gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    const shareError = new Error('Share failed')
    ;(Share.share as jest.Mock).mockRejectedValue(shareError)

    await shareTransfer(mockTransaction)

    expect(consoleErrorSpy).toHaveBeenCalledWith('Share failed:', shareError)
    consoleErrorSpy.mockRestore()
  })

  it('handles zero amount transactions', async () => {
    const zeroTransaction = { ...mockTransaction, amount: 0 }
    ;(formatCurrency as jest.Mock).mockReturnValue('0.00')

    await shareTransfer(zeroTransaction)

    expect(Share.share).toHaveBeenCalledWith({
      message: expect.stringContaining('+RM0.00'),
    })
  })
})
