import { formatDate } from '../formatDate'

describe('formatDate', () => {
  it('formats a valid date string correctly', () => {
    const result = formatDate('2024-01-15')
    expect(result).toBe('Jan, 15 2024')
  })

  it('formats date with double-digit day', () => {
    const result = formatDate('2024-12-25')
    expect(result).toBe('Dec, 25 2024')
  })

  it('formats date with single-digit day', () => {
    const result = formatDate('2024-03-05')
    expect(result).toBe('Mar, 05 2024')
  })

  it('formats date at beginning of year', () => {
    const result = formatDate('2025-01-01')
    expect(result).toBe('Jan, 01 2025')
  })

  it('formats date at end of year', () => {
    const result = formatDate('2023-12-31')
    expect(result).toBe('Dec, 31 2023')
  })

  it('formats summer month correctly', () => {
    const result = formatDate('2024-07-04')
    expect(result).toBe('Jul, 04 2024')
  })

  it('formats February date correctly', () => {
    const result = formatDate('2024-02-29')
    expect(result).toBe('Feb, 29 2024')
  })

  it('handles ISO 8601 date format', () => {
    const result = formatDate('2024-06-15T10:30:00Z')
    expect(result).toContain('Jun, 15 2024')
  })

  it('formats dates from different years', () => {
    expect(formatDate('2020-05-20')).toBe('May, 20 2020')
    expect(formatDate('2030-11-11')).toBe('Nov, 11 2030')
  })
})
