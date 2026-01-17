import { formatCurrency } from '../currencyConverter'

describe('formatCurrency', () => {
  it('formats positive numbers with two decimal places', () => {
    expect(formatCurrency(1234.56)).toBe('1,234.56')
  })

  it('formats whole numbers with two decimal places', () => {
    expect(formatCurrency(1000)).toBe('1,000.00')
  })

  it('formats zero with two decimal places', () => {
    expect(formatCurrency(0)).toBe('0.00')
  })

  it('formats negative numbers with two decimal places', () => {
    expect(formatCurrency(-500.75)).toBe('-500.75')
  })

  it('formats large numbers with comma separators', () => {
    expect(formatCurrency(1234567.89)).toBe('1,234,567.89')
  })

  it('rounds numbers to two decimal places', () => {
    expect(formatCurrency(99.999)).toBe('100.00')
  })

  it('formats small decimal amounts correctly', () => {
    expect(formatCurrency(0.99)).toBe('0.99')
  })

  it('formats numbers less than one with leading zero', () => {
    expect(formatCurrency(0.5)).toBe('0.50')
  })
})
