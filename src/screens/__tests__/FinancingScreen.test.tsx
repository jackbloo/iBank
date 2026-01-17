import { render, fireEvent, waitFor } from '@testing-library/react-native'
import FinancingScreen from '../FinancingScreen'
import { useTransactionStore } from '../../stores/useTransactionStore'

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  },
}))

const mockNavigate = jest.fn()

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: mockNavigate,
  })),
}))

jest.mock('../../stores/useTransactionStore')

jest.mock('../../ui/Transaction', () => ({
  Transaction: ({ tx, onPress }: any) => {
    const { Pressable, Text } = require('react-native')
    return (
      <Pressable onPress={onPress} testID={`transaction-${tx.refId}`}>
        <Text>{tx.transferName}</Text>
        <Text>{tx.amount}</Text>
      </Pressable>
    )
  },
}))

describe('FinancingScreen', () => {
  const mockTransactions = [
    {
      refId: 'TXN001',
      transferDate: '2024-01-15',
      recipientName: 'John Doe',
      transferName: 'Coffee Shop',
      amount: -50.75,
    },
    {
      refId: 'TXN002',
      transferDate: '2024-01-14',
      recipientName: 'Jane Smith',
      transferName: 'Grocery Store',
      amount: -120.50,
    },
  ]

  const mockLoadTransactions = jest.fn()
  const mockSelectTransaction = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useTransactionStore as unknown as jest.Mock).mockReturnValue({
      transactions: mockTransactions,
      loadTransactions: mockLoadTransactions,
      selectTransaction: mockSelectTransaction,
    })
  })

  it('renders without crashing', () => {
    const { toJSON } = render(<FinancingScreen />)
    expect(toJSON()).toBeTruthy()
  })

  it('displays greeting and title', () => {
    const { getByText } = render(<FinancingScreen />)
    expect(getByText('Good morning')).toBeTruthy()
    expect(getByText('Financing')).toBeTruthy()
  })

  it('displays total balance', () => {
    const { getByText } = render(<FinancingScreen />)
    expect(getByText('Total Balance')).toBeTruthy()
    expect(getByText('RM12,450.00')).toBeTruthy()
  })

  it('displays monthly limit progress', () => {
    const { getByText } = render(<FinancingScreen />)
    expect(getByText('Monthly Limit')).toBeTruthy()
    expect(getByText('65%')).toBeTruthy()
  })

  it('displays Latest Transactions section', () => {
    const { getByText } = render(<FinancingScreen />)
    expect(getByText('Latest Transactions')).toBeTruthy()
    expect(getByText('See All')).toBeTruthy()
  })

  it('calls loadTransactions on mount', () => {
    render(<FinancingScreen />)
    expect(mockLoadTransactions).toHaveBeenCalled()
  })

  it('renders all transactions from store', () => {
    const { getByText } = render(<FinancingScreen />)
    expect(getByText('Coffee Shop')).toBeTruthy()
    expect(getByText('Grocery Store')).toBeTruthy()
  })

  it('navigates to detail screen when transaction is pressed', () => {
    const { getByTestId } = render(<FinancingScreen />)
    
    const transaction = getByTestId('transaction-TXN001')
    fireEvent.press(transaction)
    
    expect(mockSelectTransaction).toHaveBeenCalledWith(mockTransactions[0])
    expect(mockNavigate).toHaveBeenCalledWith('DetailFinancing', { id: 'TXN001' })
  })

  it('handles multiple transaction presses correctly', () => {
    const { getByTestId } = render(<FinancingScreen />)
    
    fireEvent.press(getByTestId('transaction-TXN001'))
    fireEvent.press(getByTestId('transaction-TXN002'))
    
    expect(mockSelectTransaction).toHaveBeenCalledTimes(2)
    expect(mockNavigate).toHaveBeenCalledTimes(2)
  })

  it('displays header action icons', () => {
    const { getByText } = render(<FinancingScreen />)
    expect(getByText('🔍')).toBeTruthy()
    expect(getByText('🔔')).toBeTruthy()
  })

  it('renders empty transaction list when no transactions', () => {
    ;(useTransactionStore as unknown as jest.Mock).mockReturnValue({
      transactions: [],
      loadTransactions: mockLoadTransactions,
      selectTransaction: mockSelectTransaction,
    })

    const { queryByTestId } = render(<FinancingScreen />)
    expect(queryByTestId(/transaction-/)).toBeNull()
  })

  it('renders correct number of transactions', () => {
    const { getAllByText } = render(<FinancingScreen />)
    const transactionNames = getAllByText(/Coffee Shop|Grocery Store/)
    expect(transactionNames.length).toBe(2)
  })

  it('calls selectTransaction with correct transaction data', () => {
    const { getByTestId } = render(<FinancingScreen />)
    
    fireEvent.press(getByTestId('transaction-TXN002'))
    
    expect(mockSelectTransaction).toHaveBeenCalledWith(mockTransactions[1])
  })

  it('matches snapshot', () => {
    const { toJSON } = render(<FinancingScreen />)
    expect(toJSON()).toMatchSnapshot()
  })
})
