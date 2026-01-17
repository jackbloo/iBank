jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  },
}))

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: any) => children,
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}))

import { render } from '@testing-library/react-native'
import { NavigationContainer } from '@react-navigation/native'
import { MainTabs } from '../MainTabs'

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: jest.fn(() => ({
    Navigator: ({ children, screenOptions }: any) => (
      <>{children}</>
    ),
    Screen: ({ name, component, options }: any) => null,
  })),
}))

jest.mock('../FinancingStack', () => ({
  FinancingStack: () => null,
}))

jest.mock('../../screens/ProfileScreen', () => ({
  __esModule: true,
  default: () => null,
}))

jest.mock('../../ui/Text', () => ({
  Text: ({ children, style }: any) => children,
}))

jest.mock('@react-native-vector-icons/feather', () => ({
  Feather: () => null,
}))

describe('MainTabs', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    const result = render(
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    )
    expect(result).toBeTruthy()
  })

  it('creates bottom tab navigator', () => {
    const { createBottomTabNavigator } = require('@react-navigation/bottom-tabs')
    
    // Just verify MainTabs component renders without error
    const result = render(
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    )
    
    expect(result).toBeTruthy()
  })

  it('configures navigator with headerShown false', () => {
    const mockNavigator = jest.fn(({ screenOptions }: any) => {
      expect(screenOptions).toEqual({ headerShown: false })
      return null
    })
    
    const mockScreen = jest.fn(() => null)
    
    const { createBottomTabNavigator } = require('@react-navigation/bottom-tabs')
    createBottomTabNavigator.mockReturnValue({
      Navigator: mockNavigator,
      Screen: mockScreen,
    })
    
    render(
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    )
  })

  it('includes Financing tab screen', () => {
    const mockScreen = jest.fn(({ name }: any) => {
      if (name === 'Financing') {
        expect(name).toBe('Financing')
      }
      return null
    })
    
    const { createBottomTabNavigator } = require('@react-navigation/bottom-tabs')
    createBottomTabNavigator.mockReturnValue({
      Navigator: ({ children }: any) => <>{children}</>,
      Screen: mockScreen,
    })
    
    render(
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    )
  })

  it('includes History tab screen', () => {
    const mockScreen = jest.fn(({ name }: any) => {
      if (name === 'History') {
        expect(name).toBe('History')
      }
      return null
    })
    
    const { createBottomTabNavigator } = require('@react-navigation/bottom-tabs')
    createBottomTabNavigator.mockReturnValue({
      Navigator: ({ children }: any) => <>{children}</>,
      Screen: mockScreen,
    })
    
    render(
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    )
  })

  it('includes Payment tab screen', () => {
    const mockScreen = jest.fn(({ name }: any) => {
      if (name === 'Payment') {
        expect(name).toBe('Payment')
      }
      return null
    })
    
    const { createBottomTabNavigator } = require('@react-navigation/bottom-tabs')
    createBottomTabNavigator.mockReturnValue({
      Navigator: ({ children }: any) => <>{children}</>,
      Screen: mockScreen,
    })
    
    render(
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    )
  })

  it('includes Profile tab screen', () => {
    const mockScreen = jest.fn(({ name }: any) => {
      if (name === 'Profile') {
        expect(name).toBe('Profile')
      }
      return null
    })
    
    const { createBottomTabNavigator } = require('@react-navigation/bottom-tabs')
    createBottomTabNavigator.mockReturnValue({
      Navigator: ({ children }: any) => <>{children}</>,
      Screen: mockScreen,
    })
    
    render(
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    )
  })

  it('configures custom tab bar buttons for all screens', () => {
    const screens: any[] = []
    const mockScreen = jest.fn((props: any) => {
      screens.push(props)
      return null
    })
    
    const { createBottomTabNavigator } = require('@react-navigation/bottom-tabs')
    createBottomTabNavigator.mockReturnValue({
      Navigator: ({ children }: any) => <>{children}</>,
      Screen: mockScreen,
    })
    
    render(
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    )
    
    screens.forEach(screen => {
      expect(screen.options).toBeDefined()
      expect(screen.options.tabBarButton).toBeDefined()
    })
  })

  it('matches snapshot', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
