import { render, fireEvent } from '@testing-library/react-native'
import { LoginScreen } from '../LoginScreen'
import { useAuthStore } from '../../stores/useAuthStore'


jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  },
}))


const mockNavigate = jest.fn()

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: mockNavigate,
  })),
}))

jest.mock('../../stores/useAuthStore')

jest.mock('../../ui/FormInput', () => ({
  FormInput: ({ label, value, onChangeText, error, placeholder, secureTextEntry }: any) => {
    const { TextInput, Text, View } = require('react-native')
    return (
      <View>
        <Text>{label}</Text>
        <TextInput
          testID={`input-${label.toLowerCase().replace(' ', '-')}`}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
        />
        {error && <Text testID={`error-${label.toLowerCase().replace(' ', '-')}`}>{error}</Text>}
      </View>
    )
  },
}))

jest.mock('../../ui/Button', () => ({
  Button: ({ title, onPress }: any) => {
    const { Pressable, Text } = require('react-native')
    return (
      <Pressable testID="button-sign-in" onPress={onPress}>
        <Text>{title}</Text>
      </Pressable>
    )
  },
}))

describe('LoginScreen', () => {
  const mockLogin = { email: '', password: '' }
  const mockSetLoginField = jest.fn()
  const mockLoginUser = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      login: mockLogin,
      setLoginField: mockSetLoginField,
      loginUser: mockLoginUser,
    })
  })

  it('renders without crashing', () => {
    const { toJSON } = render(<LoginScreen />)
    expect(toJSON()).toBeTruthy()
  })

  it('displays welcome message', () => {
    const { getByText } = render(<LoginScreen />)
    expect(getByText('Welcome back')).toBeTruthy()
    expect(getByText('Enter your details to access your vault')).toBeTruthy()
  })

  it('renders email and password inputs', () => {
    const { getByTestId } = render(<LoginScreen />)
    expect(getByTestId('input-email-address')).toBeTruthy()
    expect(getByTestId('input-password')).toBeTruthy()
  })

  it('renders sign in button', () => {
    const { getByText } = render(<LoginScreen />)
    expect(getByText('Sign In')).toBeTruthy()
  })

  it('calls setLoginField when email input changes', () => {
    const { getByTestId } = render(<LoginScreen />)
    const emailInput = getByTestId('input-email-address')
    
    fireEvent.changeText(emailInput, 'test@example.com')
    
    expect(mockSetLoginField).toHaveBeenCalledWith('email', 'test@example.com')
  })

  it('calls setLoginField when password input changes', () => {
    const { getByTestId } = render(<LoginScreen />)
    const passwordInput = getByTestId('input-password')
    
    fireEvent.changeText(passwordInput, 'password123')
    
    expect(mockSetLoginField).toHaveBeenCalledWith('password', 'password123')
  })

  it('shows email validation error when email is invalid', () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      login: { email: 'invalid-email', password: 'password123' },
      setLoginField: mockSetLoginField,
      loginUser: mockLoginUser,
    })

    const { getByTestId, rerender } = render(<LoginScreen />)
    
    fireEvent.press(getByTestId('button-sign-in'))
    
    rerender(<LoginScreen />)
    
    expect(mockLoginUser).not.toHaveBeenCalled()
  })

  it('shows password validation error when password is too short', () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      login: { email: 'test@example.com', password: '123' },
      setLoginField: mockSetLoginField,
      loginUser: mockLoginUser,
    })

    const { getByTestId } = render(<LoginScreen />)
    
    fireEvent.press(getByTestId('button-sign-in'))
    
    expect(mockLoginUser).not.toHaveBeenCalled()
  })

  it('calls loginUser when form is valid', () => {
    mockLoginUser.mockReturnValue({ success: true })
    
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      login: { email: 'test@example.com', password: 'password123' },
      setLoginField: mockSetLoginField,
      loginUser: mockLoginUser,
    })

    const { getByTestId } = render(<LoginScreen />)
    
    fireEvent.press(getByTestId('button-sign-in'))
    
    expect(mockLoginUser).toHaveBeenCalled()
  })

  it('handles login failure with email error', () => {
    mockLoginUser.mockReturnValue({ 
      success: false, 
      error: 'Email not found' 
    })
    
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      login: { email: 'test@example.com', password: 'password123' },
      setLoginField: mockSetLoginField,
      loginUser: mockLoginUser,
    })

    const { getByTestId } = render(<LoginScreen />)
    
    fireEvent.press(getByTestId('button-sign-in'))
    
    expect(mockLoginUser).toHaveBeenCalled()
  })

  it('handles login failure with password error', () => {
    mockLoginUser.mockReturnValue({ 
      success: false, 
      error: 'Incorrect password' 
    })
    
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      login: { email: 'test@example.com', password: 'password123' },
      setLoginField: mockSetLoginField,
      loginUser: mockLoginUser,
    })

    const { getByTestId } = render(<LoginScreen />)
    
    fireEvent.press(getByTestId('button-sign-in'))
    
    expect(mockLoginUser).toHaveBeenCalled()
  })

  it('handles login failure with general error', () => {
    mockLoginUser.mockReturnValue({ 
      success: false, 
      error: 'Server error' 
    })
    
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      login: { email: 'test@example.com', password: 'password123' },
      setLoginField: mockSetLoginField,
      loginUser: mockLoginUser,
    })

    const { getByTestId } = render(<LoginScreen />)
    
    fireEvent.press(getByTestId('button-sign-in'))
    
    expect(mockLoginUser).toHaveBeenCalled()
  })

  it('navigates to Register screen when create account is pressed', () => {
    const { getByText } = render(<LoginScreen />)
    const createAccountLink = getByText(' Create account')
    
    fireEvent.press(createAccountLink)
    
    expect(mockNavigate).toHaveBeenCalledWith('Register')
  })

  it('validates both email and password together', () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      login: { email: 'invalid', password: '123' },
      setLoginField: mockSetLoginField,
      loginUser: mockLoginUser,
    })

    const { getByTestId } = render(<LoginScreen />)
    
    fireEvent.press(getByTestId('button-sign-in'))
    
    expect(mockLoginUser).not.toHaveBeenCalled()
  })

  it('clears errors on successful login', () => {
    mockLoginUser.mockReturnValue({ success: true })
    
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      login: { email: 'test@example.com', password: 'password123' },
      setLoginField: mockSetLoginField,
      loginUser: mockLoginUser,
    })

    const { getByTestId } = render(<LoginScreen />)
    
    fireEvent.press(getByTestId('button-sign-in'))
    
    expect(mockLoginUser).toHaveBeenCalled()
  })

  it('matches snapshot', () => {
    const { toJSON } = render(<LoginScreen />)
    expect(toJSON()).toMatchSnapshot()
  })
})
