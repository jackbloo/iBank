import { render, fireEvent } from '@testing-library/react-native'
import ProfileScreen from '../ProfileScreen'
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

jest.mock('../../stores/useAuthStore')

describe('ProfileScreen', () => {
  const mockLogout = jest.fn()
  const mockCurrentUser = {
    id: '1',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuthStore as unknown as jest.Mock).mockImplementation((selector: any) => {
      const state = {
        logout: mockLogout,
        currentUser: mockCurrentUser,
      }
      return selector(state)
    })
  })

  it('renders without crashing', () => {
    const { toJSON } = render(<ProfileScreen />)
    expect(toJSON()).toBeTruthy()
  })

  it('displays header title', () => {
    const { getByText } = render(<ProfileScreen />)
    expect(getByText('User Profile')).toBeTruthy()
  })

  it('displays user name from store', () => {
    const { getByText } = render(<ProfileScreen />)
    expect(getByText('John Doe')).toBeTruthy()
  })

  it('displays version number', () => {
    const { getByText } = render(<ProfileScreen />)
    expect(getByText('Version 1.0.0')).toBeTruthy()
  })

  it('renders logout button', () => {
    const { getByText } = render(<ProfileScreen />)
    expect(getByText('Logout')).toBeTruthy()
  })

  it('calls logout when logout button is pressed', () => {
    const { getByText } = render(<ProfileScreen />)
    const logoutButton = getByText('Logout')
    
    fireEvent.press(logoutButton)
    
    expect(mockLogout).toHaveBeenCalled()
  })

  it('displays settings icon', () => {
    const { getByText } = render(<ProfileScreen />)
    expect(getByText('⚙️')).toBeTruthy()
  })

  it('displays avatar icon', () => {
    const { getByText } = render(<ProfileScreen />)
    expect(getByText('👤')).toBeTruthy()
  })

  it('handles null currentUser gracefully', () => {
    ;(useAuthStore as unknown as jest.Mock).mockImplementation((selector: any) => {
      const state = {
        logout: mockLogout,
        currentUser: null,
      }
      return selector(state)
    })

    const { toJSON } = render(<ProfileScreen />)
    expect(toJSON()).toBeTruthy()
  })

  it('displays different user name when currentUser changes', () => {
    const differentUser = {
      id: '2',
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
    }

    ;(useAuthStore as unknown as jest.Mock).mockImplementation((selector: any) => {
      const state = {
        logout: mockLogout,
        currentUser: differentUser,
      }
      return selector(state)
    })

    const { getByText } = render(<ProfileScreen />)
    expect(getByText('Jane Smith')).toBeTruthy()
  })

  it('calls useAuthStore to get logout function', () => {
    render(<ProfileScreen />)
    expect(useAuthStore).toHaveBeenCalled()
  })

  it('calls useAuthStore to get currentUser', () => {
    render(<ProfileScreen />)
    expect(useAuthStore).toHaveBeenCalled()
  })

  it('logout button can be pressed multiple times', () => {
    const { getByText } = render(<ProfileScreen />)
    const logoutButton = getByText('Logout')
    
    fireEvent.press(logoutButton)
    fireEvent.press(logoutButton)
    
    expect(mockLogout).toHaveBeenCalledTimes(2)
  })

  it('renders all header elements', () => {
    const { getByText } = render(<ProfileScreen />)
    expect(getByText('User Profile')).toBeTruthy()
    expect(getByText('⚙️')).toBeTruthy()
  })

  it('matches snapshot', () => {
    const { toJSON } = render(<ProfileScreen />)
    expect(toJSON()).toMatchSnapshot()
  })
})
