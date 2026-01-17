import { render, fireEvent } from '@testing-library/react-native'
import { RegisterScreen } from '../RegistrationScreen'
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
          testID={`input-${label.toLowerCase().replace(/\s+/g, '-')}`}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
        />
        {error && <Text testID={`error-${label.toLowerCase().replace(/\s+/g, '-')}`}>{error}</Text>}
      </View>
    )
  },
}))

jest.mock('../../ui/Button', () => ({
  Button: ({ title, onPress }: any) => {
    const { Pressable, Text } = require('react-native')
    return (
      <Pressable testID="button-register" onPress={onPress}>
        <Text>{title}</Text>
      </Pressable>
    )
  },
}))

jest.mock('@react-native-community/checkbox', () => {
  const { Pressable } = require('react-native')
  return ({ value, onValueChange }: any) => (
    <Pressable 
      testID="checkbox-terms"
      onPress={() => onValueChange(!value)}
    />
  )
})

describe('RegisterScreen', () => {
  const mockRegister = {
    fullName: '',
    email: '',
    password: '',
    acceptedTerms: false,
  }
  const mockSetRegisterField = jest.fn()
  const mockRegisterUser = jest.fn()
  const mockResetForms = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    console.log = jest.fn()
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      register: mockRegister,
      setRegisterField: mockSetRegisterField,
      registerUser: mockRegisterUser,
      resetForms: mockResetForms,
    })
  })

  it('renders without crashing', () => {
    const { toJSON } = render(<RegisterScreen />)
    expect(toJSON()).toBeTruthy()
  })

  it('displays header with Create Account title', () => {
    const { getByText } = render(<RegisterScreen />)
    expect(getByText('Create Account')).toBeTruthy()
  })

  it('displays Get Started title and subtitle', () => {
    const { getByText } = render(<RegisterScreen />)
    expect(getByText('Get Started')).toBeTruthy()
    expect(getByText(/Experience the future of personal banking/)).toBeTruthy()
  })

  it('renders all input fields', () => {
    const { getByTestId } = render(<RegisterScreen />)
    expect(getByTestId('input-full-name')).toBeTruthy()
    expect(getByTestId('input-email-address')).toBeTruthy()
    expect(getByTestId('input-password')).toBeTruthy()
  })

  it('renders terms checkbox', () => {
    const { getByTestId } = render(<RegisterScreen />)
    expect(getByTestId('checkbox-terms')).toBeTruthy()
  })

  it('renders register button', () => {
    const { getByText } = render(<RegisterScreen />)
    expect(getByText('Register')).toBeTruthy()
  })

  it('calls setRegisterField when full name input changes', () => {
    const { getByTestId } = render(<RegisterScreen />)
    const fullNameInput = getByTestId('input-full-name')
    
    fireEvent.changeText(fullNameInput, 'John Doe')
    
    expect(mockSetRegisterField).toHaveBeenCalledWith('fullName', 'John Doe')
  })

  it('calls setRegisterField when email input changes', () => {
    const { getByTestId } = render(<RegisterScreen />)
    const emailInput = getByTestId('input-email-address')
    
    fireEvent.changeText(emailInput, 'test@example.com')
    
    expect(mockSetRegisterField).toHaveBeenCalledWith('email', 'test@example.com')
  })

  it('calls setRegisterField when password input changes', () => {
    const { getByTestId } = render(<RegisterScreen />)
    const passwordInput = getByTestId('input-password')
    
    fireEvent.changeText(passwordInput, 'password123')
    
    expect(mockSetRegisterField).toHaveBeenCalledWith('password', 'password123')
  })

  it('calls setRegisterField when terms checkbox is toggled', () => {
    const { getByTestId } = render(<RegisterScreen />)
    const checkbox = getByTestId('checkbox-terms')
    
    fireEvent.press(checkbox)
    
    expect(mockSetRegisterField).toHaveBeenCalledWith('acceptedTerms', true)
  })

  it('shows validation error when full name is too short', () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      register: { ...mockRegister, fullName: 'Jo', email: 'test@example.com', password: 'password123', acceptedTerms: true },
      setRegisterField: mockSetRegisterField,
      registerUser: mockRegisterUser,
      resetForms: mockResetForms,
    })

    const { getByTestId } = render(<RegisterScreen />)
    
    fireEvent.press(getByTestId('button-register'))
    
    expect(mockRegisterUser).not.toHaveBeenCalled()
  })

  it('shows validation error when email is invalid', () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      register: { ...mockRegister, fullName: 'John Doe', email: 'invalid-email', password: 'password123', acceptedTerms: true },
      setRegisterField: mockSetRegisterField,
      registerUser: mockRegisterUser,
      resetForms: mockResetForms,
    })

    const { getByTestId } = render(<RegisterScreen />)
    
    fireEvent.press(getByTestId('button-register'))
    
    expect(mockRegisterUser).not.toHaveBeenCalled()
  })

  it('shows validation error when password is too short', () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      register: { ...mockRegister, fullName: 'John Doe', email: 'test@example.com', password: '1234567', acceptedTerms: true },
      setRegisterField: mockSetRegisterField,
      registerUser: mockRegisterUser,
      resetForms: mockResetForms,
    })

    const { getByTestId } = render(<RegisterScreen />)
    
    fireEvent.press(getByTestId('button-register'))
    
    expect(mockRegisterUser).not.toHaveBeenCalled()
  })

  it('shows validation error when terms are not accepted', () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      register: { ...mockRegister, fullName: 'John Doe', email: 'test@example.com', password: 'password123', acceptedTerms: false },
      setRegisterField: mockSetRegisterField,
      registerUser: mockRegisterUser,
      resetForms: mockResetForms,
    })

    const { getByTestId } = render(<RegisterScreen />)
    
    fireEvent.press(getByTestId('button-register'))
    
    expect(mockRegisterUser).not.toHaveBeenCalled()
  })

  it('calls registerUser when form is valid', () => {
    mockRegisterUser.mockReturnValue({ success: true })
    
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      register: { fullName: 'John Doe', email: 'test@example.com', password: 'password123', acceptedTerms: true },
      setRegisterField: mockSetRegisterField,
      registerUser: mockRegisterUser,
      resetForms: mockResetForms,
    })

    const { getByTestId } = render(<RegisterScreen />)
    
    fireEvent.press(getByTestId('button-register'))
    
    expect(mockRegisterUser).toHaveBeenCalled()
  })

  it('resets forms and navigates to Login on successful registration', () => {
    mockRegisterUser.mockReturnValue({ success: true })
    
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      register: { fullName: 'John Doe', email: 'test@example.com', password: 'password123', acceptedTerms: true },
      setRegisterField: mockSetRegisterField,
      registerUser: mockRegisterUser,
      resetForms: mockResetForms,
    })

    const { getByTestId } = render(<RegisterScreen />)
    
    fireEvent.press(getByTestId('button-register'))
    
    expect(mockResetForms).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('Login')
  })

  it('handles registration failure with error message', () => {
    mockRegisterUser.mockReturnValue({ 
      success: false, 
      error: 'Email already exists' 
    })
    
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      register: { fullName: 'John Doe', email: 'test@example.com', password: 'password123', acceptedTerms: true },
      setRegisterField: mockSetRegisterField,
      registerUser: mockRegisterUser,
      resetForms: mockResetForms,
    })

    const { getByTestId } = render(<RegisterScreen />)
    
    fireEvent.press(getByTestId('button-register'))
    
    expect(mockRegisterUser).toHaveBeenCalled()
    expect(mockResetForms).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('navigates to Login when back button is pressed', () => {
    const { getByText } = render(<RegisterScreen />)
    const backButton = getByText('‹')
    
    fireEvent.press(backButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('Login')
  })

  it('navigates to Login when footer link is pressed', () => {
    const { getByText } = render(<RegisterScreen />)
    const loginLink = getByText(' Log In')
    
    fireEvent.press(loginLink)
    
    expect(mockNavigate).toHaveBeenCalledWith('Login')
  })

  it('displays terms and conditions text', () => {
    const { getByText } = render(<RegisterScreen />)
    expect(getByText(/I agree to the/)).toBeTruthy()
    expect(getByText('Terms of Service')).toBeTruthy()
    expect(getByText('Privacy Policy')).toBeTruthy()
  })

  it('validates all fields together', () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      register: { fullName: '', email: 'invalid', password: '123', acceptedTerms: false },
      setRegisterField: mockSetRegisterField,
      registerUser: mockRegisterUser,
      resetForms: mockResetForms,
    })

    const { getByTestId } = render(<RegisterScreen />)
    
    fireEvent.press(getByTestId('button-register'))
    
    expect(mockRegisterUser).not.toHaveBeenCalled()
  })

  it('matches snapshot', () => {
    const { toJSON } = render(<RegisterScreen />)
    expect(toJSON()).toMatchSnapshot()
  })
})
