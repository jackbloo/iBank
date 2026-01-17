import { renderHook, act } from '@testing-library/react-native'

jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
  },
}))

jest.mock('zustand/middleware', () => ({
  persist: jest.fn((config) => config),
  createJSONStorage: jest.fn(() => ({})),
}))

jest.mock('../../api/transactions')

import { useTransactionStore } from '../useTransactionStore'
import { fetchTransactions } from '../../api/transactions'

describe('useTransactionStore', () => {
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
    {
      refId: 'TXN003',
      transferDate: '2024-01-13',
      recipientName: 'Bob Johnson',
      transferName: 'Salary',
      amount: 3000.00,
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetchTransactions as jest.Mock).mockResolvedValue(mockTransactions)
    
    // Reset the store state
    const { result } = renderHook(() => useTransactionStore())
    act(() => {
      useTransactionStore.setState({
        transactions: [],
        selectedTransaction: null,
      })
    })
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useTransactionStore())
    
    expect(result.current.transactions).toEqual([])
    expect(result.current.selectedTransaction).toBe(null)
  })

  it('loads transactions successfully', async () => {
    const { result } = renderHook(() => useTransactionStore())
    
    await act(async () => {
      await result.current.loadTransactions()
    })
    
    expect(fetchTransactions).toHaveBeenCalled()
    expect(result.current.transactions).toEqual(mockTransactions)
  })

  it('selects a transaction', () => {
    const { result } = renderHook(() => useTransactionStore())
    
    act(() => {
      result.current.selectTransaction(mockTransactions[0])
    })
    
    expect(result.current.selectedTransaction).toEqual(mockTransactions[0])
  })

  it('gets transaction by id', async () => {
    const { result } = renderHook(() => useTransactionStore())
    
    // First load transactions
    await act(async () => {
      await result.current.loadTransactions()
    })
    
    const transaction = result.current.getById('TXN001')
    
    expect(transaction).toEqual(mockTransactions[0])
  })

  it('returns undefined when transaction id is not found', async () => {
    const { result } = renderHook(() => useTransactionStore())
    
    await act(async () => {
      await result.current.loadTransactions()
    })
    
    const transaction = result.current.getById('NONEXISTENT')
    
    expect(transaction).toBeUndefined()
  })

  it('can select different transactions', () => {
    const { result } = renderHook(() => useTransactionStore())
    
    act(() => {
      result.current.selectTransaction(mockTransactions[0])
    })
    
    expect(result.current.selectedTransaction).toEqual(mockTransactions[0])
    
    act(() => {
      result.current.selectTransaction(mockTransactions[1])
    })
    
    expect(result.current.selectedTransaction).toEqual(mockTransactions[1])
  })

  it('handles empty transactions array', () => {
    const { result } = renderHook(() => useTransactionStore())
    
    const transaction = result.current.getById('TXN001')
    
    expect(transaction).toBeUndefined()
  })

  it('loads transactions multiple times', async () => {
    const { result } = renderHook(() => useTransactionStore())
    
    await act(async () => {
      await result.current.loadTransactions()
    })
    
    expect(result.current.transactions).toHaveLength(3)
    
    const newMockTransactions = [
      {
        refId: 'TXN004',
        transferDate: '2024-01-16',
        recipientName: 'Alice',
        transferName: 'Restaurant',
        amount: -75.00,
      },
    ]
    
    ;(fetchTransactions as jest.Mock).mockResolvedValue(newMockTransactions)
    
    await act(async () => {
      await result.current.loadTransactions()
    })
    
    expect(result.current.transactions).toEqual(newMockTransactions)
    expect(fetchTransactions).toHaveBeenCalledTimes(2)
  })

  it('handles loadTransactions failure gracefully', async () => {
    const { result } = renderHook(() => useTransactionStore())
    
    ;(fetchTransactions as jest.Mock).mockRejectedValue(new Error('Network error'))
    
    await expect(
      act(async () => {
        await result.current.loadTransactions()
      })
    ).rejects.toThrow('Network error')
    
    expect(result.current.transactions).toEqual([])
  })

  it('finds correct transaction with case-sensitive refId', async () => {
    const { result } = renderHook(() => useTransactionStore())
    
    await act(async () => {
      await result.current.loadTransactions()
    })
    
    const transaction = result.current.getById('TXN002')
    
    expect(transaction?.refId).toBe('TXN002')
    expect(transaction?.transferName).toBe('Grocery Store')
  })

  it('maintains selected transaction after loading new transactions', async () => {
    const { result } = renderHook(() => useTransactionStore())
    
    await act(async () => {
      await result.current.loadTransactions()
    })
    
    act(() => {
      result.current.selectTransaction(mockTransactions[0])
    })
    
    await act(async () => {
      await result.current.loadTransactions()
    })
    
    // Selected transaction should still be the old one
    expect(result.current.selectedTransaction).toEqual(mockTransactions[0])
  })

  it('can select null transaction', () => {
    const { result } = renderHook(() => useTransactionStore())
    
    act(() => {
      result.current.selectTransaction(mockTransactions[0])
    })
    
    expect(result.current.selectedTransaction).toEqual(mockTransactions[0])
    
    act(() => {
      result.current.selectTransaction(null as any)
    })
    
    expect(result.current.selectedTransaction).toBe(null)
  })

  it('returns all transactions after loading', async () => {
    const { result } = renderHook(() => useTransactionStore())
    
    await act(async () => {
      await result.current.loadTransactions()
    })
    
    expect(result.current.transactions).toHaveLength(3)
    expect(result.current.transactions[0].refId).toBe('TXN001')
    expect(result.current.transactions[1].refId).toBe('TXN002')
    expect(result.current.transactions[2].refId).toBe('TXN003')
  })

  it('getById finds transaction with positive amount', async () => {
    const { result } = renderHook(() => useTransactionStore())
    
    await act(async () => {
      await result.current.loadTransactions()
    })
    
    const transaction = result.current.getById('TXN003')
    
    expect(transaction?.amount).toBe(3000.00)
    expect(transaction?.transferName).toBe('Salary')
  })
})
