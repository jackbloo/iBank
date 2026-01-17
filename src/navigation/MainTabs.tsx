import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {  TouchableOpacity, View, StyleSheet } from 'react-native'
import {Text} from '../ui/Text'
import ProfileScreen from '../screens/ProfileScreen'
import { FinancingStack } from './FinancingStack'
import { Feather } from '@react-native-vector-icons/feather'

const Tab = createBottomTabNavigator()

function HistoryScreen() {
  return <Text style={{ textAlign: 'center', marginTop: 40 }}>History</Text>
}

function PaymentScreen() {
  return <Text style={{ textAlign: 'center', marginTop: 40 }}>Payment</Text>
}


export function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Financing" component={FinancingStack} options={{
  tabBarButton: (props) => {
    const focused = props?.['aria-selected'] ?? false
    return (
      <TouchableOpacity onPress={props.onPress}>
        <View style={style.container}>
          <Feather
            name="credit-card"
            size={20}
            color={focused ? '#006970' : 'grey'}
          />
          <Text
            style={[
              { color: focused ? '#006970' : 'grey' },
            ]}
          >
            Financing
          </Text>
        </View>
      </TouchableOpacity>
    )
  },
}}   />
      <Tab.Screen name="History" component={HistoryScreen}   options={{
    tabBarButton: () => (
      <TouchableOpacity
        disabled
        style={[{ opacity: 0.4 }]}
      ><View style={style.container}>
        <View>
            <Feather name="bar-chart" color="grey" size={20} />
        </View>
        <Text>History</Text>
        </View></TouchableOpacity>
    ),
  }} />
      <Tab.Screen name="Payment" component={PaymentScreen} options={{
    tabBarButton: () => (
      <TouchableOpacity
        disabled
        style={[{ opacity: 0.4 }]}
      ><View style={style.container}>
        <View>
            <Feather name="dollar-sign" color="grey" size={20} />
        </View>
        <Text>Payment</Text>
        </View></TouchableOpacity>
    ),
  }} />
      <Tab.Screen name="Profile" component={ProfileScreen}  options={{
  tabBarButton: (props) => {
    const focused = props?.['aria-selected'] ?? false
    return (
      <TouchableOpacity onPress={props.onPress}>
        <View style={style.container}>
          <Feather
            name="user"
            size={20}
            color={focused ? '#006970' : 'grey'}
          />
          <Text
            style={[
              { color: focused ? '#006970' : 'grey' },
            ]}
          >
            Profile
          </Text>
        </View>
      </TouchableOpacity>
    )
  },
}}   />
    </Tab.Navigator>
  )
}


const style = StyleSheet.create({
    container: {
      flexDirection: 'column', 
      alignItems: 'center', 
      marginTop: 5
    }
})