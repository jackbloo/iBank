import { View, Text, StyleSheet, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '../stores/useAuthStore'

export default function ProfileScreen() {
  const logout = useAuthStore((state) => state.logout) 
  const currentUser = useAuthStore((state) => state.currentUser)


  const handleLogout = () => {
    logout()
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerSide} />
        <Text style={styles.headerTitle}>User Profile</Text>
        <View style={styles.headerSide}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarIcon}>👤</Text>
        </View>

        <Text style={styles.name}>{currentUser?.fullName}</Text>
        <Text style={styles.version}>Version 1.0.0</Text>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  headerSide: {
    width: 40,
    alignItems: 'flex-end',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },

  settingsIcon: {
    fontSize: 18,
    opacity: 0.4,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },

  avatarIcon: {
    fontSize: 40,
    opacity: 0.2,
  },

  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },

  version: {
    fontSize: 13,
    opacity: 0.4,
    marginBottom: 32,
  },

  logoutButton: {
    height: 48,
    minWidth: 200,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutText: {
    fontSize: 14,
    fontWeight: '500',
  },
})
