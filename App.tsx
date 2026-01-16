import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RootNavigator } from './src/navigation/RootNavigator'

function App() {
  const isDarkMode = useColorScheme() === 'dark'
  console.log('App render')

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.container}>
          <RootNavigator />
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
})

export default App
