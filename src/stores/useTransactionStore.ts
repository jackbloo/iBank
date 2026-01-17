import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Transaction } from '../types/transaction'
import { fetchTransactions } from '../api/transactions'

interface TransactionState {
  transactions: Transaction[]
  selectedTransaction: Transaction | null
  loadTransactions: () => Promise<void>
  selectTransaction: (tx: Transaction) => void
  getById: (id: string) => Transaction | undefined  
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      selectedTransaction: null,

      loadTransactions: async () => {
        const data = await fetchTransactions()
        set({ transactions: data })
      },

      selectTransaction: (tx) => set({ selectedTransaction: tx }),
      getById: (id) =>
        get().transactions.find((t) => t.refId === id), 
    }),
    {
      name: 'transaction-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
