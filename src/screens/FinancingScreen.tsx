import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useTransactionStore } from '../stores/useTransactionStore'
import { Transaction } from '../ui/Transaction'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { FinancingStackParamList } from '../navigation/FinancingStack'

type FinancingNavProp = NativeStackNavigationProp<
  FinancingStackParamList,
  'DetailFinancing'
>


export default function FinancingScreen() {
  const navigation = useNavigation<FinancingNavProp>()
  const { transactions, loadTransactions, selectTransaction } =
    useTransactionStore()

  useEffect(() => {
    loadTransactions()
  }, [])

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.title}>Financing</Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable style={styles.iconButton}>
            <Text style={styles.icon}>🔍</Text>
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Text style={styles.icon}>🔔</Text>
            <View style={styles.notificationDot} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>RM12,450.00</Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>Monthly Limit</Text>
              <Text style={styles.progressText}>65%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest Transactions</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        {transactions.map((tx) => (
          <Transaction
            key={tx.refId}
            tx={tx}
            onPress={() => {
              selectTransaction(tx)
              navigation.navigate('DetailFinancing', {id: tx.refId })
            }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F2F4F5',
  },

  header: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  greeting: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6C727A',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1C1E',
  },

  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  icon: {
    fontSize: 18,
  },

  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#006970',
  },

  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },

  balanceCard: {
    backgroundColor: '#006970',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },

  balanceLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '700',
  },

  balanceValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },

  progressContainer: {
    marginTop: 24,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  progressText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
  },

  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
  },

  progressFill: {
    width: '65%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1C1E',
  },

  seeAll: {
    fontSize: 14,
    fontWeight: '700',
    color: '#006970',
  },
})
