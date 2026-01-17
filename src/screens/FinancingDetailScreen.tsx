import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { useTransactionStore } from '../stores/useTransactionStore'
import { formatCurrency } from '../lib/currencyConverter'
import { formatDate } from '../lib/formatDate'
import { shareTransfer } from '../lib/shareTransaction'
import Clipboard from '@react-native-clipboard/clipboard'
import { Feather } from '@react-native-vector-icons/feather';

type RootStackParamList = {
  DetailFinancing: { id: string }
}

export default function TransactionDetailScreen() {
  const navigation = useNavigation()
  const route =
    useRoute<RouteProp<RootStackParamList, 'DetailFinancing'>>()

  const transaction = useTransactionStore((state) =>
    state.getById(route.params.id)
  )

  const handleCopyRef = async (refId: string) => {
  Clipboard.setString(refId)
  Alert.alert('Copied', 'Transaction reference copied to clipboard')
}
    
  if (!transaction) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ padding: 20 }}>Transaction not found</Text>
      </SafeAreaView>
    )
  }

  const isNegative = transaction.amount < 0

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Transaction Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.center}>
          <View style={styles.avatar}>
            <Text style={styles.avatarIcon}>🏪</Text>
          </View>

          <Text
            style={[
              styles.amount,
              isNegative && styles.negativeAmount,
            ]}
          >
            {isNegative ? '-' : '+'}RM
            {formatCurrency(Math.abs(transaction.amount))}
          </Text>

          <Text style={styles.merchant}>
            {transaction.transferName}
          </Text>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Completed</Text>
          </View>
        </View>

        <View style={styles.card}>
          <DetailRow
            label="Recipient"
            value={transaction.recipientName}
            icon="🏬"
          />

          <Divider />

          <DetailRow
            label="Date"
            value={formatDate(transaction.transferDate)}
            icon="📅"
          />

          <Divider />
            <DetailRow
            label="Reference ID"
            value={transaction.refId}
            icon="📋"
            onPress={() => handleCopyRef(transaction.refId)}
            />
        </View>

        <View style={styles.map}>
          <Text style={styles.mapText}>📍 San Francisco, CA</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.primaryButton} onPress={() => shareTransfer(transaction)}>
          <Text style={styles.primaryButtonText}>
            Share Receipt
          </Text>
        </Pressable>

        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>
            Report an Issue
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

function DetailRow({
  label,
  value,
  icon,
  onPress
}: {
  label: string
  value: string
  icon: string
  onPress?: () => void
}) {
  return (
        <View
        style={styles.row}
        >
        <View>
            <Text style={styles.label}>{label}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.value}>{value}</Text>
            {
                onPress && (
                    <Pressable onPress={onPress} style={{ marginTop: 4, marginLeft: 4 }}>
                        <Feather name="copy" color="grey" size={15} />
                    </Pressable>
                )
            }
            </View>


        </View>

        <Text style={styles.rowIcon}>{icon}</Text>
        </View>
  )
}

function Divider() {
  return <View style={styles.divider} />
}


const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#fff' }, header: { flexDirection: 'row', alignItems: 'center', padding: 16, justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#F0F2F5', }, back: { fontSize: 28 }, headerTitle: { fontSize: 17, fontWeight: '700', }, content: { padding: 20, }, center: { alignItems: 'center', marginBottom: 32, }, avatar: { width: 80, height: 80, borderRadius: 20, backgroundColor: '#F8FAFB', alignItems: 'center', justifyContent: 'center', marginBottom: 16, }, avatarIcon: { fontSize: 32 }, amount: { fontSize: 36, fontWeight: '800', marginBottom: 4, }, negativeAmount: { color: '#D9443C', }, merchant: { color: '#6C727A', fontWeight: '500', }, statusBadge: { marginTop: 12, backgroundColor: '#EAF7EF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, }, statusText: { fontSize: 10, fontWeight: '700', color: '#15803D', textTransform: 'uppercase', }, card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#F0F2F5', marginBottom: 24, }, row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }, label: { fontSize: 10, color: '#9CA3AF', fontWeight: '700', textTransform: 'uppercase', marginBottom: 4, }, value: { fontSize: 15, fontWeight: '600', }, rowIcon: { fontSize: 20, opacity: 0.3 }, divider: { height: 1, backgroundColor: '#F0F2F5', marginVertical: 16, }, map: { height: 100, borderRadius: 16, backgroundColor: '#F8FAFB', justifyContent: 'flex-end', padding: 12, }, mapText: { fontSize: 12, fontWeight: '700', color: '#374151', }, footer: { padding: 16, borderTopWidth: 1, borderColor: '#F0F2F5', backgroundColor: '#fff', }, primaryButton: { backgroundColor: '#E6F1F1', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 12, }, primaryButtonText: { fontWeight: '700', color: '#006970', }, secondaryButton: { padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', }, secondaryButtonText: { fontWeight: '600', color: '#6B7280', }, })