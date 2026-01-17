import { createNativeStackNavigator } from '@react-navigation/native-stack'
import FinancingScreen from '../screens/FinancingScreen'
import TransactionDetailScreen from '../screens/FinancingDetailScreen'

export type FinancingStackParamList = {
  FinancingList: undefined
  DetailFinancing: {id: string}
}
const Stack = createNativeStackNavigator<FinancingStackParamList>()
export function FinancingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FinancingList" component={FinancingScreen} />
      <Stack.Screen name="DetailFinancing" component={TransactionDetailScreen} />
    </Stack.Navigator>
  )
}
