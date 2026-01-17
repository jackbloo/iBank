import { renderHook, act } from '@testing-library/react-native'

jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
  },
}))

jest.mock('zustand/middleware', () => ({
  persist: jest.fn((config) => config),
  createJSONStorage: jest.fn(() => ({})),
}))

import { useAuthStore } from '../useAuthStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset the store state before each test
    const { result } = renderHook(() => useAuthStore())
    act(() => {
      result.current.resetForms()
      useAuthStore.setState({
        isLogin: false,
        currentUser: null,
        users: [],
      })
    })
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useAuthStore())
    
    expect(result.current.isLogin).toBe(false)
    expect(result.current.currentUser).toBe(null)
    expect(result.current.users).toEqual([])
    expect(result.current.login).toEqual({ email: '', password: '' })
    expect(result.current.register.acceptedTerms).toBe(false)
  })

  it('updates login email field', () => {
    const { result } = renderHook(() => useAuthStore())
    
    act(() => {
      result.current.setLoginField('email', 'test@example.com')
    })
    
    expect(result.current.login.email).toBe('test@example.com')
  })

  it('updates login password field', () => {
    const { result } = renderHook(() => useAuthStore())
    
    act(() => {
      result.current.setLoginField('password', 'password123')
    })
    
    expect(result.current.login.password).toBe('password123')
  })

  it('updates register fullName field', () => {
    const { result } = renderHook(() => useAuthStore())
    
    act(() => {
      result.current.setRegisterField('fullName', 'John Doe')
    })
    
    expect(result.current.register.fullName).toBe('John Doe')
  })

  it('updates register email field', () => {
    const { result } = renderHook(() => useAuthStore())
    
    act(() => {
      result.current.setRegisterField('email', 'test@example.com')
    })
    
    expect(result.current.register.email).toBe('test@example.com')
  })

  it('updates register password field', () => {
    const { result } = renderHook(() => useAuthStore())
    
    act(() => {
      result.current.setRegisterField('password', 'password123')
    })
    
    expect(result.current.register.password).toBe('password123')
  })

  it('updates register acceptedTerms field', () => {
    const { result } = renderHook(() => useAuthStore())
    
    act(() => {
      result.current.setRegisterField('acceptedTerms', true)
    })
    
    expect(result.current.register.acceptedTerms).toBe(true)
  })

  it('registers a new user successfully', () => {
    const { result } = renderHook(() => useAuthStore())
    
    act(() => {
      result.current.setRegisterField('fullName', 'John Doe')
      result.current.setRegisterField('email', 'john@example.com')
      result.current.setRegisterField('password', 'password123')
      result.current.setRegisterField('acceptedTerms', true)
    })
    
    let registerResult
    act(() => {
      registerResult = result.current.registerUser()
    })
    
    expect(registerResult).toEqual({ success: true })
    expect(result.current.users).toHaveLength(1)
    expect(result.current.users[0].email).toBe('john@example.com')
  })

  it('fails to register when terms are not accepted', () => {
    const { result } = renderHook(() => useAuthStore())
    
    act(() => {
      result.current.setRegisterField('fullName', 'John Doe')
      result.current.setRegisterField('email', 'john@example.com')
      result.current.setRegisterField('password', 'password123')
      result.current.setRegisterField('acceptedTerms', false)
    })
    
    let registerResult
    act(() => {
      registerResult = result.current.registerUser()
    })
    
    expect(registerResult).toEqual({ success: false, error: 'You must accept the terms' })
    expect(result.current.users).toHaveLength(0)
  })

  it('fails to register when email already exists', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // Register first user
    act(() => {
      result.current.setRegisterField('fullName', 'John Doe')
      result.current.setRegisterField('email', 'john@example.com')
      result.current.setRegisterField('password', 'password123')
      result.current.setRegisterField('acceptedTerms', true)
      result.current.registerUser()
    })
    
    // Try to register with same email
    act(() => {
      result.current.setRegisterField('fullName', 'Jane Doe')
      result.current.setRegisterField('email', 'JOHN@EXAMPLE.COM')
      result.current.setRegisterField('password', 'password456')
      result.current.setRegisterField('acceptedTerms', true)
    })
    
    let registerResult
    act(() => {
      registerResult = result.current.registerUser()
    })
    
    expect(registerResult).toEqual({ success: false, error: 'Email already registered' })
    expect(result.current.users).toHaveLength(1)
  })

  it('logs in user successfully', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // Register user first
    act(() => {
      result.current.setRegisterField('fullName', 'John Doe')
      result.current.setRegisterField('email', 'john@example.com')
      result.current.setRegisterField('password', 'password123')
      result.current.setRegisterField('acceptedTerms', true)
      result.current.registerUser()
    })
    
    // Login
    act(() => {
      result.current.setLoginField('email', 'john@example.com')
      result.current.setLoginField('password', 'password123')
    })
    
    let loginResult
    act(() => {
      loginResult = result.current.loginUser()
    })
    
    expect(loginResult).toEqual({ success: true })
    expect(result.current.isLogin).toBe(true)
    expect(result.current.currentUser).toEqual({
      email: 'john@example.com',
      password: 'password123',
      fullName: 'John Doe',
    })
  })

  it('fails to login with non-existent email', () => {
    const { result } = renderHook(() => useAuthStore())
    
    act(() => {
      result.current.setLoginField('email', 'nonexistent@example.com')
      result.current.setLoginField('password', 'password123')
    })
    
    let loginResult
    act(() => {
      loginResult = result.current.loginUser()
    })
    
    expect(loginResult).toEqual({ 
      success: false, 
      error: 'The email or password you entered is incorrect' 
    })
    expect(result.current.isLogin).toBe(false)
  })

  it('fails to login with incorrect password', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // Register user first
    act(() => {
      result.current.setRegisterField('fullName', 'John Doe')
      result.current.setRegisterField('email', 'john@example.com')
      result.current.setRegisterField('password', 'password123')
      result.current.setRegisterField('acceptedTerms', true)
      result.current.registerUser()
    })
    
    // Try to login with wrong password
    act(() => {
      result.current.setLoginField('email', 'john@example.com')
      result.current.setLoginField('password', 'wrongpassword')
    })
    
    let loginResult
    act(() => {
      loginResult = result.current.loginUser()
    })
    
    expect(loginResult).toEqual({ 
      success: false, 
      error: 'The email or password you entered is incorrect' 
    })
    expect(result.current.isLogin).toBe(false)
  })

  it('login is case-insensitive for email', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // Register user
    act(() => {
      result.current.setRegisterField('fullName', 'John Doe')
      result.current.setRegisterField('email', 'john@example.com')
      result.current.setRegisterField('password', 'password123')
      result.current.setRegisterField('acceptedTerms', true)
      result.current.registerUser()
    })
    
    // Login with uppercase email
    act(() => {
      result.current.setLoginField('email', 'JOHN@EXAMPLE.COM')
      result.current.setLoginField('password', 'password123')
    })
    
    let loginResult
    act(() => {
      loginResult = result.current.loginUser()
    })
    
    expect(loginResult).toEqual({ success: true })
    expect(result.current.isLogin).toBe(true)
  })

  it('logs out user successfully', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // Set logged in state
    act(() => {
      useAuthStore.setState({
        isLogin: true,
        currentUser: { email: 'john@example.com', password: 'password123', fullName: 'John Doe' },
        login: { email: 'john@example.com', password: 'password123' },
      })
    })
    
    act(() => {
      result.current.logout()
    })
    
    expect(result.current.isLogin).toBe(false)
    expect(result.current.currentUser).toBe(null)
    expect(result.current.login).toEqual({ email: '', password: '' })
  })

  it('resets all forms', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // Set some values
    act(() => {
      result.current.setLoginField('email', 'test@example.com')
      result.current.setLoginField('password', 'password123')
      result.current.setRegisterField('fullName', 'John Doe')
      result.current.setRegisterField('email', 'john@example.com')
      result.current.setRegisterField('password', 'password456')
      result.current.setRegisterField('acceptedTerms', true)
    })
    
    act(() => {
      result.current.resetForms()
    })
    
    expect(result.current.login).toEqual({ email: '', password: '' })
    expect(result.current.register).toEqual({
      email: '',
      password: '',
      fullName: '',
      acceptedTerms: false,
    })
  })

  it('maintains users list after logout', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // Register and login
    act(() => {
      result.current.setRegisterField('fullName', 'John Doe')
      result.current.setRegisterField('email', 'john@example.com')
      result.current.setRegisterField('password', 'password123')
      result.current.setRegisterField('acceptedTerms', true)
      result.current.registerUser()
      result.current.setLoginField('email', 'john@example.com')
      result.current.setLoginField('password', 'password123')
      result.current.loginUser()
    })
    
    const usersCount = result.current.users.length
    
    act(() => {
      result.current.logout()
    })
    
    expect(result.current.users).toHaveLength(usersCount)
  })

  it('allows multiple users to be registered', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // Register first user
    act(() => {
      result.current.setRegisterField('fullName', 'John Doe')
      result.current.setRegisterField('email', 'john@example.com')
      result.current.setRegisterField('password', 'password123')
      result.current.setRegisterField('acceptedTerms', true)
      result.current.registerUser()
    })
    
    // Register second user
    act(() => {
      result.current.setRegisterField('fullName', 'Jane Smith')
      result.current.setRegisterField('email', 'jane@example.com')
      result.current.setRegisterField('password', 'password456')
      result.current.setRegisterField('acceptedTerms', true)
      result.current.registerUser()
    })
    
    expect(result.current.users).toHaveLength(2)
    expect(result.current.users[0].email).toBe('john@example.com')
    expect(result.current.users[1].email).toBe('jane@example.com')
  })
})
