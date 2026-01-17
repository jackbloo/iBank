import { render, fireEvent } from '@testing-library/react-native'
import { Transaction } from '../Transaction'
import { formatCurrency } from '../../lib/currencyConverter'
import { formatDate } from '../../lib/formatDate'

jest.mock('../../lib/currencyConverter')
jest.mock('../../lib/formatDate')

describe('Transaction', () => {
  const mockOnPress = jest.fn()

  const mockIncomingTransaction = {
    refId: 'TXN001',
    transferDate: '2024-01-15',
    recipientName: 'John Doe',
    transferName: 'Salary',
    amount: 3000.00,
  }

  const mockOutgoingTransaction = {
    refId: 'TXN002',
    transferDate: '2024-01-14',
    recipientName: 'Jane Smith',
    transferName: 'Coffee Shop',
    amount: -50.75,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(formatCurrency as jest.Mock).mockReturnValue('50.75')
    ;(formatDate as jest.Mock).mockReturnValue('Jan, 15 2024')
  })

  it('renders without crashing', () => {
    const { toJSON } = render(
      <Transaction tx={mockIncomingTransaction} onPress={mockOnPress} />
    )
    expect(toJSON()).toBeTruthy()
  })

  it('displays transaction name', () => {
    const { getByText } = render(
      <Transaction tx={mockIncomingTransaction} onPress={mockOnPress} />
    )
    expect(getByText('Salary')).toBeTruthy()
  })

  it('calls formatDate with transaction date', () => {
    render(<Transaction tx={mockIncomingTransaction} onPress={mockOnPress} />)
    expect(formatDate).toHaveBeenCalledWith('2024-01-15')
  })

  it('displays formatted date', () => {
    const { getByText } = render(
      <Transaction tx={mockIncomingTransaction} onPress={mockOnPress} />
    )
    expect(getByText('Jan, 15 2024')).toBeTruthy()
  })

  it('calls formatCurrency with absolute amount value', () => {
    render(<Transaction tx={mockIncomingTransaction} onPress={mockOnPress} />)
    expect(formatCurrency).toHaveBeenCalledWith(3000.00)
  })

  it('displays incoming transaction with plus sign', () => {
    ;(formatCurrency as jest.Mock).mockReturnValue('3,000.00')
    const { getByText } = render(
      <Transaction tx={mockIncomingTransaction} onPress={mockOnPress} />
    )
    expect(getByText('+RM3,000.00')).toBeTruthy()
  })

  it('displays outgoing transaction with minus sign', () => {
    ;(formatCurrency as jest.Mock).mockReturnValue('50.75')
    const { getByText } = render(
      <Transaction tx={mockOutgoingTransaction} onPress={mockOnPress} />
    )
    expect(getByText('-RM50.75')).toBeTruthy()
  })

  it('shows down arrow icon for incoming transaction', () => {
    const { getByText } = render(
      <Transaction tx={mockIncomingTransaction} onPress={mockOnPress} />
    )
    expect(getByText('⬇️')).toBeTruthy()
  })

  it('shows up arrow icon for outgoing transaction', () => {
    const { getByText } = render(
      <Transaction tx={mockOutgoingTransaction} onPress={mockOnPress} />
    )
    expect(getByText('⬆️')).toBeTruthy()
  })

  it('calls onPress when transaction is pressed', () => {
    const { getByText } = render(
      <Transaction tx={mockIncomingTransaction} onPress={mockOnPress} />
    )
    
    fireEvent.press(getByText('Salary'))
    
    expect(mockOnPress).toHaveBeenCalledTimes(1)
  })

  it('calls onPress multiple times when pressed multiple times', () => {
    const { getByText } = render(
      <Transaction tx={mockIncomingTransaction} onPress={mockOnPress} />
    )
    
    const element = getByText('Salary')
    fireEvent.press(element)
    fireEvent.press(element)
    
    expect(mockOnPress).toHaveBeenCalledTimes(2)
  })

  it('uses absolute value for negative amounts', () => {
    render(<Transaction tx={mockOutgoingTransaction} onPress={mockOnPress} />)
    expect(formatCurrency).toHaveBeenCalledWith(50.75)
  })

  it('handles zero amount as outgoing', () => {
    const zeroTransaction = { ...mockIncomingTransaction, amount: 0 }
    const { getByText } = render(
      <Transaction tx={zeroTransaction} onPress={mockOnPress} />
    )
    expect(getByText('⬆️')).toBeTruthy()
  })

  it('renders different transaction names correctly', () => {
    const transaction1 = { ...mockIncomingTransaction, transferName: 'Rent Payment' }
    const { getByText, rerender } = render(
      <Transaction tx={transaction1} onPress={mockOnPress} />
    )
    expect(getByText('Rent Payment')).toBeTruthy()
    
    const transaction2 = { ...mockIncomingTransaction, transferName: 'Grocery Store' }
    rerender(<Transaction tx={transaction2} onPress={mockOnPress} />)
    expect(getByText('Grocery Store')).toBeTruthy()
  })

  it('applies correct styles for incoming transaction', () => {
    const { getByText } = render(
      <Transaction tx={mockIncomingTransaction} onPress={mockOnPress} />
    )
    
    const amount = getByText(/\+RM/)
    expect(amount.props.style).toBeDefined()
  })

  it('applies correct styles for outgoing transaction', () => {
    const { getByText } = render(
      <Transaction tx={mockOutgoingTransaction} onPress={mockOnPress} />
    )
    
    const amount = getByText(/-RM/)
    expect(amount.props.style).toBeDefined()
  })

  it('formats large incoming amounts correctly', () => {
    const largeTransaction = { ...mockIncomingTransaction, amount: 10000.50 }
    ;(formatCurrency as jest.Mock).mockReturnValue('10,000.50')
    
    const { getByText } = render(
      <Transaction tx={largeTransaction} onPress={mockOnPress} />
    )
    
    expect(formatCurrency).toHaveBeenCalledWith(10000.50)
    expect(getByText('+RM10,000.50')).toBeTruthy()
  })

  it('formats large outgoing amounts correctly', () => {
    const largeTransaction = { ...mockOutgoingTransaction, amount: -10000.50 }
    ;(formatCurrency as jest.Mock).mockReturnValue('10,000.50')
    
    const { getByText } = render(
      <Transaction tx={largeTransaction} onPress={mockOnPress} />
    )
    
    expect(formatCurrency).toHaveBeenCalledWith(10000.50)
    expect(getByText('-RM10,000.50')).toBeTruthy()
  })

  it('renders all transaction details together', () => {
    ;(formatCurrency as jest.Mock).mockReturnValue('50.75')
    ;(formatDate as jest.Mock).mockReturnValue('Jan, 14 2024')
    
    const { getByText } = render(
      <Transaction tx={mockOutgoingTransaction} onPress={mockOnPress} />
    )
    
    expect(getByText('Coffee Shop')).toBeTruthy()
    expect(getByText('Jan, 14 2024')).toBeTruthy()
    expect(getByText('-RM50.75')).toBeTruthy()
    expect(getByText('⬆️')).toBeTruthy()
  })

  it('does not call onPress without user interaction', () => {
    render(<Transaction tx={mockIncomingTransaction} onPress={mockOnPress} />)
    expect(mockOnPress).not.toHaveBeenCalled()
  })

  it('matches snapshot for incoming transaction', () => {
    const { toJSON } = render(
      <Transaction tx={mockIncomingTransaction} onPress={mockOnPress} />
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('matches snapshot for outgoing transaction', () => {
    const { toJSON } = render(
      <Transaction tx={mockOutgoingTransaction} onPress={mockOnPress} />
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
