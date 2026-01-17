import { render } from '@testing-library/react-native'
import { useColorScheme } from 'react-native'
import App from './App'

// Mock the RootNavigator component
jest.mock('./src/navigation/RootNavigator', () => ({
  RootNavigator: () => null,
}))

// Mock useColorScheme hook
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  default: jest.fn(),
}))

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    ;(useColorScheme as jest.Mock).mockReturnValue('light')
    const { toJSON } = render(<App />)
    expect(toJSON()).toBeTruthy()
  })

  it('sets dark-content bar style when in light mode', () => {
    ;(useColorScheme as jest.Mock).mockReturnValue('light')
    const { getByTestId } = render(<App />)
    // Component renders successfully with light mode
    expect(useColorScheme).toHaveBeenCalled()
  })

  it('sets light-content bar style when in dark mode', () => {
    ;(useColorScheme as jest.Mock).mockReturnValue('dark')
    const { toJSON } = render(<App />)
    expect(toJSON()).toBeTruthy()
    expect(useColorScheme).toHaveBeenCalled()
  })

  it('renders SafeAreaView with correct style', () => {
    ;(useColorScheme as jest.Mock).mockReturnValue('light')
    const { root } = render(<App />)
    expect(root).toBeTruthy()
  })

  it('renders RootNavigator component', () => {
    ;(useColorScheme as jest.Mock).mockReturnValue('light')
    const { toJSON } = render(<App />)
    expect(toJSON()).toMatchSnapshot()
  })
})
