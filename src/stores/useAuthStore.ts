import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface User {
  email: string
  password: string
  fullName: string
}

interface AuthState {
  isLogin: boolean
  currentUser: User | null

  users: User[]

  login: {
    email: string
    password: string
  }
  register: {
    email: string
    password: string
    fullName: string
    acceptedTerms: boolean
  }

  setLoginField: (key: keyof AuthState['login'], value: string) => void
  setRegisterField: (
    key: keyof AuthState['register'],
    value: string | boolean
  ) => void

  registerUser: () => { success: boolean; error?: string }
  loginUser: () => { success: boolean; error?: string }

  logout: () => void
  resetForms: () => void
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLogin: false,
      currentUser: null,

      users: [],

      login: {
        email: '',
        password: '',
      },

      register: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptedTerms: false,
      },

      setLoginField: (key, value) =>
        set((state) => ({
          login: { ...state.login, [key]: value },
        })),

      setRegisterField: (key, value) =>
        set((state) => ({
          register: { ...state.register, [key]: value },
        })),

      registerUser: () => {
        const { users, register } = get()

        if (!register.acceptedTerms) {
          return { success: false, error: 'You must accept the terms' }
        }

        const exists = users.some(
          (u) => u.email.toLowerCase() === register.email.toLowerCase()
        )

        if (exists) {
          return { success: false, error: 'Email already registered' }
        }

        const newUser: User = {
          email: register.email,
          password: register.password,
          fullName: register.fullName,
        }

        set({
          users: [...users, newUser],
        })

        return { success: true }
      },

      loginUser: () => {
        const { users, login } = get()

        const user = users.find(
          (u) => u.email.toLowerCase() === login.email.toLowerCase()
        )

        if (!user) {
          return { success: false, error: 'The email or password you entered is incorrect' }
        }

        if (user.password !== login.password) {
          return { success: false, error: 'The email or password you entered is incorrect' }
        }

        set({
          isLogin: true,
          currentUser: user,
        })

        return { success: true }
      },

      logout: () =>
        set({
          isLogin: false,
          currentUser: null,
          login: { email: '', password: '' },
        }),

      resetForms: () =>
        set({
          login: { email: '', password: '' },
          register: {
            email: '',
            password: '',
            fullName: '',
            acceptedTerms: false,
          },
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

