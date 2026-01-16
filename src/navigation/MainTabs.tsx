import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {  TouchableOpacity } from 'react-native'
import {Text} from '../ui/Text'
import ProfileScreen from '../screens/ProfileScreen'

const Tab = createBottomTabNavigator()

function HomeScreen() {
  return <Text style={{ textAlign: 'center', marginTop: 40 }}>Home</Text>
}

export function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={ProfileScreen}   options={{
    tabBarButton: (props) => (
      <TouchableOpacity
        disabled
        style={[props.style, { opacity: 0.4 }]}
      ><Text>History</Text></TouchableOpacity>
    ),
  }} />
      <Tab.Screen name="Payment" component={ProfileScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}
