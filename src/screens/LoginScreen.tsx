import { View, Text, StyleSheet } from 'react-native'
import { FormInput } from '../ui/FormInput'
import { Button } from '../ui/Button'
import { useAuthStore } from '../stores/useAuthStore'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { AuthStackParamList } from '../navigation/AuthStack'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type LoginNavProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>

export const LoginScreen = () => {
  const navigation = useNavigation<LoginNavProp>()
const { login, setLoginField, loginUser } = useAuthStore()

const [errors, setErrors] = useState<{
  email?: string
  password?: string
  general?: string
}>({})

const handleLogin = () => {
  const newErrors: typeof errors = {}

  if (!login.email.includes('@')) {
    newErrors.email = 'Please enter a valid email address'
  }

  if (login.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters'
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    return
  }

  const result = loginUser()

  if (!result.success) {
    if (result.error?.toLowerCase().includes('email')) {
      setErrors({ general: result.error })
    } else if (result.error?.toLowerCase().includes('password')) {
      setErrors({ general: result.error })
    } else {
      setErrors({ general: result.error })
    }
    return
  }

  // ✅ Success
  setErrors({})
}

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Enter your details to access your vault</Text>
      </View>

      <View style={styles.form}>
        <FormInput
          label="Email Address"
          placeholder="name@example.com"
          value={login.email}
          onChangeText={(text) => setLoginField('email', text)}
        />

        <FormInput
          label="Password"
          placeholder="••••••••"
          secureTextEntry
          value={login.password}
          onChangeText={(text) => setLoginField('password', text)}
        />

        <Button title="Sign In" onPress={handleLogin} />
        {errors.general ? (
        <View style={{ alignItems: 'center', marginTop: 10 }}>
        <Text style={{ color: '#EF4444', fontSize: 13, marginBottom: 12 }}>
            {errors.general}
        </Text>
        </View>
        ) : null}
      </View>

      <Text style={styles.footer}>
        New here?
        <Text style={styles.link} onPress={() => navigation.navigate('Register')}> Create account</Text>
      </Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  form: {
    marginBottom: 40,
  },
  footer: {
    textAlign: 'center',
    fontSize: 15,
    color: '#64748B',
  },
  link: {
    color: '#006970',
    fontWeight: '700',
  },
})
