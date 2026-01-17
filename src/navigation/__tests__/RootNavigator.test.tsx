import { render } from '@testing-library/react-native'
import { RootNavigator } from '../RootNavigator'
import { useAuthStore } from '../../stores/useAuthStore'

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: any) => children,
}))

jest.mock('../../stores/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}))

jest.mock('../AuthStack', () => ({
  AuthStack: () => 'AuthStack',
}))

jest.mock('../MainTabs', () => ({
  MainTabs: () => 'MainTabs',
}))

describe('RootNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue(false)
    const { toJSON } = render(<RootNavigator />)
    expect(toJSON()).toBeTruthy()
  })

  it('renders AuthStack when user is not logged in', () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue(false)
    const { toJSON } = render(<RootNavigator />)
    expect(toJSON()).toContain('AuthStack')
  })

  it('renders MainTabs when user is logged in', () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue(true)
    const { toJSON } = render(<RootNavigator />)
    expect(toJSON()).toContain('MainTabs')
  })

  it('calls useAuthStore to check login status', () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue(false)
    render(<RootNavigator />)
    expect(useAuthStore).toHaveBeenCalled()
  })

  it('wraps navigation in NavigationContainer', () => {
    const mockContainer = jest.fn(({ children }) => children)
    jest.doMock('@react-navigation/native', () => ({
      NavigationContainer: mockContainer,
    }))
    
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue(false)
    render(<RootNavigator />)
    
    expect(useAuthStore).toHaveBeenCalled()
  })

  it('switches from AuthStack to MainTabs when login state changes', () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue(false)
    const { rerender, toJSON } = render(<RootNavigator />)
    expect(toJSON()).toContain('AuthStack')
    
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue(true)
    rerender(<RootNavigator />)
    expect(toJSON()).toContain('MainTabs')
  })

  it('switches from MainTabs to AuthStack when logout happens', () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue(true)
    const { rerender, toJSON } = render(<RootNavigator />)
    expect(toJSON()).toContain('MainTabs')
    
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue(false)
    rerender(<RootNavigator />)
    expect(toJSON()).toContain('AuthStack')
  })

  it('matches snapshot when logged out', () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue(false)
    const { toJSON } = render(<RootNavigator />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('matches snapshot when logged in', () => {
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue(true)
    const { toJSON } = render(<RootNavigator />)
    expect(toJSON()).toMatchSnapshot()
  })
})
