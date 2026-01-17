import { View, Text, StyleSheet, Pressable } from 'react-native'
import { Transaction as TxType } from '../types/transaction'
import { formatCurrency } from '../lib/currencyConverter'
import { formatDate } from '../lib/formatDate'

export function Transaction({
  tx,
  onPress,
}: {
  tx: TxType
  onPress: () => void
}) {
  const incoming = tx.amount > 0

  return (
    <Pressable style={styles.transactionCard} onPress={onPress}>
      <View style={styles.transactionLeft}>
        <View style={styles.transactionIcon}>
          <Text>{incoming ? '⬇️' : '⬆️'}</Text>
        </View>
        <View>
          <Text style={styles.transactionTitle}>{tx.transferName}</Text>
          <Text style={styles.transactionDate}>
            {formatDate(tx.transferDate)}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.transactionAmount,
          incoming ? styles.incoming : styles.outgoing,
        ]}
      >
        {incoming ? '+' : '-'}RM{formatCurrency(Math.abs(tx.amount))}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E6F3F4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  transactionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1C1E',
  },

  transactionDate: {
    fontSize: 12,
    color: '#6C727A',
    marginTop: 2,
  },

  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },

  incoming: {
    color: '#16A34A',
  },

  outgoing: {
    color: '#DC2626',
  },
})