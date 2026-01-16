import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { FormInput } from '../ui/FormInput'
import { Button } from '../ui/Button'
import { useAuthStore } from '../stores/useAuthStore'
import CheckBox from '@react-native-community/checkbox'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthStackParamList } from '../navigation/AuthStack'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type RegisterNavProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Register'
>

export const RegisterScreen = () => {
const navigation = useNavigation<RegisterNavProp>()
const { register, setRegisterField, registerUser, resetForms } = useAuthStore()

const [errors, setErrors] = useState<{
  fullName?: string
  email?: string
  password?: string
  terms?: string
  general?: string
}>({})

const handleRegister = () => {
  const newErrors: typeof errors = {}
  if (register.fullName.trim().length < 3) {
    newErrors.fullName = 'Full name is required'
  }

  if (!register.email.includes('@')) {
    newErrors.email = 'Invalid email address'
  }

  if (register.password.length < 8) {
    newErrors.password = 'Minimum 8 characters'
  }

  if (!register.acceptedTerms) {
    newErrors.terms = 'You must accept the terms'
  }
  console.log(newErrors, 'newErrors')
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    return
  }

  const result = registerUser()
  if (!result.success) {
    setErrors({ general: result.error })
    return
  }

  setErrors({})
  resetForms()
  navigation.navigate('Login')
}

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Get Started</Text>
        <Text style={styles.subtitle}>
          Experience the future of personal banking with our minimalist tools.
        </Text>

        <FormInput
          label="Full Name"
          placeholder="Enter your full name"
          value={register.fullName}
          onChangeText={(text) => setRegisterField('fullName', text)}
          error={errors.fullName}
        />

        <FormInput
          label="Email Address"
          placeholder="name@example.com"
          value={register.email}
          onChangeText={(text) => setRegisterField('email', text)}
          error={errors.email}
        />

        <FormInput
          label="Password"
          placeholder="Min. 8 characters"
          secureTextEntry
          value={register.password}
          onChangeText={(text) => setRegisterField('password', text)}
          error={errors.password}
        />

        <View style={styles.termsRow}>
          <CheckBox
            value={register.acceptedTerms}
            onValueChange={(v) => setRegisterField('acceptedTerms', v)}
          />
          <Text style={styles.termsText}>
            I agree to the <Text style={styles.link}>Terms of Service</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>.
          </Text>
        </View>

        {errors.terms ? <Text style={styles.error}>{errors.terms}</Text> : null}
        {errors.general ? (
        <Text style={{ color: '#EF4444', fontSize: 13, marginBottom: 12 }}>
            {errors.general}
        </Text>
        ) : null}
        <Button title="Register" onPress={handleRegister} />

        <Text style={styles.footer}>
          Already have an account?
          <Text style={styles.footerLink} onPress={() => navigation.navigate('Login')}>
            {' '}
            Log In
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    justifyContent: 'space-between',
  },
  back: {
    fontSize: 28,
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 32,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#6B7280',
    marginBottom: 32,
    maxWidth: 280,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  termsText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  link: {
    color: '#111827',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  error: {
    color: '#EF4444',
    fontSize: 12,
    marginBottom: 12,
  },
  footer: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 15,
    color: '#6B7280',
  },
  footerLink: {
    fontWeight: '600',
    color: '#111827',
  },
})
