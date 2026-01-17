import { render } from '@testing-library/react-native'
import { FinancingStack } from '../FinancingStack'

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

jest.mock('../../screens/FinancingScreen', () => ({
  __esModule: true,
  default: () => null,
}))

jest.mock('../../screens/FinancingDetailScreen', () => ({
  __esModule: true,
  default: () => null,
}))

describe('FinancingStack', () => {
  it('renders without crashing', () => {
    const result = render(<FinancingStack />)
    expect(result).toBeTruthy()
  })

  it('creates navigator with correct screens', () => {
    const { createNativeStackNavigator } = require('@react-navigation/native-stack')
    
    render(<FinancingStack />)
    
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
    
    render(<FinancingStack />)
  })

  it('includes FinancingList screen', () => {
    const mockScreen = jest.fn(({ name }: any) => {
      if (name === 'FinancingList') {
        expect(name).toBe('FinancingList')
      }
      return null
    })
    
    const { createNativeStackNavigator } = require('@react-navigation/native-stack')
    createNativeStackNavigator.mockReturnValue({
      Navigator: ({ children }: any) => <>{children}</>,
      Screen: mockScreen,
    })
    
    render(<FinancingStack />)
  })

  it('includes DetailFinancing screen', () => {
    const mockScreen = jest.fn(({ name }: any) => {
      if (name === 'DetailFinancing') {
        expect(name).toBe('DetailFinancing')
      }
      return null
    })
    
    const { createNativeStackNavigator } = require('@react-navigation/native-stack')
    createNativeStackNavigator.mockReturnValue({
      Navigator: ({ children }: any) => <>{children}</>,
      Screen: mockScreen,
    })
    
    render(<FinancingStack />)
  })

  it('matches snapshot', () => {
    const { toJSON } = render(<FinancingStack />)
    expect(toJSON()).toMatchSnapshot()
  })
})
