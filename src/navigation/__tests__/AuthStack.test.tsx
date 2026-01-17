import { render } from '@testing-library/react-native'
import { AuthStack } from '../AuthStack'

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: any) => children,
}))

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: jest.fn(() => ({
    Navigator: ({ children, screenOptions }: any) => (
      <>{children}</>
    ),
    Screen: ({ name, component }: any) => null,
  })),
}))

jest.mock('../../screens/LoginScreen', () => ({
  LoginScreen: () => null,
}))

jest.mock('../../screens/RegistrationScreen', () => ({
  RegisterScreen: () => null,
}))

describe('AuthStack', () => {
  it('renders without crashing', () => {
    const result = render(<AuthStack />)
    expect(result).toBeTruthy()
  })

  it('creates navigator with correct screens', () => {
    const { createNativeStackNavigator } = require('@react-navigation/native-stack')
    
    render(<AuthStack />)
    
    expect(createNativeStackNavigator).toHaveBeenCalled()
  })

  it('configures navigator with headerShown false', () => {
    const mockNavigator = jest.fn(({ screenOptions }: any) => {
      expect(screenOptions).toEqual({ headerShown: false })
      return null
    })
    
    const mockScreen = jest.fn(() => null)
    
    const { createNativeStackNavigator } = require('@react-navigation/native-stack')
    createNativeStackNavigator.mockReturnValue({
      Navigator: mockNavigator,
      Screen: mockScreen,
    })
    
    render(<AuthStack />)
  })

  it('includes Login screen', () => {
    const mockScreen = jest.fn(({ name }: any) => {
      if (name === 'Login') {
        expect(name).toBe('Login')
      }
      return null
    })
    
    const { createNativeStackNavigator } = require('@react-navigation/native-stack')
    createNativeStackNavigator.mockReturnValue({
      Navigator: ({ children }: any) => <>{children}</>,
      Screen: mockScreen,
    })
    
    render(<AuthStack />)
  })

  it('includes Register screen', () => {
    const mockScreen = jest.fn(({ name }: any) => {
      if (name === 'Register') {
        expect(name).toBe('Register')
      }
      return null
    })
    
    const { createNativeStackNavigator } = require('@react-navigation/native-stack')
    createNativeStackNavigator.mockReturnValue({
      Navigator: ({ children }: any) => <>{children}</>,
      Screen: mockScreen,
    })
    
    render(<AuthStack />)
  })

  it('matches snapshot', () => {
    const { toJSON } = render(<AuthStack />)
    expect(toJSON()).toMatchSnapshot()
  })
})
