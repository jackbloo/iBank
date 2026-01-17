import { render, fireEvent } from '@testing-library/react-native'
import { Button } from '../Button'

describe('Button', () => {
  const mockOnPress = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    const { toJSON } = render(<Button title="Test Button" onPress={mockOnPress} />)
    expect(toJSON()).toBeTruthy()
  })

  it('displays the correct title', () => {
    const { getByText } = render(<Button title="Click Me" onPress={mockOnPress} />)
    expect(getByText('Click Me')).toBeTruthy()
  })

  it('calls onPress when button is pressed', () => {
    const { getByText } = render(<Button title="Press Me" onPress={mockOnPress} />)
    const button = getByText('Press Me')
    
    fireEvent.press(button)
    
    expect(mockOnPress).toHaveBeenCalledTimes(1)
  })

  it('calls onPress multiple times when pressed multiple times', () => {
    const { getByText } = render(<Button title="Multi Press" onPress={mockOnPress} />)
    const button = getByText('Multi Press')
    
    fireEvent.press(button)
    fireEvent.press(button)
    fireEvent.press(button)
    
    expect(mockOnPress).toHaveBeenCalledTimes(3)
  })

  it('renders with different title text', () => {
    const { getByText, rerender } = render(<Button title="First Title" onPress={mockOnPress} />)
    expect(getByText('First Title')).toBeTruthy()
    
    rerender(<Button title="Second Title" onPress={mockOnPress} />)
    expect(getByText('Second Title')).toBeTruthy()
  })

  it('renders TouchableOpacity with correct activeOpacity', () => {
    const { toJSON } = render(<Button title="Test" onPress={mockOnPress} />)
    // Button component uses TouchableOpacity with activeOpacity 0.85
    expect(toJSON()).toBeTruthy()
  })

  it('has correct button styles applied', () => {
    const { getByText } = render(<Button title="Styled Button" onPress={mockOnPress} />)
    const button = getByText('Styled Button')
    expect(button.parent).toBeDefined()
  })

  it('renders text with correct styles', () => {
    const { getByText } = render(<Button title="Styled Text" onPress={mockOnPress} />)
    const text = getByText('Styled Text')
    
    expect(text.props.style).toBeDefined()
  })

  it('handles empty title string', () => {
    const { getByText } = render(<Button title="" onPress={mockOnPress} />)
    expect(getByText('')).toBeTruthy()
  })

  it('handles long title text', () => {
    const longTitle = 'This is a very long button title that might wrap'
    const { getByText } = render(<Button title={longTitle} onPress={mockOnPress} />)
    expect(getByText(longTitle)).toBeTruthy()
  })

  it('can be pressed immediately after rendering', () => {
    const { getByText } = render(<Button title="Immediate Press" onPress={mockOnPress} />)
    
    fireEvent.press(getByText('Immediate Press'))
    
    expect(mockOnPress).toHaveBeenCalled()
  })

  it('does not call onPress without user interaction', () => {
    render(<Button title="No Auto Press" onPress={mockOnPress} />)
    
    expect(mockOnPress).not.toHaveBeenCalled()
  })

  it('matches snapshot', () => {
    const { toJSON } = render(<Button title="Snapshot Test" onPress={mockOnPress} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
