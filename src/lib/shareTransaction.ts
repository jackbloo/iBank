import { Share } from 'react-native'
import { formatDate } from './formatDate'
import { formatCurrency } from './currencyConverter'

type Transaction = {
  refId: string
  transferDate: string
  recipientName: string
  transferName: string
  amount: number
}

export async function shareTransfer(transaction: Transaction) {
  const isNegative = transaction.amount < 0

  const message = `
Transfer Details

Merchant: ${transaction.transferName}
Recipient: ${transaction.recipientName}
Amount: ${isNegative ? '-' : '+'}RM${formatCurrency(
    Math.abs(transaction.amount)
  )}
Date: ${formatDate(transaction.transferDate)}
Reference ID: ${transaction.refId}

Status: Completed
  `.trim()

  try {
    await Share.share({ message })
  } catch (error) {
    console.error('Share failed:', error)
  }
}