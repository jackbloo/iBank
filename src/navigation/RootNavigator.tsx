import { NavigationContainer } from '@react-navigation/native'
import { useAuthStore } from '../stores/useAuthStore'
import { AuthStack } from './AuthStack'
import { MainTabs } from './MainTabs'

export function RootNavigator() {
  const isLogin = useAuthStore((state) => state.isLogin)

  return (
    <NavigationContainer>
      {isLogin ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  )
}
